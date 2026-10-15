/*
 * kakko. コミュニティ共通モジュール
 * ------------------------------------------------------------
 * - コミュニティ/ユーザーのデモデータ
 * - 参加・お気に入り・作成の状態(localStorage に保存。使えない環境ではページ内のみ保持)
 * - アイコン描画、概要内URLのリンク化
 * - コミュニティにカーソルを合わせると出る情報カード(ホバーカード)
 *
 * 使い方: 各ページで <script src="community-common.js"></script> を読み込むだけ。
 * ホバーカードを出したい要素には data-community-id="コミュニティID" を付ける。
 * (投稿内の .post-meta .community は名前から自動で判定する)
 */
(function () {
  'use strict';

  var KEY = 'kakko.community.v1';

  // ---------- アイコン(色 × 図柄) ----------
  var GRADIENTS = {
    orange: 'linear-gradient(135deg, #e2833c, #7a3a2c 65%, #3a2c1d)',
    blue:   'linear-gradient(135deg, #7089b3, #2e4468 65%, #3a2c1d)',
    olive:  'linear-gradient(135deg, #82946b, #5c4a1f 65%, #3a2c1d)',
    green:  'linear-gradient(135deg, #6f8a5c, #384a2c 65%, #3a2c1d)',
    plum:   'linear-gradient(135deg, #9a6fa8, #4a2f56 65%, #3a2c1d)'
  };
  var GLYPHS = {
    star:   '<path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z"/>',
    book:   '<path d="M2.5 5h6.5a2 2 0 0 1 2 2v10a2 2 0 0 0-2-2H2.5V5Z"/><path d="M19.5 5H13a2 2 0 0 0-2 2v10a2 2 0 0 1 2-2h6.5V5Z"/>',
    moon:   '<path d="M17.5 13.5A7.5 7.5 0 1 1 8.5 4.5 6 6 0 0 0 17.5 13.5Z"/>',
    flower: '<circle cx="11" cy="5.5" r="2.8"/><circle cx="16.5" cy="11" r="2.8"/><circle cx="11" cy="16.5" r="2.8"/><circle cx="5.5" cy="11" r="2.8"/><circle cx="11" cy="11" r="1.6"/>',
    note:   '<path d="M8 16V5l9-2v11"/><circle cx="6" cy="16.5" r="2.2"/><circle cx="15" cy="14.5" r="2.2"/>'
  };

  // ---------- デモデータ ----------
  var USERS = [
    { id: 'yuki',   name: 'ゆき',   av: 'a1', ini: 'ゆ', created: '2026-03-01', community: 'hai' },
    { id: 'riku',   name: 'りく',   av: 'a2', ini: 'り', created: '2026-03-15', community: 'kosatsu' },
    { id: 'senna',  name: 'せんな', av: 'a3', ini: 'せ', created: '2026-04-10', community: 'silent' },
    { id: 'haruto', name: 'はると', av: 'a2', ini: 'は', created: '2026-05-20', community: 'yoru' },
    { id: 'shiori', name: 'しおり', av: 'a3', ini: 'し', created: '2026-07-01', community: 'hana' }
  ];

  var SEED = [
    {
      id: 'hai', name: '灰と星屑 感想部', work: '灰と星屑', members: 12000, host: 'yuki',
      created: '2026-03-02', baseJoined: true, icon: { glyph: 'star', color: 'orange' },
      desc: '隕石が降った夜から始まる、幼馴染ふたりの再生の物語について語り合うコミュニティです。ルールはこちら → https://example.com/hai-rules',
      posts: [
        { av: 'a1', ini: 'ゆ', name: 'ゆき', time: '3分前', body: '最終話、まさかあの伏線がここで回収されるとは…完全に予想を裏切られた。読み終えた後もしばらく放心してた。', likes: 24, comments: 5 },
        { av: 'a2', ini: 'り', name: 'りく', time: '2時間前', body: '3巻の表紙、伏線だったのか…読み返して鳥肌立った。', likes: 31, comments: 3 }
      ]
    },
    {
      id: 'silent', name: 'サイレント・チャプター部', work: 'サイレント・チャプター', members: 8400, host: 'senna',
      created: '2026-04-18', baseJoined: true, icon: { glyph: 'book', color: 'olive' },
      desc: '静かな筆致で描かれる心理劇「サイレント・チャプター」の感想を語り合うコミュニティです。',
      posts: [
        { av: 'a3', ini: 'せ', name: 'せんな', time: '1時間前', body: 'OPのアニメーションが毎回芸術点高すぎる。今期一番かもしれない。', likes: 56, comments: 12 }
      ]
    },
    {
      id: 'yoru', name: '夜想曲のリベルタを語る会', work: '夜想曲のリベルタ', members: 6200, host: 'haruto',
      created: '2026-06-05', baseJoined: false, icon: { glyph: 'moon', color: 'blue' },
      desc: '亡くなった恋人を想う主人公の、痛みと再生の物語。誰でもすぐに参加できます。',
      posts: [
        { av: 'a2', ini: 'は', name: 'はると', time: '25分前', body: 'え、あの二人がまさかの再会…？！ここからどう転がるのか全く読めない', likes: 9, comments: 1 }
      ]
    },
    {
      id: 'hana', name: '花布の記憶 読書会', work: '花布の記憶', members: 3100, host: 'shiori',
      created: '2026-07-22', baseJoined: false, icon: { glyph: 'flower', color: 'green' },
      desc: '静かな連作短編集『花布の記憶』の読書会です。毎週の課題話はこちら → https://example.com/kafu-schedule',
      posts: [
        { av: 'a3', ini: 'し', name: 'しおり', time: '昨日', body: '今週の課題は第3編。あの一文の余韻がずっと残ってる。', likes: 14, comments: 2 }
      ]
    },
    {
      id: 'kosatsu', name: '灰と星屑 考察部', work: '灰と星屑', members: 2400, host: 'riku',
      created: '2026-08-30', baseJoined: false, icon: { glyph: 'star', color: 'plum' },
      desc: '『灰と星屑』の伏線や構成を掘り下げる、考察好きのためのコミュニティです。',
      posts: [
        { av: 'a2', ini: 'り', name: 'りく', time: '3時間前', body: '冒頭の隕石の描写、ラストの再会と対になってる気がする。', likes: 18, comments: 4 }
      ]
    }
  ];

  // ---------- 状態(参加・お気に入り・自作) ----------
  function defaults() { return { joined: ['hai', 'silent'], fav: ['hai', 'silent'], custom: {} }; }
  var state;
  try {
    var raw = window.localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : defaults();
  } catch (e) { state = defaults(); }
  if (!state || !state.joined || !state.fav || !state.custom) state = defaults();

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 保存できない環境ではページ内のみ */ }
  }

  // ---------- ユーティリティ ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // 概要内のURLをリンクにする(クリックで該当ページへ遷移)
  function linkify(text) {
    var safe = esc(text == null ? '' : text);
    return safe.replace(/https?:\/\/[A-Za-z0-9\-._~:\/?#\[\]@!$&;'()*+,=%]+/g, function (url) {
      var trail = '';
      var m = url.match(/[.,;:!?)'&;]+$/);
      if (m) { trail = m[0]; url = url.slice(0, url.length - trail.length); }
      return '<a class="kc-link" href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>' + trail;
    });
  }

  function toMs(v) { return typeof v === 'number' ? v : Date.parse(v + 'T00:00:00'); }
  function dateText(v) {
    var d = new Date(toMs(v));
    return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');
  }

  function userById(id) { for (var i = 0; i < USERS.length; i++) if (USERS[i].id === id) return USERS[i]; return null; }

  function normalize(raw, id) {
    var host = raw.host;
    if (typeof host === 'string') {
      var u = userById(host);
      host = u ? { name: u.name, av: u.av, ini: u.ini } : { name: host, av: 'a1', ini: host.charAt(0) };
    }
    return {
      id: id, name: raw.name, work: raw.work, members: raw.members, host: host,
      created: toMs(raw.created), baseJoined: !!raw.baseJoined,
      icon: raw.icon || { glyph: 'star', color: 'orange' },
      desc: raw.desc || '', posts: raw.posts || []
    };
  }

  function all() {
    var list = SEED.map(function (s) { return normalize(s, s.id); });
    Object.keys(state.custom).forEach(function (id) { list.push(normalize(state.custom[id], id)); });
    return list;
  }
  function get(id) { var l = all(); for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function findByName(name) { var l = all(); for (var i = 0; i < l.length; i++) if (l[i].name === name) return l[i]; return null; }

  function isJoined(id) { return state.joined.indexOf(id) !== -1; }
  function joinedIds() { return state.joined.filter(function (id) { return !!get(id); }); }
  function favIds() { return state.fav.filter(function (id) { return isJoined(id) && !!get(id); }); }
  function isFav(id) { return state.fav.indexOf(id) !== -1 && isJoined(id); }

  function join(id) {
    if (!get(id)) return false;
    if (!isJoined(id)) { state.joined.push(id); save(); }
    return true;
  }
  function leave(id) {
    state.joined = state.joined.filter(function (x) { return x !== id; });
    state.fav = state.fav.filter(function (x) { return x !== id; });
    save();
  }
  function toggleFav(id) {
    if (!isJoined(id)) return false;
    if (isFav(id)) state.fav = state.fav.filter(function (x) { return x !== id; });
    else state.fav.push(id);
    save();
    return isFav(id);
  }

  // オープンのみ: 作成した時点で誰でもすぐ参加できる
  function create(data) {
    var id = 'u' + Date.now().toString(36);
    state.custom[id] = {
      name: data.name, work: data.work, desc: data.desc || '', icon: data.icon,
      created: Date.now(), members: 1, baseJoined: true, posts: [],
      host: { name: 'あなた', av: 'a1', ini: 'あ' }
    };
    state.joined.push(id);
    save();
    return id;
  }

  function memberCount(c) { return c.members + (isJoined(c.id) ? 1 : 0) - (c.baseJoined ? 1 : 0); }
  function memberText(c) {
    var n = Math.max(0, memberCount(c));
    return n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, '') + '万人' : n.toLocaleString('en-US') + '人';
  }

  // ---------- アイコン ----------
  function glyphSVG(name, px) {
    return '<svg width="' + px + '" height="' + px + '" viewBox="0 0 22 22" fill="none" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round">' + (GLYPHS[name] || GLYPHS.star) + '</svg>';
  }
  function iconHTML(c, opt) {
    opt = opt || {};
    var size = opt.size || 46, radius = opt.radius || Math.round(size * 0.26);
    var icon = c.icon || {};
    var base = 'flex:none;width:' + size + 'px;height:' + size + 'px;border-radius:' + radius + 'px;display:flex;align-items:center;justify-content:center;overflow:hidden;';
    if (icon.image) {
      return '<span class="kc-icon" style="' + base + 'background:#3a2c1d center/cover no-repeat url(' + icon.image + ');"></span>';
    }
    return '<span class="kc-icon" style="' + base + 'background:' + (GRADIENTS[icon.color] || GRADIENTS.orange) + ';">' + glyphSVG(icon.glyph, Math.round(size * 0.46)) + '</span>';
  }

  // ---------- 投稿カード(コミュニティTL用) ----------
  var HEART = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.8s-5.6-3.4-5.6-7.3a3.1 3.1 0 0 1 5.6-1.9 3.1 3.1 0 0 1 5.6 1.9c0 3.9-5.6 7.3-5.6 7.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  var BUBBLE = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 3.5h11v7.2h-6l-3 2.6v-2.6h-2V3.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  function postHTML(p, c) {
    return '<article class="post">' +
      '<div class="post-head">' +
        '<div class="avatar ' + p.av + '">' + esc(p.ini) + '</div>' +
        '<div class="post-meta">' +
          '<span class="name">' + esc(p.name) + '</span>' +
          '<span class="community" data-community-id="' + c.id + '">' + esc(c.name) + '</span>' +
        '</div>' +
        '<time class="time">' + esc(p.time) + '</time>' +
      '</div>' +
      '<p class="body">' + esc(p.body) + '</p>' +
      '<div class="engage">' +
        '<button class="engage-btn like" aria-label="いいね">' + HEART + '\n' + p.likes + '\n</button>' +
        '<button class="engage-btn" aria-label="コメント">' + BUBBLE + '\n' + p.comments + '\n</button>' +
      '</div>' +
    '</article>';
  }
  function attachLikes(root) {
    root.querySelectorAll('.engage-btn.like').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var countEl = btn.childNodes[btn.childNodes.length - 1];
        var current = parseInt(btn.textContent.trim(), 10);
        var liked = btn.classList.toggle('active');
        countEl.textContent = '\n' + (liked ? current + 1 : current - 1) + '\n';
      });
    });
  }

  // ---------- コミュニティ情報カード(タイルにカーソルを合わせるとその場に浮かぶ) ----------
  var HOVER_SEL = '[data-community-id], .post-meta .community';
  var showTimer = null, hideTimer = null, currentTarget = null, openAnchor = null;
  var hoverCard = null;

  function injectCSS() {
    if (document.getElementById('kc-style')) return;
    var st = document.createElement('style');
    st.id = 'kc-style';
    st.textContent =
      '.kc-card{position:fixed;z-index:60;box-sizing:border-box;padding:16px 18px;background:#2a1d12;border:1px solid rgba(243,230,210,.14);border-radius:16px;box-shadow:0 16px 36px rgba(0,0,0,.4);font-family:"Manrope",sans-serif;color:var(--paper-text,#f4ead9);text-align:left;opacity:0;transform:translateY(-6px);transition:opacity .16s ease,transform .16s ease;pointer-events:none;}' +
      '.kc-card.kc-open{opacity:1;transform:none;pointer-events:auto;}' +
      '.kc-h-head{display:flex;align-items:center;gap:12px;margin-bottom:10px}' +
      '.kc-h-title{min-width:0}' +
      '.kc-h-name{font-family:"Fraunces",serif;font-weight:500;font-size:15px;margin:0 0 2px;color:var(--paper-text,#f4ead9)}' +
      '.kc-h-work{font-size:12px;margin:0;color:var(--muted,#b6a289)}' +
      '.kc-h-stats{font-size:12px;margin:0 0 8px;color:var(--muted,#b6a289)}' +
      '.kc-h-stats strong{color:var(--paper-text,#f4ead9);font-weight:600}' +
      '.kc-h-desc{font-size:12.5px;line-height:1.65;margin:0 0 12px;color:var(--paper-text,#f4ead9);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;word-break:break-all}' +
      '.kc-h-link{font-size:12.5px;font-weight:700;color:var(--accent,#e07b2e);text-decoration:none}' +
      '.kc-h-link:hover{text-decoration:underline}' +
      '.kc-link{color:var(--accent,#e07b2e);text-decoration:underline;text-underline-offset:2px;word-break:break-all}' +
      '.kc-link:hover{opacity:.8}' +
      '[data-community-id]{cursor:pointer}' +
      '.post-meta .community{cursor:pointer}' +
      '.post-head .avatar,.result-user .avatar,.notif-item .avatar,.comment-item .avatar,.video-channel-row .avatar,.work-author-row .avatar,.reply-original .avatar,.host-row .avatar{cursor:pointer}';
    document.head.appendChild(st);
  }

  function idFor(el) {
    var id = el.getAttribute('data-community-id');
    if (id) return id;
    var c = findByName(el.textContent.trim());
    return c ? c.id : null;
  }

  // ホバーされた要素から「どのブロックの情報を出すか」を決める(位置合わせの基準にもなる)
  function resolveAnchor(t) {
    var card = t.closest('[data-community-id]');
    if (card) return card;
    var head = t.closest('.post-head');
    if (head) return head;
    return t.parentElement;
  }

  function ensureCard() {
    if (hoverCard && hoverCard.isConnected) return hoverCard;
    injectCSS();
    hoverCard = document.createElement('div');
    hoverCard.className = 'kc-card';
    document.body.appendChild(hoverCard);
    hoverCard.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    hoverCard.addEventListener('mouseleave', scheduleHide);
    return hoverCard;
  }

  function fillCard(card, id) {
    var c = get(id);
    if (!c) return false;
    card.innerHTML =
      '<div class="kc-h-head">' + iconHTML(c, { size: 44, radius: 12 }) +
        '<div class="kc-h-title"><p class="kc-h-name">' + esc(c.name) + '</p><p class="kc-h-work">『' + esc(c.work) + '』</p></div>' +
      '</div>' +
      '<p class="kc-h-stats">' + memberText(c) + ' ・ ホスト <strong>' + esc(c.host.name) + '</strong></p>' +
      '<p class="kc-h-desc">' + linkify(c.desc) + '</p>' +
      '<a class="kc-h-link" href="community-detail.html?c=' + encodeURIComponent(c.id) + '">コミュニティ詳細を見る →</a>';
    return true;
  }

  function positionCard(card, anchor) {
    var r = anchor.getBoundingClientRect();
    var width = Math.max(280, Math.min(360, r.width));
    var left = r.left;
    if (left + width > window.innerWidth - 12) left = Math.max(12, window.innerWidth - 12 - width);
    card.style.width = width + 'px';
    card.style.left = left + 'px';
    card.style.top = (r.bottom + 8) + 'px';
  }

  function openCard(target, id) {
    var anchor = resolveAnchor(target);
    if (!anchor) return;
    var card = ensureCard();
    if (!fillCard(card, id)) return;
    positionCard(card, anchor);
    currentTarget = target;
    openAnchor = anchor;
    requestAnimationFrame(function () { card.classList.add('kc-open'); });
  }
  function closeCard() {
    if (hoverCard) hoverCard.classList.remove('kc-open');
    openAnchor = null;
    currentTarget = null;
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(closeCard, 160);
  }

  document.addEventListener('mouseover', function (e) {
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('.kc-card')) return;
    var t = e.target.closest(HOVER_SEL);
    if (!t) return;
    if (t === currentTarget) { clearTimeout(hideTimer); return; }
    var id = idFor(t);
    if (!id) return;
    clearTimeout(hideTimer);
    clearTimeout(showTimer);
    showTimer = setTimeout(function () { openCard(t, id); }, 220);
  });
  document.addEventListener('mouseout', function (e) {
    if (!e.target || !e.target.closest) return;
    if (e.target.closest('.kc-card')) return;
    if (!e.target.closest(HOVER_SEL)) return;
    clearTimeout(showTimer);
    scheduleHide();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCard(); });
  window.addEventListener('scroll', function () {
    if (openAnchor && hoverCard && hoverCard.classList.contains('kc-open')) positionCard(hoverCard, openAnchor);
  }, true);
  window.addEventListener('resize', function () {
    if (openAnchor && hoverCard && hoverCard.classList.contains('kc-open')) positionCard(hoverCard, openAnchor);
  });

  // リンク用のスタイルはページ読み込み時に注入する(スライドを出す前でもURLを見やすくするため)
  injectCSS();

  // 戻る操作で古い状態が表示されないようにする
  window.addEventListener('pageshow', function (e) { if (e.persisted) window.location.reload(); });

  // ---------- ミュートワード(設定画面・タイムライン・コミュニティ詳細で共有) ----------
  var MUTE_KEY = 'kakko.mutewords.v1';
  function muteDefaults() { return { words: ['ネタバレ', '最終回'] }; }
  var muteState;
  try {
    var muteRaw = window.localStorage.getItem(MUTE_KEY);
    muteState = muteRaw ? JSON.parse(muteRaw) : muteDefaults();
  } catch (e) { muteState = muteDefaults(); }
  if (!muteState || !Array.isArray(muteState.words)) muteState = muteDefaults();

  function muteSave() {
    try { window.localStorage.setItem(MUTE_KEY, JSON.stringify(muteState)); } catch (e) { /* 保存できない環境ではページ内のみ */ }
  }
  var muteListeners = [];
  function muteNotify() { muteListeners.forEach(function (fn) { try { fn(muteWords()); } catch (e) {} }); }
  function onMuteWordsChange(fn) {
    if (typeof fn !== 'function') return function () {};
    muteListeners.push(fn);
    return function () { muteListeners = muteListeners.filter(function (f) { return f !== fn; }); };
  }
  function muteWords() { return muteState.words.slice(); }
  function addMuteWord(word) {
    var w = String(word == null ? '' : word).trim();
    if (!w) return false;
    if (muteState.words.indexOf(w) !== -1) return false;
    muteState.words.push(w);
    muteSave();
    muteNotify();
    return true;
  }
  function removeMuteWordAt(index) {
    if (index < 0 || index >= muteState.words.length) return false;
    muteState.words.splice(index, 1);
    muteSave();
    muteNotify();
    return true;
  }
  function updateMuteWordAt(index, word) {
    var w = String(word == null ? '' : word).trim();
    if (!w) return false;
    if (index < 0 || index >= muteState.words.length) return false;
    muteState.words[index] = w;
    muteSave();
    muteNotify();
    return true;
  }
  // 他タブ・他画面での変更をこの画面にも反映する
  window.addEventListener('storage', function (e) {
    if (e.key !== MUTE_KEY) return;
    try {
      muteState = e.newValue ? JSON.parse(e.newValue) : muteDefaults();
    } catch (err) { muteState = muteDefaults(); }
    if (!muteState || !Array.isArray(muteState.words)) muteState = muteDefaults();
    muteNotify();
  });

  // ---------- 他ユーザーのアイコン → プロフィール画面への遷移 ----------
  var SELF_NAMES = ['あなた'];
  var AVATAR_CONTAINER_SEL =
    '.post-head, .result-user, .notif-item, .comment-item, .video-channel-row, ' +
    '.work-author-row, .reply-original, .host-row';
  var AVATAR_NAME_SEL = '.name, .host-name, .video-author-name, .work-author-name';

  function userProfileDataFor(avatarEl) {
    var container = avatarEl.closest(AVATAR_CONTAINER_SEL) || avatarEl.parentElement;
    if (!container) return null;
    var nameEl = container.querySelector(AVATAR_NAME_SEL);
    var name = nameEl ? nameEl.textContent.trim() : '';
    // 通知画面: 本文中の<strong>名前</strong>から取得するケース
    if (!name) {
      var notifItem = avatarEl.closest('.notif-item');
      var strongEl = notifItem && notifItem.querySelector('.notif-text strong');
      if (strongEl) name = strongEl.textContent.trim();
    }
    if (!name) return null;
    var avatarClass = 'a1';
    var found = Array.prototype.find.call(avatarEl.classList, function (c) { return /^a[0-9]+$/.test(c); });
    if (found) avatarClass = found;
    return { name: name, avatarClass: avatarClass, initial: avatarEl.textContent.trim() };
  }

  function userProfileHref(data) {
    var p = 'name=' + encodeURIComponent(data.name) + '&avatar=' + encodeURIComponent(data.avatarClass);
    if (data.initial) p += '&initial=' + encodeURIComponent(data.initial);
    return 'user-profile.html?' + p;
  }

  document.addEventListener('click', function (e) {
    if (!e.target || !e.target.closest) return;
    var avatarEl = e.target.closest('.avatar');
    if (!avatarEl) return;
    var data = userProfileDataFor(avatarEl);
    // 自分自身(「あなた」)のアイコンは対象外。もともとのリンク/挙動に任せる
    if (!data || SELF_NAMES.indexOf(data.name) !== -1) return;
    e.preventDefault();
    e.stopPropagation();
    window.location.href = userProfileHref(data);
  });

  // ---------- トースト通知（複数ページ／複数機能JSから共有） ----------
  function showToast(message) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { el.classList.remove('show'); }, 2200);
  }

  // ---------- 公開API ----------
  window.Kakko = {
    GRADIENTS: GRADIENTS, GLYPHS: GLYPHS, USERS: USERS,
    all: all, get: get, findByName: findByName, userById: userById,
    isJoined: isJoined, joinedIds: joinedIds, favIds: favIds, isFav: isFav,
    join: join, leave: leave, toggleFav: toggleFav, create: create,
    memberCount: memberCount, memberText: memberText, dateText: dateText, toMs: toMs,
    esc: esc, linkify: linkify, iconHTML: iconHTML, glyphSVG: glyphSVG,
    postHTML: postHTML, attachLikes: attachLikes,
    muteWords: muteWords, addMuteWord: addMuteWord, removeMuteWordAt: removeMuteWordAt,
    updateMuteWordAt: updateMuteWordAt, onMuteWordsChange: onMuteWordsChange,
    showToast: showToast
  };
})();
