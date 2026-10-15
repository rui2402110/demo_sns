/*
 * index.js — page-local script for index.html (the timeline).
 * Builds the per-community tabs/feeds, handles tab switching, and wires the
 * composer + incoming "quote from work" flow to the active tab.
 * Depends on: community-common.js (Kakko), loader.js, composer.js, post-actions.js.
 */
(function () {
  // ---- お気に入りのコミュニティを「タブ + コミュニティTL」として表示する ----
  const favCommunities = Kakko.favIds().map(id => Kakko.get(id));
  (function buildCommunityFeeds() {
    const tabsNav = document.querySelector('.tabs');
    let lastFeed = document.getElementById('feed-follow');
    favCommunities.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'tab';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', 'false');
      btn.dataset.feed = c.id;
      btn.dataset.communityId = c.id;   // ホバーでコミュニティ情報を表示
      btn.textContent = c.name;
      tabsNav.appendChild(btn);

      const feed = document.createElement('main');
      feed.className = 'feed';
      feed.id = 'feed-' + c.id;
      feed.hidden = true;
      feed.innerHTML = c.posts.length
        ? c.posts.map(p => Kakko.postHTML(p, c)).join('')
        : '<p style="padding:50px 10px;text-align:center;color:var(--muted);font-size:13.5px;">まだ投稿がありません</p>';
      lastFeed.after(feed);
      lastFeed = feed;
    });
  })();

  // ---- tab switching ----
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');
  const feeds = { follow: document.getElementById('feed-follow') };
  favCommunities.forEach(c => { feeds[c.id] = document.getElementById('feed-' + c.id); });

  function positionIndicator(tab) {
    indicator.style.width = tab.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    Object.entries(feeds).forEach(([key, el]) => {
      if (el) el.hidden = tab.dataset.feed !== key;
    });
    positionIndicator(tab);
    updateComposerForTab(tab.dataset.feed);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
  window.addEventListener('resize', () => {
    const active = document.querySelector('.tab.active');
    if (active) positionIndicator(active);
  });

  // ---- タブ切り替えに合わせてコンポーザーの表示/投稿先を更新 ----
  // フォローTLには投稿機能を置かない。コミュニティタブでは、開いているコミュニティにのみ投稿できる。
  const communityNames = {};
  Kakko.all().forEach(c => { communityNames[c.id] = c.name; });
  function updateComposerForTab(feedKey) {
    if (!window.Composer) return;
    if (feedKey === 'follow' || !communityNames[feedKey]) {
      Composer.hide();
      return;
    }
    Composer.updateForTarget(feedKey);
  }

  // ---- 作品ページの「引用」ボタンから遷移してきた場合 ----
  // フォローTLには投稿機能が無いため、最初のコミュニティタブ(お気に入り)を開いてそこで引用投稿する
  function handleIncomingQuote() {
    const p = new URLSearchParams(window.location.search);
    const qid = p.get('quote');
    if (!qid) return;
    history.replaceState(null, '', 'index.html');
    const targetTab = document.querySelector('.tab[data-feed]:not([data-feed="follow"])');
    if (!targetTab) {
      Kakko.showToast('引用投稿できるコミュニティがありません。先にコミュニティに参加してください');
      return;
    }
    const WORKS = (window.Composer && Composer.WORKS) || [];
    const work = WORKS.find(w => w.id === qid) || {
      id: qid,
      title: p.get('title') || '作品',
      type: p.get('type') || '作品',
      author: p.get('author') || '',
      views: '—',
      icon: p.get('type') === '動画' ? 'video' : (p.get('type') === '画像' ? 'manga' : 'novel'),
      style: 'background: linear-gradient(135deg, var(--avatar-1), #7a3a2c 65%, var(--ink-soft));',
    };
    activateTab(targetTab);
    Composer.setQuote(work);
    Composer.focusInput();
  }

  // ---- 画面の初期化: コンポーネントを読み込んでから各種初期化を行う ----
  Promise.all([
    KakkoLoader.load('component-sidenav.frag', '#slot-sidenav').then(function () {
      KakkoLoader.markActiveNav('timeline');
    }),
    KakkoLoader.load('component-toast.frag', '#slot-toast'),
    KakkoLoader.load('component-composer.frag', '#slot-composer'),
    KakkoLoader.load('component-work-picker.frag', '#slot-work-picker'),
    KakkoLoader.load('component-mute-panel.frag', '#slot-mute-panel'),
    KakkoLoader.load('component-reply-modal.frag', '#slot-reply-modal')
  ]).then(function () {
    initComposer();
    initPostActions();
    initMutePanel();
    initReplyModal();
    const firstTab = document.querySelector('.tab');
    if (firstTab) positionIndicator(firstTab);
    handleIncomingQuote();
  });
})();
