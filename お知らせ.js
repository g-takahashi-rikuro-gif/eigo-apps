/**
 * アップデートのお知らせ（全アプリ共通）
 *
 * 各ページから <script src="お知らせ.js"></script> で読み込む。
 * 新しいお知らせがあるときだけ、アプリを開いたタイミングで1回表示する。
 * 一度「確認した」を押すと、次のお知らせが出るまで表示されない。
 *
 * ===== お知らせを追加するには =====
 * 1. 下の UPDATES のいちばん上に、同じ形で1つ書き足す。
 *    id は他と重ならない文字列（日付がおすすめ）にすること。
 *    id が変わると、全員にもう一度お知らせが表示される。
 *
 * 2. ★重要★ 各HTMLの読み込み行にある ?v=数字 を新しい数字に変える。
 *      <script src="お知らせ.js?v=20261018f"></script>
 *    ブラウザはこのファイルを一度読むとしばらく覚えてしまうため、
 *    この数字を変えないと、生徒の端末では古い内容のままになる。
 *    （進捗同期.js を更新したときも同じ）
 */
(function () {
  'use strict';

  var UPDATES = [
    {
      id: '2026-10-18b',
      date: '2026年10月18日',
      title: 'タイピングチャレンジを追加しました',
      items: [
        '【単語学習】<b>「タイピングチャレンジ」</b>を追加しました。1年〜3年の<b>大事な単語499語</b>から出題されます。',
        '<b>⏱️ タイムアタック</b>（60秒で何問）／<b>♾️ 無限</b>（決めた数だけミスしたら終了）／<b>🏃 スプリント30問</b>（タイムを競う）／<b>🔥 弱点チャレンジ</b>（60秒、または全部クリアで終了）の4つのモードがあります。',
        'どのモードも<b>📖 ノーマル（日本語を見て打つ）</b>と<b>🎧 リスニング（音声を聞いて打つ）</b>から選べます。出題する範囲は「3年間ぜんぶ」のほか<b>学年ごと</b>、無限モードは<b>ミス1・ミス2・ミス3</b>から選べます。',
        'ポイントは<b>遊ぶたびに加算</b>されます（正解した数 × 1問あたりの点）。1問あたり（ノーマル→リスニング）、タイムアタック・スプリント・弱点は<b>1点→1.5点</b>、無限はミス1が<b>1.5点→1.8点</b>・ミス2が<b>1点→1.2点</b>・ミス3が<b>0.8点→1点</b>。たまったポイントはランキングの総合ポイントに入ります。',
        '<b>🏆 タイピングチャレンジ専用ランキング</b>を追加しました。1回のプレイで正解した数のベスト10を、学年全体で見られます。',
        '結果の画面に<b>まちがえた単語の一覧</b>が出るので、そのまま復習に使えます。'
      ]
    },
    {
      id: '2026-10-18',
      date: '2026年10月18日',
      title: '1年生の単語が全部そろいました',
      items: [
        '【単語学習】1年生に <b>Unit 9・Unit 10・Let\'s Read</b> を追加しました。これで<b>教科書の全単元（519語）</b>がそろいました。',
        '【単語学習】全単元をまとめて練習できる<b>「まとめ」</b>を追加しました。Unit 1〜Let\'s Read の単語を重複なしで通して練習できます。',
        'Sentence（英文の中で使う）と Typing は、<b>太字の大事な単語305語</b>が対象です。',
        'これまでの学習記録はそのまま残っています。Unit 1〜8 のトロフィーも消えません。'
      ]
    },
    {
      id: '2026-10-12',
      date: '2026年10月12日',
      title: '1年生の単語が使えるようになりました',
      items: [
        '【単語学習】<b>1年生の単語（355語）</b>を追加しました。「単語学習」から<b>「1年生」</b>を選ぶと使えます。',
        '教科書と同じ <b>Unit 1〜Unit 8</b> の区切りで入っています。',
        'Sentence（英文の中で使う）と Typing は、<b>太字の大事な単語228語</b>が対象です。',
        '1年生・2年生・3年生の記録はそれぞれ別に保存されます。これまでの学習記録はそのまま残るので安心してください。'
      ]
    },
    {
      id: '2026-10-11',
      date: '2026年10月11日',
      title: '単語学習の不具合を直しました',
      items: [
        '【単語学習】<b>1回目で全問正解したときに銀トロフィーがもらえない</b>不具合を直しました。すでに金トロフィーだけ持っている人は、<b>次にその単元を開くと自動で銀がつきます</b>（やり直しは必要ありません）。',
        '【単語学習】これにより、銀トロフィーがないと遊べなかった<b>「オープンマッチ」「ワードハント」</b>も遊べるようになります。',
        '【単語学習】2年生 Unit 4 の <b>Mrs.</b> が、正しく入力しても不正解になっていた問題を直しました。',
        '不具合を教えてくれたみなさん、ありがとう。気づいたことがあったら先生に教えてください。'
      ]
    },
    {
      id: '2026-10-04b',
      date: '2026年10月4日',
      title: '2年生の単語が使えるようになりました',
      items: [
        '【単語学習】<b>2年生の単語（483語）</b>を追加しました。「単語学習」から<b>「2年生」</b>を選ぶと使えます。',
        '教科書と同じ Unit 0〜1 から Let\'s Read 3 までの区切りで入っています。全部まとめて練習できる「まとめ」もあります。',
        'Sentence（英文の中で使う）は、<b>太字の大事な単語143語</b>で練習できます。Typingもその143語が対象です。',
        '2年生と3年生の記録は別々に保存されます。3年生の学習記録はそのまま残っているので安心してください。'
      ]
    },
    {
      id: '2026-10-04',
      date: '2026年10月4日',
      title: '学習の記録と単語アプリが新しくなりました',
      items: [
        '【単語学習】達成率の数え方を見直しました。<b>同じ単語に2回続けて正解すると「習得」</b>になります。前に間違えた記録を引きずらないので、覚えた分がすぐ反映されます。',
        '【単語学習】<b>「まだ習得していない単語だけ出題する」</b>設定を追加しました。学習モードの上のチェックを入れると、覚えた単語を飛ばして練習できます。',
        '【単語学習】Unit 1のSentenceで、fashionの問題に空所がなかったのを直しました。教えてくれた人、ありがとう。',
        '【英検対策】模試の結果が<b>記録として残る</b>ようになりました。「これまでの記録」から見返せます。',
        '【全体】トップページに<b>「わたしの進捗」</b>を追加しました。自分のポイントと学年の中での順位が分かります。'
      ]
    }
  ];

  var SEEN_KEY = 'last_seen_update';

  function readSeen() {
    try { return localStorage.getItem(SEEN_KEY); } catch (e) { return null; }
  }
  function writeSeen(id) {
    try { localStorage.setItem(SEEN_KEY, id); } catch (e) {}
  }

  // ページ側のCSSに左右されないよう、必要な見た目はここで用意する
  function injectStyle() {
    if (document.getElementById('upd-style')) return;
    var css = [
      '.upd-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9999;',
      'display:flex;align-items:center;justify-content:center;padding:20px;}',
      '.upd-box{background:#fff;border-radius:22px;width:100%;max-width:460px;max-height:85vh;',
      'overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.4);',
      "font-family:'Segoe UI','Hiragino Kaku Gothic ProN','Meiryo',sans-serif;}",
      '.upd-head{background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:20px 24px;',
      'border-radius:22px 22px 0 0;}',
      '.upd-badge{display:inline-block;background:rgba(255,255,255,.22);border-radius:50px;',
      'padding:3px 12px;font-size:.72em;font-weight:800;margin-bottom:8px;}',
      '.upd-title{font-size:1.12em;font-weight:900;line-height:1.5;}',
      '.upd-date{font-size:.78em;opacity:.85;margin-top:4px;}',
      '.upd-body{padding:20px 24px 8px;}',
      '.upd-item{display:flex;gap:10px;font-size:.88em;color:#444;line-height:1.75;margin-bottom:14px;text-align:left;}',
      '.upd-item .upd-dot{color:#5B6CF5;font-weight:900;flex-shrink:0;}',
      '.upd-item b{color:#5B6CF5;}',
      '.upd-foot{padding:4px 24px 22px;}',
      '.upd-btn{display:block;width:100%;padding:13px 0;border:none;border-radius:50px;cursor:pointer;',
      "font-size:.95em;font-weight:800;font-family:inherit;",
      'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;}',
      '.upd-btn:hover{opacity:.92;}',
      '.upd-hist{margin-top:10px;background:none;border:none;color:#999;font-size:.78em;',
      'font-family:inherit;cursor:pointer;text-decoration:underline;width:100%;}',
      '.upd-hist:hover{color:#5B6CF5;}',
      '.upd-old{border-top:1px solid #eee;margin-top:16px;padding-top:14px;}',
      '.upd-old .upd-title{color:#333;font-size:1em;}',
      '.upd-old .upd-date{color:#aaa;}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'upd-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function itemsHtml(update) {
    return update.items.map(function (t) {
      return '<div class="upd-item"><span class="upd-dot">●</span><span>' + t + '</span></div>';
    }).join('');
  }

  function close(overlay) {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  /** 最新のお知らせを表示する */
  function showLatest() {
    var update = UPDATES[0];
    if (!update) return;
    injectStyle();

    var overlay = document.createElement('div');
    overlay.className = 'upd-overlay';
    overlay.innerHTML =
      '<div class="upd-box">' +
        '<div class="upd-head">' +
          '<div class="upd-badge">🆕 アップデート</div>' +
          '<div class="upd-title">' + update.title + '</div>' +
          '<div class="upd-date">' + update.date + '</div>' +
        '</div>' +
        '<div class="upd-body">' + itemsHtml(update) + '</div>' +
        '<div class="upd-foot">' +
          '<button class="upd-btn" type="button">確認した</button>' +
          (UPDATES.length > 1 ? '<button class="upd-hist" type="button">これまでの更新を見る</button>' : '') +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector('.upd-btn').addEventListener('click', function () {
      writeSeen(update.id);
      close(overlay);
    });
    var hist = overlay.querySelector('.upd-hist');
    if (hist) hist.addEventListener('click', function () {
      writeSeen(update.id);
      close(overlay);
      showAll();
    });
  }

  /** これまでの更新をすべて表示する（トップページの「更新履歴」から呼ぶ） */
  function showAll() {
    injectStyle();
    var overlay = document.createElement('div');
    overlay.className = 'upd-overlay';
    var body = UPDATES.map(function (u, i) {
      return '<div class="' + (i === 0 ? '' : 'upd-old') + '">' +
        '<div class="upd-title" style="color:#333;">' + u.title + '</div>' +
        '<div class="upd-date" style="color:#aaa;margin-bottom:10px;">' + u.date + '</div>' +
        itemsHtml(u) +
      '</div>';
    }).join('');
    overlay.innerHTML =
      '<div class="upd-box">' +
        '<div class="upd-head">' +
          '<div class="upd-badge">📒 更新履歴</div>' +
          '<div class="upd-title">これまでの更新</div>' +
        '</div>' +
        '<div class="upd-body">' + body + '</div>' +
        '<div class="upd-foot"><button class="upd-btn" type="button">閉じる</button></div>' +
      '</div>';
    document.body.appendChild(overlay);
    overlay.querySelector('.upd-btn').addEventListener('click', function () { close(overlay); });
  }

  function maybeShow() {
    if (!UPDATES.length) return;
    if (readSeen() === UPDATES[0].id) return;
    // 生徒情報の登録画面など、他のモーダルが出ているときは重ねない。
    // その場合は表示を見送り、次に開いたときに出す。
    if (document.querySelector('.modal-overlay.show, .trophy-overlay')) return;
    showLatest();
  }

  window.AppUpdates = {
    list: UPDATES,
    latestId: UPDATES.length ? UPDATES[0].id : null,
    showLatest: showLatest,
    showAll: showAll
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(maybeShow, 400); });
  } else {
    setTimeout(maybeShow, 400);
  }
})();
