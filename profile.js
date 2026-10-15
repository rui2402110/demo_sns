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

  // ---- edit profile button (demo only) ----
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  document.querySelector('.edit-profile-btn').addEventListener('click', () => {
    showToast('この画面は準備中です');
  });

}
window.initProfile = initProfile;
