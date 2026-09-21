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
  var LAST_SYNC_KEY = 'last_sync_payload';
  var VOCAB_KEY     = 'vocab_summary';

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

  // ---------- 生徒情報 ----------
  function getProfile() {
    var p = readJSON(PROFILE_KEY);
    if (p && p.cls && (p.num || p.num === 0)) return p;
    return null;
  }
  function saveProfile(cls, num, name) {
    var p = { cls: String(cls).trim(), num: Number(num), name: String(name || '').trim() };
    writeJSON(PROFILE_KEY, p);
    return p;
  }
  function clearProfile() {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(LAST_SYNC_KEY);
    } catch (e) {}
  }

  // ---------- 学習データの集計 ----------
  // 単語学習側は vocabulary-trainer.html が VOCAB_KEY にスナップショットを
  // 保存してくれるので、ここではそれを読むだけでよい。
  function collect() {
    var vocab = readJSON(VOCAB_KEY) || {};

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

    return {
      vocab: vocab,
      eiken: { mockCount: mockCount, bestScore: bestScore, latestVerdict: latestVerdict }
    };
  }

  // ---------- 送信 ----------
  // GASのウェブアプリはCORSのプリフライトに対応していないため、
  // Content-Typeを指定せず text/plain のまま送る（他のアプリと同じ作法）。
  function post(payloadObj) {
    return fetch(GAS_URL, { method: 'POST', body: JSON.stringify(payloadObj) })
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
          return Promise.resolve({ skipped: '変化なし' });
        }
      } catch (e) {}
    }

    return post(payload).then(function (res) {
      if (res && res.ok) {
        try { localStorage.setItem(LAST_SYNC_KEY, fingerprint); } catch (e) {}
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

  /** 先生用：全生徒のデータを取得する */
  function fetchAll(passcode) {
    return post({ mode: 'progress_list', passcode: passcode })
      .catch(function () { return { error: '通信できませんでした' }; });
  }

  window.ProgressSync = {
    GAS_URL: GAS_URL,
    getProfile: getProfile,
    saveProfile: saveProfile,
    clearProfile: clearProfile,
    collect: collect,
    sync: sync,
    fetchRanking: fetchRanking,
    fetchAll: fetchAll
  };

  // ページを開いたときに自動で同期する（登録済みのときだけ）
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { sync(false); });
  } else {
    sync(false);
  }
})();
