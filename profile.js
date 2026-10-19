/*
 * profile.js — page-local script for profile.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initProfile() {

  // ---- profile tab switching ----
  const profileTabs = document.querySelectorAll('.profile-tabs .tab');
  const profileViews = {
    posts: document.getElementById('view-posts'),
    replies: document.getElementById('view-replies'),
    media: document.getElementById('view-media'),
    works: document.getElementById('view-works'),
    likes: document.getElementById('view-likes'),
  };

  function activateProfileTab(tab) {
    profileTabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    Object.entries(profileViews).forEach(([key, el]) => {
      el.hidden = key !== tab.dataset.view;
    });
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }

  profileTabs.forEach(tab => tab.addEventListener('click', () => activateProfileTab(tab)));

  // ---- tab bar horizontal scroll + arrow buttons ----
  const tabsScroll = document.getElementById('profile-tabs-scroll');
  const scrollLeftBtn = document.querySelector('.tab-scroll-left');
  const scrollRightBtn = document.querySelector('.tab-scroll-right');

  function refreshScrollArrows() {
    const maxScroll = tabsScroll.scrollWidth - tabsScroll.clientWidth;
    const overflowing = maxScroll > 4;
    scrollLeftBtn.hidden = !overflowing || tabsScroll.scrollLeft <= 4;
    scrollRightBtn.hidden = !overflowing || tabsScroll.scrollLeft >= maxScroll - 4;
  }

  scrollLeftBtn.addEventListener('click', () => {
    tabsScroll.scrollBy({ left: -140, behavior: 'smooth' });
  });
  scrollRightBtn.addEventListener('click', () => {
    tabsScroll.scrollBy({ left: 140, behavior: 'smooth' });
  });
  tabsScroll.addEventListener('scroll', refreshScrollArrows);
  window.addEventListener('resize', refreshScrollArrows);
  refreshScrollArrows();

  // ---- like buttons (purely visual, demo only) ----
  document.querySelectorAll('.engage-btn.like').forEach(btn => {
    btn.addEventListener('click', () => {
      const countEl = btn.childNodes[btn.childNodes.length - 1];
      const current = parseInt(btn.textContent.trim(), 10);
      const liked = btn.classList.toggle('active');
      countEl.textContent = ' ' + (liked ? current + 1 : current - 1);
    });
  });

  // ---- follow / follower dummy modal ----
  const FOLLOW_LISTS = {
    following: [
      { avatar: 'a1', initial: 'つ', name: 'つむぎ', meta: '灰と星屑 感想部 に参加' },
      { avatar: 'a2', initial: 'は', name: 'はると', meta: '夜想曲のリベルタ 感想部 に参加' },
      { avatar: 'a3', initial: 'う', name: '海野', meta: 'サイレント・チャプター部 に参加' },
      { avatar: 'a1', initial: 'み', name: 'みずき', meta: '灰と星屑 感想部 に参加' },
    ],
    followers: [
      { avatar: 'a2', initial: 'ゆ', name: 'ゆき', meta: '灰と星屑 感想部 に参加' },
      { avatar: 'a3', initial: 'り', name: 'りく', meta: '夜想曲のリベルタ 感想部 に参加' },
      { avatar: 'a1', initial: 'せ', name: 'せんな', meta: 'サイレント・チャプター部 に参加' },
      { avatar: 'a2', initial: 'は', name: 'はると', meta: '夜想曲のリベルタ 感想部 に参加' },
      { avatar: 'a3', initial: 'み', name: 'みずき', meta: '灰と星屑 感想部 に参加' },
    ],
  };

  const followModalOverlay = document.getElementById('follow-modal-overlay');
  const followModalTitle = document.getElementById('follow-modal-title');
  const followModalList = document.getElementById('follow-modal-list');
  const followModalClose = document.getElementById('follow-modal-close');

  function openFollowModal(kind) {
    followModalTitle.textContent = kind === 'following' ? 'フォロー中' : 'フォロワー';
    followModalList.innerHTML = FOLLOW_LISTS[kind].map(u => `
      <article class="result-user">
        <div class="avatar ${u.avatar}">${u.initial}</div>
        <div class="result-user-body">
          <p class="name">${u.name}</p>
          <p class="result-user-meta">${u.meta}</p>
        </div>
        <button class="follow-btn" type="button">フォロー</button>
      </article>
    `).join('');
    followModalList.querySelectorAll('.follow-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const following = btn.classList.toggle('active');
        btn.textContent = following ? 'フォロー中' : 'フォロー';
      });
    });
    followModalOverlay.hidden = false;
  }

  function closeFollowModal() { followModalOverlay.hidden = true; }

  document.querySelectorAll('.follow-count-btn').forEach(btn => {
    btn.addEventListener('click', () => openFollowModal(btn.dataset.modal));
  });
  followModalClose.addEventListener('click', closeFollowModal);
  followModalOverlay.addEventListener('click', e => {
    if (e.target === followModalOverlay) closeFollowModal();
  });

  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // ---- プロフィール編集(デモ): 画面遷移せず、表示要素をその場で入力欄に差し替える。値は保存しない ----
  const header = document.querySelector('.profile-header');
  const editBtn = document.querySelector('.edit-profile-btn');
  const avatarWrap = document.querySelector('.profile-avatar-wrap');
  const avatarEl = document.querySelector('.profile-avatar');
  const nameEl = document.querySelector('.profile-name');
  const bioEl = document.querySelector('.profile-bio');
  const linkEl = document.querySelector('.profile-link');
  let editNodes = [];
  let previewUrl = null;

  function addAfter(ref, node) { ref.insertAdjacentElement('afterend', node); editNodes.push(node); return node; }
  function el(tag, cls, attrs) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    Object.keys(attrs || {}).forEach(k => n.setAttribute(k, attrs[k]));
    return n;
  }

  function enterEdit() {
    if (header.classList.contains('is-editing')) return;
    header.classList.add('is-editing');

    // アイコン: クリックで画像を選び、その場でプレビュー(保存はしない)
    const file = el('input', 'profile-edit-file', { type: 'file', accept: 'image/*', hidden: '' });
    const camBtn = el('button', 'profile-avatar-edit', { type: 'button', 'aria-label': 'アイコン画像を変更' });
    camBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6.5h3l1.2-2h5.6l1.2 2h3v9H3v-9Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="10" cy="11" r="2.8" stroke="currentColor" stroke-width="1.4"/></svg>';
    avatarWrap.appendChild(camBtn); editNodes.push(camBtn);
    avatarWrap.appendChild(file); editNodes.push(file);
    camBtn.addEventListener('click', () => file.click());
    file.addEventListener('change', () => {
      const f = file.files && file.files[0];
      if (!f) return;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = URL.createObjectURL(f);
      avatarEl.classList.add('has-image');
      avatarEl.style.backgroundImage = 'url("' + previewUrl + '")';
      avatarEl.dataset.label = avatarEl.textContent;
      avatarEl.textContent = '';
    });

    // 名前
    nameEl.hidden = true;
    const nameIn = addAfter(nameEl, el('input', 'profile-edit-input profile-edit-name', { type: 'text', maxlength: '30', 'aria-label': '名前' }));
    nameIn.value = nameEl.textContent.trim();

    // プロフィール(自己紹介)
    bioEl.hidden = true;
    const bioIn = addAfter(bioEl, el('textarea', 'profile-edit-input profile-edit-bio', { rows: '4', maxlength: '160', 'aria-label': 'プロフィール' }));
    bioIn.value = bioEl.textContent.trim();

    // リンク
    linkEl.hidden = true;
    const linkIn = addAfter(linkEl, el('input', 'profile-edit-input profile-edit-link', { type: 'text', 'aria-label': 'リンク', spellcheck: 'false' }));
    linkIn.value = linkEl.textContent.trim();

    // 保存 / キャンセル
    editBtn.hidden = true;
    const actions = el('div', 'profile-edit-actions');
    actions.innerHTML = '<button type="button" class="profile-edit-cancel">キャンセル</button><button type="button" class="profile-edit-save">保存</button>';
    editBtn.insertAdjacentElement('afterend', actions); editNodes.push(actions);
    actions.querySelector('.profile-edit-cancel').addEventListener('click', () => exitEdit(false));
    actions.querySelector('.profile-edit-save').addEventListener('click', () => exitEdit(true));
    nameIn.focus();
  }

  function exitEdit(saved) {
    editNodes.forEach(n => n.remove());
    editNodes = [];
    nameEl.hidden = false; bioEl.hidden = false; linkEl.hidden = false; editBtn.hidden = false;
    // デモのため、プレビューした画像は元のアイコンに戻す
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    avatarEl.classList.remove('has-image');
    avatarEl.style.backgroundImage = '';
    if (avatarEl.dataset.label) { avatarEl.textContent = avatarEl.dataset.label; delete avatarEl.dataset.label; }
    header.classList.remove('is-editing');
    if (saved) showToast('プロフィールを保存しました(デモ)');
  }

  editBtn.addEventListener('click', enterEdit);

}
window.initProfile = initProfile;
