/*
 * user-profile.js — page-local script for user-profile.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initUserProfile() {

  // ---- 表示するユーザーを決定する(クエリパラメータ、または既知デモユーザーからの推定) ----
  const DEMO_USERS = {
    'ゆき':   { avatar: 'a1', initial: 'ゆ', handle: '@yuki_kakko',   bio: '物語を読むのも書くのも好きです。灰と星屑、夜想曲のリベルタが今期のお気に入り。', location: '東京', joined: '2026年3月から利用', following: 180, followers: 2400 },
    'りく':   { avatar: 'a2', initial: 'り', handle: '@riku_kakko',   bio: '考察が好きです。伏線を見つけると叫びます。灰と星屑 考察部 運営中。', location: '大阪', joined: '2026年3月から利用', following: 95, followers: 860 },
    'せんな': { avatar: 'a3', initial: 'せ', handle: '@senna_kakko',  bio: '静かな物語が好き。サイレント・チャプター部のホストをしています。', location: '福岡', joined: '2026年4月から利用', following: 140, followers: 1500 },
    'はると': { avatar: 'a2', initial: 'は', handle: '@haruto_kakko', bio: '夜想曲のリベルタ語る会のホストです。泣けるお話が好物。', location: '札幌', joined: '2026年5月から利用', following: 210, followers: 980 },
    'つむぎ': { avatar: 'a1', initial: 'つ', handle: '@tsumugi_kakko', bio: 'PVや映像作品をよく見ています。灰と星屑 感想部に参加中。', location: '名古屋', joined: '2026年3月から利用', following: 60, followers: 430 },
    'みずき': { avatar: 'a1', initial: 'み', handle: '@mizuki_kakko', bio: 'コミカライズ版の絵柄が好きで追いかけています。', location: '仙台', joined: '2026年6月から利用', following: 75, followers: 310 },
    '海野':   { avatar: 'a3', initial: '海', handle: '@umino_kakko',  bio: 'サイレント・チャプター部に参加中。OPアニメーションが好き。', location: '京都', joined: '2026年5月から利用', following: 50, followers: 275 },
  };

  const params = new URLSearchParams(window.location.search);
  const paramName = (params.get('name') || '').trim();
  const paramAvatar = params.get('avatar');
  const paramInitial = params.get('initial');

  const known = DEMO_USERS[paramName];
  const user = {
    name: paramName || 'ユーザー',
    avatar: known ? known.avatar : (paramAvatar || 'a1'),
    initial: known ? known.initial : (paramInitial || (paramName ? paramName.charAt(0) : '?')),
    handle: known ? known.handle : ('@' + (paramName ? encodeURIComponent(paramName).toLowerCase() : 'kakko_user')),
    bio: known ? known.bio : 'kakko. を利用しています。',
    location: known ? known.location : '非公開',
    joined: known ? known.joined : '利用開始日は非公開です',
    following: known ? known.following : 42,
    followers: known ? known.followers : 108,
  };

  document.title = 'kakko. ｜ ' + user.name;
  document.getElementById('profile-topbar-name').textContent = user.name;
  document.getElementById('profile-name-text').textContent = user.name;
  document.getElementById('profile-handle-text').textContent = user.handle;
  document.getElementById('profile-bio-text').textContent = user.bio;
  document.getElementById('profile-meta-location').textContent = user.location;
  document.getElementById('profile-meta-joined').textContent = user.joined;
  document.getElementById('profile-meta-link').textContent = user.handle.replace(/^@/, 'kakko.jp/@');
  document.getElementById('profile-following-count').textContent = user.following.toLocaleString('en-US');
  document.getElementById('profile-followers-count').textContent = user.followers.toLocaleString('en-US');

  const headerAvatar = document.getElementById('profile-header-avatar');
  headerAvatar.className = 'avatar ' + user.avatar + ' profile-avatar';
  headerAvatar.textContent = user.initial;

  // 投稿・返信タブの投稿者もこのユーザーに合わせる(デモ用の文面はそのまま使い回し)
  ['profile-post1', 'profile-post2', 'profile-reply1'].forEach(prefix => {
    const avatarEl = document.getElementById(prefix + '-avatar');
    const nameEl = document.getElementById(prefix + '-name');
    if (avatarEl) { avatarEl.className = 'avatar ' + user.avatar; avatarEl.textContent = user.initial; }
    if (nameEl) nameEl.textContent = user.name;
  });

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

  // ---- toast ----
  let toastTimer;
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  // ---- フォローボタン(デモ: 押すとトグルし、フォロワー数が増減します) ----
  const profileFollowBtn = document.getElementById('profile-follow-btn');
  const followersCountEl = document.getElementById('profile-followers-count');
  let baseFollowers = user.followers;
  profileFollowBtn.addEventListener('click', () => {
    const nowFollowing = profileFollowBtn.classList.toggle('active');
    profileFollowBtn.textContent = nowFollowing ? 'フォロー中' : 'フォロー';
    const count = baseFollowers + (nowFollowing ? 1 : 0);
    followersCountEl.textContent = count.toLocaleString('en-US');
    showToast(nowFollowing ? user.name + 'さんをフォローしました' : user.name + 'さんのフォローを解除しました');
  });

}
window.initUserProfile = initUserProfile;
