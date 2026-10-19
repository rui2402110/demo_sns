/*
 * community-detail.js — page-local script for community-detail.html.
 * Renders the community header, join/favorite actions, the post feed, and
 * builds this page's own composer/work-picker markup (community-detail has
 * historically generated these via JS strings rather than static HTML —
 * kept as-is here; IDs match component-composer.frag/component-work-picker.frag
 * so mute-panel.js / reply-modal.js / post-actions.js still work unchanged).
 * Depends on: community-common.js (Kakko), loader.js, post-actions.js,
 * mute-panel.js, reply-modal.js.
 */
function initCommunityDetail() {
  initPostReplies();
  // ---- コミュニティ詳細(一覧・検索・ホバーカードなど全ての入口から共通で開く画面) ----
  const params = new URLSearchParams(window.location.search);
  const community = Kakko.get(params.get('c'));
  const root = document.getElementById('detail-root');

  // 遷移元に合わせて「戻る」の行き先を変える
  const from = params.get('from');
  const backLink = document.getElementById('back-link');
  if (from === 'join') { backLink.href = 'community-join.html'; backLink.textContent = '← コミュニティ参加'; }
  if (from === 'hub')  { backLink.href = 'community.html'; backLink.textContent = '← コミュニティ'; }

  const STAR = filled => '<svg width="16" height="16" viewBox="0 0 22 22" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z"/></svg>';

  // ---- 作品引用カタログ（この画面ではアイコン表示のみ。画像プレビュー付きはタイムライン側の作品のみ） ----
  const WORK_ICONS = {
    novel: '<svg width="18" height="18" viewBox="0 0 22 22" fill="none"><path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/></svg>',
    blog: '<svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M4 4.5h9l3 3v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/><path d="M6.5 9h7M6.5 12h7M6.5 15h4" stroke="#f4ead9" stroke-width="1" stroke-linecap="round"/></svg>',
    manga: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="4.5" width="17" height="15" rx="1.6" stroke="#f4ead9" stroke-width="1.1"/><circle cx="8.5" cy="9.5" r="1.6" stroke="#f4ead9" stroke-width="1.1"/><path d="M4 17l5.5-5.5L14 16l2.5-2.5L20.5 18" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/></svg>',
    video: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#f4ead9" stroke-width="1.1"/><path d="M10 8.5l6 3.5-6 3.5v-7Z" fill="#f4ead9"/></svg>',
  };
  const WORKS = [
    { id: 'hai', title: '灰と星屑', type: '小説', icon: 'novel', author: 'つむぎ', views: '8.4万', style: 'background: linear-gradient(135deg, var(--avatar-1), #7a3a2c 65%, var(--ink-soft));' },
    { id: 'silent', title: 'サイレント・チャプター', type: '小説', icon: 'novel', author: '海野', views: '5.1万', style: 'background: linear-gradient(135deg, var(--avatar-3), #5c4a1f 65%, var(--ink-soft));' },
    { id: 'yoru', title: '夜想曲のリベルタ', type: '小説', icon: 'novel', author: 'はると', views: '3.9万', style: 'background: linear-gradient(135deg, var(--avatar-2), #2e4468 65%, var(--ink-soft));' },
    { id: 'hai-manga', title: '灰と星屑 コミカライズ版', type: '画像', icon: 'manga', author: 'みずき', views: '1.8万', style: 'background: linear-gradient(135deg, var(--avatar-1), #7a3a2c 65%, var(--ink-soft));' },
    { id: 'hai-pv', title: '灰と星屑 PV映像', type: '動画', icon: 'video', author: 'つむぎ', views: '2.6万', style: 'background: linear-gradient(135deg, #6f8a5c, #384a2c 65%, var(--ink-soft));' },
    { id: 'yoru-fanart', title: '夜想曲のリベルタ ファンアート集', type: '画像', icon: 'manga', author: 'りく', views: '3,200', style: 'background: linear-gradient(135deg, var(--avatar-2), #2e4468 65%, var(--ink-soft));' },
    { id: 'yuki-blog', title: 'ゆきの読書ノート', type: 'ブログ', icon: 'blog', author: 'ゆき', views: '620', style: 'background: linear-gradient(135deg, var(--avatar-1), #7a3a2c 65%, var(--ink-soft));' },
  ];

  // ---- このコミュニティ専用の投稿コンポーザー（参加済みの場合のみ表示。投稿先はこのコミュニティ固定） ----
  function composerHTML(c) {
    return '' +
      '<section class="composer" id="composer">' +
        '<p class="composer-target"><strong>' + Kakko.esc(c.name) + '</strong> に投稿します</p>' +
        '<div class="composer-row">' +
          '<div class="avatar a1">あ</div>' +
          '<textarea class="composer-input" id="composer-input" placeholder="いま感じたことをシェアしよう" rows="1"></textarea>' +
        '</div>' +
        '<div class="attach-preview" id="attach-preview" hidden>' +
          '<div class="attach-thumb" id="attach-thumb"></div>' +
          '<button class="attach-remove" id="attach-remove" type="button" aria-label="添付を削除">×</button>' +
        '</div>' +
        '<div class="quote-preview" id="quote-preview" hidden>' +
          '<div class="quote-preview-icon" id="quote-preview-icon"></div>' +
          '<div class="quote-preview-body">' +
            '<p class="quote-preview-title" id="quote-preview-title"></p>' +
            '<p class="quote-preview-meta" id="quote-preview-meta"></p>' +
          '</div>' +
          '<button class="attach-remove" id="quote-remove" type="button" aria-label="引用を解除">×</button>' +
        '</div>' +
        '<div class="composer-foot">' +
          '<div class="composer-tools">' +
            '<button class="tool-btn" id="tool-image" type="button" title="画像を添付">' +
              '<svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.8" y="3.8" width="14.4" height="12.4" rx="1.6" stroke="currentColor" stroke-width="1.3"/><circle cx="7.2" cy="8" r="1.3" stroke="currentColor" stroke-width="1.2"/><path d="M3.4 14.2l4.6-4.6 3.6 3.6 2.1-2.1 3.3 3.3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<button class="tool-btn" id="tool-video" type="button" title="動画を添付">' +
              '<svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="10.5" height="11" rx="1.6" stroke="currentColor" stroke-width="1.3"/><path d="M13 9.2l4.5-2.4v6.4L13 10.8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>' +
            '</button>' +
            '<button class="tool-btn" id="tool-quote" type="button" title="作品を引用">' +
              '<svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M5 6.5h10M5 10h10M5 13.5h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="composer-actions">' +
            '<button class="composer-cancel" id="composer-cancel" type="button">キャンセル</button>' +
            '<button class="composer-submit" id="composer-submit" type="button" disabled>投稿する</button>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<div class="palette-overlay" id="palette-overlay" hidden>' +
        '<div class="palette" role="dialog" aria-label="引用する作品を選ぶ">' +
          '<div class="palette-head">' +
            '<p class="palette-title">引用する作品を選ぶ</p>' +
            '<button class="palette-close" id="palette-close" type="button" aria-label="閉じる">×</button>' +
          '</div>' +
          '<div class="palette-list" id="palette-list"></div>' +
        '</div>' +
      '</div>';
  }

  function wireComposer(c) {
    const composer = document.getElementById('composer');
    if (!composer) return;
    const composerInput = document.getElementById('composer-input');
    const composerCancel = document.getElementById('composer-cancel');
    const composerSubmit = document.getElementById('composer-submit');
    const attachPreview = document.getElementById('attach-preview');
    const attachThumb = document.getElementById('attach-thumb');
    const quotePreview = document.getElementById('quote-preview');
    const paletteOverlay = document.getElementById('palette-overlay');
    const paletteList = document.getElementById('palette-list');

    let attachedMedia = null;  // '画像' | '動画'
    let quotedWork = null;     // WORKS entry

    function setAttachment(kind) {
      attachedMedia = kind;
      attachThumb.textContent = kind;
      attachPreview.hidden = false;
      document.getElementById('tool-image').classList.toggle('active', kind === '画像');
      document.getElementById('tool-video').classList.toggle('active', kind === '動画');
      openComposer();
    }
    function clearAttachment() {
      attachedMedia = null;
      attachPreview.hidden = true;
      document.getElementById('tool-image').classList.remove('active');
      document.getElementById('tool-video').classList.remove('active');
    }
    function setQuote(work) {
      quotedWork = work;
      document.getElementById('quote-preview-icon').setAttribute('style', work.style);
      document.getElementById('quote-preview-icon').innerHTML = WORK_ICONS[work.icon];
      document.getElementById('quote-preview-title').textContent = work.title;
      document.getElementById('quote-preview-meta').textContent = work.type + ' ・ ' + work.author;
      quotePreview.hidden = false;
      document.getElementById('tool-quote').classList.add('active');
      openComposer();
    }
    function clearQuote() {
      quotedWork = null;
      quotePreview.hidden = true;
      document.getElementById('tool-quote').classList.remove('active');
    }

    function openPalette() {
      paletteList.innerHTML = WORKS.map(w => `
        <button class="palette-item" type="button" data-id="${w.id}">
          <span class="palette-item-icon" style="${w.style}">${WORK_ICONS[w.icon]}</span>
          <span class="palette-item-body">
            <span class="palette-item-title">${w.title}</span>
            <span class="palette-item-meta">${w.type} ・ ${w.author} ・ 閲覧 ${w.views}</span>
          </span>
        </button>
      `).join('');
      paletteList.querySelectorAll('.palette-item').forEach(item => {
        item.addEventListener('click', () => {
          setQuote(WORKS.find(w => w.id === item.dataset.id));
          closePalette();
        });
      });
      paletteOverlay.hidden = false;
    }
    function closePalette() { paletteOverlay.hidden = true; }

    document.getElementById('tool-image').addEventListener('click', () => setAttachment('画像'));
    document.getElementById('tool-video').addEventListener('click', () => setAttachment('動画'));
    document.getElementById('tool-quote').addEventListener('click', openPalette);
    document.getElementById('attach-remove').addEventListener('click', clearAttachment);
    document.getElementById('quote-remove').addEventListener('click', clearQuote);
    document.getElementById('palette-close').addEventListener('click', closePalette);
    paletteOverlay.addEventListener('click', e => { if (e.target === paletteOverlay) closePalette(); });

    function openComposer() {
      composer.classList.add('is-active');
      refreshSubmitState();
    }
    function closeComposer() {
      composer.classList.remove('is-active');
      composerInput.value = '';
      composerInput.style.height = 'auto';
      clearAttachment();
      clearQuote();
      refreshSubmitState();
    }
    function refreshSubmitState() {
      const hasContent = composerInput.value.trim().length > 0 || attachedMedia || quotedWork;
      composerSubmit.disabled = !hasContent;
    }

    composerInput.addEventListener('focus', openComposer);
    composerInput.addEventListener('input', () => {
      composerInput.style.height = 'auto';
      composerInput.style.height = composerInput.scrollHeight + 'px';
      refreshSubmitState();
    });
    composerCancel.addEventListener('click', closeComposer);

    function buildPostNode(text, media, quote) {
      const article = document.createElement('article');
      article.className = 'post is-new';
      const mediaHTML = media ? `<div class="post-media">${media}（デモ）</div>` : '';
      const quoteHTML = quote ? `
        <a class="quote-embed" href="works-view.html?id=${quote.id}">
          <span class="quote-embed-icon" style="${quote.style}">${WORK_ICONS[quote.icon]}</span>
          <span class="quote-embed-body">
            <span class="quote-embed-title">${quote.title} <span class="badge badge-type">${quote.type}</span></span>
            <span class="quote-embed-meta">${quote.author} ・ 閲覧 ${quote.views}</span>
          </span>
          <span class="quote-embed-arrow" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3l4.5 4.5L5 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </a>` : '';
      article.innerHTML = `
        <div class="post-head">
          <div class="avatar a1">あ</div>
          <div class="post-meta">
            <span class="name">あなた</span>
            <span class="community" data-community-id="${c.id}">${Kakko.esc(c.name)}</span>
          </div>
          <time class="time">たった今</time>
        </div>
        <p class="body"></p>
        ${mediaHTML}
        ${quoteHTML}
        <div class="engage">
          <button class="engage-btn like" aria-label="いいね">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.8s-5.6-3.4-5.6-7.3a3.1 3.1 0 0 1 5.6-1.9 3.1 3.1 0 0 1 5.6 1.9c0 3.9-5.6 7.3-5.6 7.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            0
          </button>
          <button class="engage-btn" aria-label="コメント">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 3.5h11v7.2h-6l-3 2.6v-2.6h-2V3.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            0
          </button>
        </div>
      `;
      const bodyEl = article.querySelector('.body');
      if (text) { bodyEl.textContent = text; } else { bodyEl.remove(); }
      article.querySelector('.engage-btn.like').addEventListener('click', function () {
        const countEl = this.childNodes[this.childNodes.length - 1];
        const current = parseInt(this.textContent.trim(), 10);
        const liked = this.classList.toggle('active');
        countEl.textContent = ' ' + (liked ? current + 1 : current - 1);
      });
      return article;
    }

    composerSubmit.addEventListener('click', () => {
      const text = composerInput.value.trim();
      if (!text && !attachedMedia && !quotedWork) return;
      const detailPosts = document.getElementById('detail-posts');
      const emptyNotice = detailPosts.querySelector('.detail-empty');
      if (emptyNotice) emptyNotice.remove();
      detailPosts.prepend(buildPostNode(text, attachedMedia, quotedWork));
      closeComposer();
      Kakko.showToast('投稿しました');
    });
  }

  function render() {
    if (!community) {
      root.innerHTML = '<div class="detail-empty">コミュニティが見つかりませんでした。<br><a href="community-list.html">コミュニティ一覧へ戻る</a></div>';
      return;
    }
    const c = community;
    const joined = Kakko.isJoined(c.id);
    const fav = Kakko.isFav(c.id);
    document.title = 'kakko. ｜ ' + c.name;

    const actions = joined
      ? '<button class="fav-toggle' + (fav ? ' active' : '') + '" id="btn-fav" type="button" aria-pressed="' + fav + '">' + STAR(fav) + (fav ? 'お気に入り済み' : 'お気に入り') + '</button>' +
        '<button class="leave-btn" id="btn-leave" type="button">コミュニティを脱退する</button>' +
        '<p class="detail-hint">お気に入りにすると、タイムライン画面にこのコミュニティのタブが表示されます。</p>'
      : '<button class="join-btn" id="btn-join" type="button">参加する</button>';

    const posts = c.posts.length
      ? c.posts.map(p => Kakko.postHTML(p, c)).join('')
      : '<div class="detail-empty">まだ投稿がありません。' + (joined ? '<br><a href="index.html">タイムラインから最初の投稿をしてみましょう</a>' : '') + '</div>';

    root.innerHTML =
      '<section class="community-header">' +
        '<div class="detail-icon">' + Kakko.iconHTML(c, { size: 56, radius: 16 }) + '</div>' +
        '<p class="community-header-title">' + Kakko.esc(c.name) + ' <span class="badge badge-open">オープン</span></p>' +
        '<p class="community-header-meta">『' + Kakko.esc(c.work) + '』 ・ ' + Kakko.memberText(c) + ' ・ ' + Kakko.dateText(c.created) + ' 作成</p>' +
        '<div class="host-row"><span class="host-label">ホスト</span>' +
          '<span class="avatar ' + c.host.av + '">' + Kakko.esc(c.host.ini) + '</span>' +
          '<span class="host-name">' + Kakko.esc(c.host.name) + '</span></div>' +
        '<p class="community-header-desc">' + Kakko.linkify(c.desc) + '</p>' +
        '<div class="detail-actions">' + actions + '</div>' +
      '</section>' +
      (joined ? composerHTML(c) : '') +
      '<h2 class="result-heading section-heading">コミュニティタイムライン</h2>' +
      '<div id="detail-posts">' + posts + '</div>';

    Kakko.attachLikes(root);
    if (joined) wireComposer(c);

    const joinBtn = document.getElementById('btn-join');
    if (joinBtn) joinBtn.addEventListener('click', () => {
      Kakko.join(c.id);
      render();
      Kakko.showToast('「' + c.name + '」に参加しました');
    });
    const favBtn = document.getElementById('btn-fav');
    if (favBtn) favBtn.addEventListener('click', () => {
      const now = Kakko.toggleFav(c.id);
      render();
      Kakko.showToast(now ? 'お気に入りに追加しました。タイムラインにタブが表示されます' : 'お気に入りを解除しました');
    });
    const leaveBtn = document.getElementById('btn-leave');
    if (leaveBtn) leaveBtn.addEventListener('click', () => {
      Kakko.leave(c.id);
      render();
      Kakko.showToast('「' + c.name + '」を脱退しました');
    });
  }
  render();
  // ---- left sidebar navigation (only implemented pages are real links) ----

}
window.initCommunityDetail = initCommunityDetail;
