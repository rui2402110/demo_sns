function initReplyModal() {
  const overlay = document.getElementById('reply-modal-overlay');
  const closeBtn = document.getElementById('reply-modal-close');
  const origAvatar = document.getElementById('reply-orig-avatar');
  const origName = document.getElementById('reply-orig-name');
  const origCommunity = document.getElementById('reply-orig-community');
  const origTime = document.getElementById('reply-orig-time');
  const origBody = document.getElementById('reply-orig-body');
  const origToName = document.getElementById('reply-orig-to-name');
  const input = document.getElementById('reply-compose-input');
  const submitBtn = document.getElementById('reply-submit');
  const attachPreview = document.getElementById('reply-attach-preview');
  const attachThumb = document.getElementById('reply-attach-thumb');
  const attachRemove = document.getElementById('reply-attach-remove');
  const toolImage = document.getElementById('reply-tool-image');
  const toolVideo = document.getElementById('reply-tool-video');
  if (!overlay) return;

  let activeBtn = null;
  let attachedMedia = null;

  function replyToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(replyToast._t);
    replyToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function extractPostData(btn) {
    const engageEl = btn.closest('.engage');
    const container = (engageEl && engageEl.parentElement) || btn.closest('.post') || btn.closest('article');
    if (!container) return null;
    const avatarEl = container.querySelector('.post-head .avatar');
    const nameEl = container.querySelector('.post-meta .name');
    const communityEl = container.querySelector('.post-meta .community');
    const timeEl = container.querySelector('time.time');
    const bodyEl = container.querySelector('.body');
    let avatarClass = 'a1';
    if (avatarEl) {
      const found = Array.from(avatarEl.classList).find(c => /^a[0-9]+$/.test(c));
      if (found) avatarClass = found;
    }
    return {
      avatarClass: avatarClass,
      avatarInitial: avatarEl ? avatarEl.textContent.trim() : 'あ',
      name: nameEl ? nameEl.textContent.trim() : '名無しさん',
      community: communityEl ? communityEl.textContent.trim() : '',
      time: timeEl ? timeEl.textContent.trim() : '',
      body: bodyEl ? bodyEl.textContent.trim() : ''
    };
  }

  function setAttachment(kind) {
    attachedMedia = kind;
    attachThumb.textContent = kind;
    attachPreview.hidden = false;
    toolImage.classList.toggle('active', kind === '画像');
    toolVideo.classList.toggle('active', kind === '動画');
    refreshSubmitState();
  }

  function clearAttachment() {
    attachedMedia = null;
    attachPreview.hidden = true;
    toolImage.classList.remove('active');
    toolVideo.classList.remove('active');
    refreshSubmitState();
  }

  function refreshSubmitState() {
    const hasContent = input.value.trim().length > 0 || attachedMedia;
    submitBtn.disabled = !hasContent;
  }

  function openReplyModal(btn, data) {
    activeBtn = btn;
    origAvatar.className = 'avatar ' + data.avatarClass;
    origAvatar.textContent = data.avatarInitial;
    origName.textContent = data.name;
    if (data.community) {
      origCommunity.textContent = data.community;
      origCommunity.hidden = false;
    } else {
      origCommunity.hidden = true;
    }
    origTime.textContent = data.time;
    origBody.textContent = data.body;
    origToName.textContent = data.name;
    input.value = '';
    input.style.height = 'auto';
    clearAttachment();
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 30);
  }

  function closeReplyModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    activeBtn = null;
  }

  function incrementCommentCount(btn) {
    if (!btn) return;
    const countEl = btn.childNodes[btn.childNodes.length - 1];
    const current = parseInt(btn.textContent.trim(), 10) || 0;
    countEl.textContent = ' ' + (current + 1);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.engage-btn:not(.like)');
    if (!btn) return;
    const data = extractPostData(btn);
    if (!data) return;
    openReplyModal(btn, data);
  });

  closeBtn.addEventListener('click', closeReplyModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeReplyModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !overlay.hidden) closeReplyModal(); });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    refreshSubmitState();
  });

  toolImage.addEventListener('click', () => setAttachment('画像'));
  toolVideo.addEventListener('click', () => setAttachment('動画'));
  attachRemove.addEventListener('click', clearAttachment);

  submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;
    incrementCommentCount(activeBtn);
    replyToast('返信を投稿しました(デモ)');
    closeReplyModal();
  });
}


window.initReplyModal = initReplyModal;
