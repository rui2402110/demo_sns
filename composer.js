/*
 * composer.js — the post composer: text input, image/video attach,
 * work-quote palette, and submit. Shared by any page that includes
 * component-composer.frag + component-work-picker.frag.
 *
 * Call initComposer() once after both fragments are injected. It exposes
 * window.Composer for page-local scripts (e.g. index.js switches which
 * community the composer posts to when the timeline tab changes).
 */
function initComposer() {
  // ---- composer ----
  const composer = document.getElementById('composer');
  const composerTarget = document.getElementById('composer-target');
  const composerInput = document.getElementById('composer-input');
  const composerSubmit = document.getElementById('composer-submit');
  const composerCancel = document.getElementById('composer-cancel');
  let currentPostCommunityId = null;

  const communityNames = {};
  Kakko.all().forEach(c => { communityNames[c.id] = c.name; });

  // ---- タブ切り替えに合わせてコンポーザーの表示/投稿先を更新 ----
  // フォローTLには投稿機能を置かない。コミュニティタブでは、開いているコミュニティにのみ投稿できる。
  function updateComposerForTab(feedKey) {
    if (feedKey === 'follow' || !communityNames[feedKey]) {
      currentPostCommunityId = null;
      composer.hidden = true;
      closeComposer();
      return;
    }
    currentPostCommunityId = feedKey;
    composer.hidden = false;
    composerTarget.innerHTML = '<strong>' + communityNames[feedKey] + '</strong> に投稿します';
    refreshSubmitState();
  }

  // ---- 引用できる作品カタログ(work-catalog.js 共通) ----
  const { WORKS, WORK_ICONS, CAT_IMG } = window.KakkoWorks;

  // ---- composer state ----
  let attachedMedia = null;   // '画像' | '動画'
  let quotedWork = null;      // WORKS entry

  const attachPreview = document.getElementById('attach-preview');
  const attachThumb = document.getElementById('attach-thumb');
  const quotePreview = document.getElementById('quote-preview');
  const paletteOverlay = document.getElementById('palette-overlay');
  const paletteList = document.getElementById('palette-list');

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

  // ---- 作品パレット ----
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
    composerSubmit.disabled = !(hasContent && currentPostCommunityId);
  }

  composerInput.addEventListener('focus', openComposer);
  composerInput.addEventListener('input', () => {
    composerInput.style.height = 'auto';
    composerInput.style.height = composerInput.scrollHeight + 'px';
    refreshSubmitState();
  });
  composerCancel.addEventListener('click', closeComposer);

  function buildPostNode(text, communityKey, media, quote) {
    const article = document.createElement('article');
    article.className = 'post is-new';
    const mediaHTML = media ? `<div class="post-media">${media}（デモ）</div>` : '';
    const quoteHTML = quote ? (quote.cover ? `
      <a class="quote-embed quote-embed-media" href="works-view.html?id=${quote.id}">
        <span class="quote-embed-media-img-wrap">
          <img class="quote-embed-media-img" src="${quote.cover}" alt="${quote.title} のプレビュー画像">
          <span class="work-cover-badge">${quote.type}</span>
        </span>
        <span class="quote-embed-media-foot">
          <span class="quote-embed-body">
            <span class="quote-embed-title">${quote.title}</span>
            <span class="quote-embed-meta">${quote.author} ・ 閲覧 ${quote.views}</span>
          </span>
          <span class="quote-embed-arrow" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3l4.5 4.5L5 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </span>
      </a>` : `
      <a class="quote-embed" href="works-view.html?id=${quote.id}">
        <span class="quote-embed-icon" style="${quote.style}">${WORK_ICONS[quote.icon]}</span>
        <span class="quote-embed-body">
          <span class="quote-embed-title">${quote.title} <span class="badge badge-type">${quote.type}</span></span>
          <span class="quote-embed-meta">${quote.author} ・ 閲覧 ${quote.views}</span>
        </span>
        <span class="quote-embed-arrow" aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M5 3l4.5 4.5L5 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </a>`) : '';
    article.innerHTML = `
      <div class="post-head">
        <div class="avatar a1">あ</div>
        <div class="post-meta">
          <span class="name">あなた</span>
          <span class="community">${communityNames[communityKey]}</span>
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
    const communityKey = currentPostCommunityId;
    if (!text && !attachedMedia && !quotedWork) return;
    if (!communityKey) return;
    const media = attachedMedia, quote = quotedWork;
    // お気に入りでないコミュニティにはタブが無いので、フォローTLにだけ表示する
    if (feeds[communityKey]) feeds[communityKey].prepend(buildPostNode(text, communityKey, media, quote));
    feeds.follow.prepend(buildPostNode(text, communityKey, media, quote));
    closeComposer();
  });


  window.Composer = {
    updateForTarget: updateComposerForTab,
    hide: function () { composer.hidden = true; closeComposer(); },
    setQuote: setQuote,
    focusInput: function () { composerInput.focus(); },
    WORKS: WORKS
  };
}
window.initComposer = initComposer;
