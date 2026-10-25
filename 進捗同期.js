/**
 * 進捗同期モジュール（全アプリ共通）
 *
 * 各ページから <script src="進捗同期.js"></script> で読み込んで使う。
 * ・生徒情報（クラス・出席番号・氏名）の保存と読み出し
 * ・localStorageに溜まった学習データを集計してGASへ送信
 * ・ランキングの取得
 *
 * GASのURLを変更したいときは、このファイルの GAS_URL だけ直せばよい。
 */
(function () {
  'use strict';

  var GAS_URL = 'https://script.google.com/macros/s/AKfycbxhCBU9aZ5eymIXqsAhtQoUvgaGJwEEt67UAN_ysTeZGGSLc1gXvWP-tSZHvDopKITJmg/exec';

  var PROFILE_KEY   = 'student_profile';
  var TEACHER_KEY   = 'teacher_code';
  var TEACHER_META_KEY = 'teacher_meta';
  var LAST_SYNC_KEY = 'last_sync_payload';
  var VOCAB_KEY     = 'vocab_summary';
  var TYPING_KEY    = 'typing_challenge';

  var EIKEN_LEVELS = {
    'eiken_records_3kyu':    '3級',
    'eiken_records_jun2kyu': '準2級',
    'eiken_records_2kyu':    '2級'
  };

  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  // ---------- どの先生のクラスか ----------
  //
  // 先生ごとに配るURLを変える。
  //   .../英語学習アプリ.html?t=yamada
  // 一度開けばこの端末に覚えるので、以降はふつうのURLでもよい。
  // ?t= が無く、覚えてもいない生徒は、作成者のクラス扱いになる
  // （これまでのURLを使っている生徒がそのまま続けられるようにするため）。
  function getTeacherCode() {
    try {
      var m = String(location.search || '').match(/[?&]t=([A-Za-z0-9_-]{1,32})/);
      if (m) {
        var code = m[1].toLowerCase();
        localStorage.setItem(TEACHER_KEY, code);
        return code;
      }
      return localStorage.getItem(TEACHER_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  /**
   * 選んだ先生の名前と学校を端末に覚えておく。
   * 先生一覧の取得はサーバー往復で数秒かかるので、それを待たずに
   * 登録画面へ前回の内容を出すために使う。
   */
  function getTeacherMeta() {
    var m = readJSON(TEACHER_META_KEY);
    return (m && m.school) ? m : null;
  }
  function setTeacherMeta(school, name) {
    writeJSON(TEACHER_META_KEY, { school: String(school || ''), name: String(name || '') });
  }

  /** 先生コードを手で設定し直す（登録画面から使う） */
  function setTeacherCode(code) {
    var c = String(code || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
    try {
      if (c) localStorage.setItem(TEACHER_KEY, c);
      else localStorage.removeItem(TEACHER_KEY);
    } catch (e) {}
    return c;
  }

  /** そのコードが誰のものかをサーバーに聞く（登録画面の確認表示用） */
  function fetchTeacherInfo(code) {
    return post({ mode: 'teacher_info', t: code || getTeacherCode() })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  /** 登録画面の「担当の先生」に出す一覧を取る */
  function fetchTeacherList() {
    return post({ mode: 'teacher_list' })
      .catch(function () { return { error: '通信できませんでした', teachers: [] }; });
  }

  // ---------- 生徒情報 ----------
  function getProfile() {
    var p = readJSON(PROFILE_KEY);
    if (p && p.cls && (p.num || p.num === 0)) return p;
    return null;
  }
  function saveProfile(cls, num, name, code) {
    var p = { cls: String(cls).trim(), num: Number(num), name: String(name || '').trim() };
    if (code) p.code = String(code).trim();
    writeJSON(PROFILE_KEY, p);
    return p;
  }
  function clearProfile() {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(LAST_SYNC_KEY);
    } catch (e) {}
  }

  // ================================================================
  //  端末の引き継ぎ（バックアップと復元）
  //
  //  学習記録はこの端末のブラウザの中にしかないので、まるごとサーバーに
  //  預けておき、別の端末で取り出せるようにする。
  //  ・単語名を鍵にしているので、あとから単語が増えてもズレない
  //  ・{correct,wrong,streak} は [c,w,s] の配列に縮めて容量を抑える
  //  ・学年ごと＋その他の4つに分けて預ける（1つが大きくなりすぎないように）
  // ================================================================
  var BACKUP_PARTS = ['g1', 'g2', 'g3', 'etc'];

  /** この保存キーが、どのまとまりに入るか */
  function partOf(key) {
    if (key.indexOf('wscroll_g1_') === 0) return 'g1';
    if (key.indexOf('wscroll_g2_') === 0) return 'g2';
    if (key.indexOf('wscroll_') === 0) return 'g3';   // 3年の単元idには接頭辞が無い
    return 'etc';
  }
  /** 引き継ぎの対象にする保存キーか */
  function isBackupKey(key) {
    return key.indexOf('wscroll_') === 0
        || key.indexOf('vocab_summary') === 0
        || key.indexOf('eiken_records_') === 0
        || key.indexOf('typing_challenge') === 0;
  }
  /** 単語ごとの記録を {en:[正解,不正解,連続]} に縮める／戻す */
  function packWords(obj) {
    var o = {};
    Object.keys(obj).forEach(function (en) {
      var p = obj[en] || {};
      o[en] = [Number(p.correct) || 0, Number(p.wrong) || 0, Number(p.streak) || 0];
    });
    return o;
  }
  function unpackWords(obj) {
    var o = {};
    Object.keys(obj).forEach(function (en) {
      var a = obj[en];
      if (Array.isArray(a)) o[en] = { correct: a[0] || 0, wrong: a[1] || 0, streak: a[2] || 0 };
      else o[en] = a;
    });
    return o;
  }
  var WORD_DICT = /_(qzp|typ|stp)$/;

  /** いまの端末の記録を、預ける形にまとめる */
  function buildBackup() {
    var parts = { g1: {}, g2: {}, g3: {}, etc: {} };
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (!key || !isBackupKey(key)) continue;
      var raw = localStorage.getItem(key);
      var box = parts[partOf(key)];
      if (WORD_DICT.test(key)) {
        var d = readJSON(key);
        box[key] = (d && typeof d === 'object') ? packWords(d) : raw;
      } else {
        box[key] = raw;
      }
    }
    var out = {};
    BACKUP_PARTS.forEach(function (p) { out[p] = JSON.stringify({ v: 1, d: parts[p] }); });
    return out;
  }

  /** 預けた記録を、この端末に書き戻す */
  function applyBackup(parts) {
    var restored = 0;
    BACKUP_PARTS.forEach(function (p) {
      var text = parts && parts[p];
      if (!text) return;
      var box;
      try { box = JSON.parse(text); } catch (e) { return; }
      var d = (box && box.d) || {};
      Object.keys(d).forEach(function (key) {
        try {
          if (WORD_DICT.test(key) && typeof d[key] === 'object') {
            localStorage.setItem(key, JSON.stringify(unpackWords(d[key])));
          } else {
            localStorage.setItem(key, d[key]);
          }
          restored++;
        } catch (e) {}
      });
    });
    return restored;
  }

  /** この端末に学習の記録があるか（復元で上書きしてよいかの判断に使う） */
  function hasLocalProgress() {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('wscroll_') === 0 && WORD_DICT.test(k)) {
        var d = readJSON(k);
        if (d && Object.keys(d).length) return true;
      }
    }
    return false;
  }

  var BACKUP_FP_KEY = 'last_backup_payload';

  /**
   * 記録をサーバーに預ける
   * この端末に学習の記録が無いときは預けない。
   * 端末を替えた直後に空の記録で預けてしまうと、前の端末の記録が消えてしまうため。
   */
  function backupSave() {
    var p = getProfile();
    if (!p || !p.code) return Promise.resolve({ skipped: '合言葉が未設定' });
    if (!hasLocalProgress()) return Promise.resolve({ skipped: 'この端末に記録が無い' });

    var body = { mode: 'backup_save', cls: p.cls, num: p.num, name: p.name, code: p.code };
    var parts = buildBackup();
    BACKUP_PARTS.forEach(function (k) { body[k] = parts[k]; });

    // 中身が前回と同じなら送らない（通信の無駄打ち防止）
    var fp = JSON.stringify(parts);
    try {
      if (localStorage.getItem(BACKUP_FP_KEY) === fp) {
        return Promise.resolve({ skipped: '変化なし' });
      }
    } catch (e) {}

    return post(body).then(function (res) {
      if (res && res.ok) { try { localStorage.setItem(BACKUP_FP_KEY, fp); } catch (e) {} }
      return res;
    }).catch(function () { return { error: '通信できませんでした' }; });
  }

  /** その番号の預かり記録があるかだけを調べる（合言葉は不要。中身は返らない） */
  function backupExists(cls, num) {
    return post({ mode: 'backup_exists', cls: cls, num: num })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  /** 預けた記録を取り出して、この端末に戻す */
  function backupRestore(cls, num, code) {
    return post({ mode: 'backup_load', cls: cls, num: num, code: code })
      .then(function (res) {
        if (!res || res.error) return res || { error: '通信できませんでした' };
        var n = applyBackup(res);
        return { ok: true, restored: n, updated: res.updated || '' };
      })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  // ---------- 学習データの集計 ----------
  // 単語学習側は vocabulary-trainer.html が VOCAB_KEY にスナップショットを
  // 保存してくれるので、ここではそれを読むだけでよい。
  function collect() {
    // 1年生用・2年生用・3年生用のアプリは別々に要約を保存するので、ここで合算する
    var vocab = {};
    [VOCAB_KEY, VOCAB_KEY + '_g2', VOCAB_KEY + '_g1'].forEach(function (key) {
      var part = readJSON(key);
      if (!part) return;
      ['qzMastered','qzTotal','tyMastered','tyTotal','stMastered','stTotal','silver','gold','boss','unitCount']
        .forEach(function (f) { vocab[f] = (vocab[f] || 0) + (Number(part[f]) || 0); });
    });

    var mockCount = 0, bestScore = 0, latestTs = 0, latestVerdict = '';
    Object.keys(EIKEN_LEVELS).forEach(function (key) {
      var list = readJSON(key);
      if (!Array.isArray(list)) return;
      list.forEach(function (r) {
        mockCount++;
        var score = Number(r.scorePct) || 0;
        if (score > bestScore) bestScore = score;
        var ts = Number(r.ts) || 0;
        if (ts > latestTs) {
          latestTs = ts;
          latestVerdict = EIKEN_LEVELS[key] + ' ' + (r.examType || '') + '試験 ' + score + '%（' + (r.date || '') + '）';
        }
      });
    });

    // タイピングチャレンジのベスト記録
    // （スプリントはタイムなのでポイントにせず、完走した回数だけ数える）
    var tc = readJSON(TYPING_KEY) || {};
    var tcBest = tc.best || {};
    // ポイントは遊ぶたびに加算された累計。maxCorrect は1回のプレイでの最高正解数。
    var n = function (k) { return Number(tcBest[k]) || 0; };
    var sprintSecs = [n('sprint_n'), n('sprint_l')].filter(function (x) { return x > 0; });
    var typing = {
      points:     Number(tc.totalPoints) || 0,
      plays:      Number(tc.plays) || 0,
      maxCorrect: Number(tc.maxCorrect) || 0,
      bestTime: Math.max(n('time_n'), n('time_l')),
      bestWeak: Math.max(n('weak_n'), n('weak_l')),
      bestSurvival: Math.max(
        n('survival1_n'), n('survival1_l'),
        n('survival2_n'), n('survival2_l'),
        n('survival3_n'), n('survival3_l')
      ),
      bestSprintSec: sprintSecs.length ? Math.min.apply(null, sprintSecs) : 0
    };

    return {
      vocab: vocab,
      eiken: { mockCount: mockCount, bestScore: bestScore, latestVerdict: latestVerdict },
      typing: typing
    };
  }

  // ---------- 送信 ----------
  // GASのウェブアプリはCORSのプリフライトに対応していないため、
  // Content-Typeを指定せず text/plain のまま送る（他のアプリと同じ作法）。
  function post(payloadObj) {
    // どのリクエストにも先生コードを付ける。付け忘れると、
    // ほかの学校の同じクラス・同じ出席番号の生徒と記録が混ざってしまう。
    var body = {};
    for (var k in payloadObj) {
      if (Object.prototype.hasOwnProperty.call(payloadObj, k)) body[k] = payloadObj[k];
    }
    if (!body.t) body.t = getTeacherCode();

    return fetch(GAS_URL, { method: 'POST', body: JSON.stringify(body) })
      .then(function (res) { return res.json(); });
  }

  /**
   * 進捗をサーバーへ送る。
   * 前回と中身が変わっていなければ送信をスキップする（通信の無駄打ち防止）。
   * @param {boolean} force trueなら変化がなくても必ず送る
   */
  function sync(force) {
    var profile = getProfile();
    if (!profile) return Promise.resolve({ skipped: '未登録' });

    var payload = {
      mode: 'progress_save',
      cls: profile.cls,
      num: profile.num,
      name: profile.name,
      data: collect()
    };
    var fingerprint = JSON.stringify(payload);

    if (!force) {
      try {
        if (localStorage.getItem(LAST_SYNC_KEY) === fingerprint) {
          // 集計は変わっていなくても、単語ごとの記録は進んでいることがあるので
          // 引き継ぎ用の記録だけは預け直す（中身が同じなら中で送らない）
          backupSave();
          return Promise.resolve({ skipped: '変化なし' });
        }
      } catch (e) {}
    }

    return post(payload).then(function (res) {
      if (res && res.ok) {
        try { localStorage.setItem(LAST_SYNC_KEY, fingerprint); } catch (e) {}
        // 集計が変わったときだけ、引き継ぎ用の記録も預け直す
        backupSave();
      }
      return res;
    }).catch(function () {
      // オフラインや通信失敗でもアプリの動作は止めない
      return { error: '通信できませんでした' };
    });
  }

  /** 自分の順位とクラス内トップ10を取得する */
  function fetchRanking() {
    var profile = getProfile();
    if (!profile) return Promise.resolve({ error: '未登録' });
    return post({ mode: 'progress_rank', cls: profile.cls, num: profile.num })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  /**
   * タイピングチャレンジ専用の学年ランキングを取得する
   * metric: max（全モード最高正解数・既定）／ time ／ survival ／ sprint ／ weak
   */
  function fetchTypingRanking(metric) {
    var profile = getProfile();
    if (!profile) return Promise.resolve({ error: '未登録' });
    return post({ mode: 'typing_rank', cls: profile.cls, num: profile.num, metric: metric || 'max' })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  /** 先生用：全生徒のデータを取得する */
  function fetchAll(passcode) {
    return post({ mode: 'progress_list', passcode: passcode })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  window.ProgressSync = {
    GAS_URL: GAS_URL,
    getTeacherCode: getTeacherCode,
    setTeacherCode: setTeacherCode,
    getTeacherMeta: getTeacherMeta,
    setTeacherMeta: setTeacherMeta,
    fetchTeacherInfo: fetchTeacherInfo,
    fetchTeacherList: fetchTeacherList,
    getProfile: getProfile,
    saveProfile: saveProfile,
    clearProfile: clearProfile,
    collect: collect,
    sync: sync,
    hasLocalProgress: hasLocalProgress,
    backupSave: backupSave,
    backupRestore: backupRestore,
    backupExists: backupExists,
    fetchRanking: fetchRanking,
    fetchTypingRanking: fetchTypingRanking,
    fetchAll: fetchAll
  };

  // URLに ?t= が付いていたら、この時点で端末に覚えておく。
  // 未登録の生徒は sync() が何も送らないので、送信時まかせにすると
  // いちばん肝心な「初めて開いたとき」に取りこぼす。
  getTeacherCode();

  // ページを開いたときに自動で同期する（登録済みのときだけ）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { sync(false); });
  } else {
    sync(false);
  }
})();
