function initMutePanel() {
  const tab = document.getElementById('mute-tab');
  const panel = document.getElementById('mute-panel');
  const backdrop = document.getElementById('mute-panel-backdrop');
  const closeBtn = document.getElementById('mute-panel-close');
  const handle = document.getElementById('mute-panel-handle');
  const listEl = document.getElementById('panel-mute-list');
  const emptyEl = document.getElementById('panel-mute-empty');
  const inputEl = document.getElementById('panel-mute-input');
  const addBtn = document.getElementById('panel-mute-add-btn');
  if (!tab || !panel) return;

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function panelToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(panelToast._t);
    panelToast._t = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function renderMuteList() {
    if (!window.Kakko || !listEl) return;
    const words = Kakko.muteWords();
    emptyEl.hidden = words.length > 0;
    listEl.innerHTML = words.map((w, i) => (
      '<div class="mute-item" data-index="' + i + '">' +
        '<span class="mute-item-word">' + escHtml(w) + '</span>' +
        '<div class="mute-item-actions">' +
          '<button type="button" class="mute-icon-btn mute-edit-btn" aria-label="編集">' +
            '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M9.8 2.3 12.7 5.2 5 12.9 2 13l.1-3L9.8 2.3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<button type="button" class="mute-icon-btn danger mute-remove-btn" aria-label="削除">' +
            '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M3 4.5h9M5.8 4.5V3a.9.9 0 0 1 .9-.9h1.6a.9.9 0 0 1 .9.9v1.5M6 7v4.2M9 7v4.2M4 4.5l.6 7.3a1.2 1.2 0 0 0 1.2 1.1h3.4a1.2 1.2 0 0 0 1.2-1.1l.6-7.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    )).join('');
  }

  function addMuteWord() {
    if (!window.Kakko || !inputEl) return;
    const v = inputEl.value.trim();
    if (!v) return;
    const ok = Kakko.addMuteWord(v);
    if (ok) { inputEl.value = ''; renderMuteList(); }
    else { panelToast('すでに登録されています'); }
  }

  if (addBtn) addBtn.addEventListener('click', addMuteWord);
  if (inputEl) inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addMuteWord(); }
  });

  if (listEl) listEl.addEventListener('click', e => {
    const item = e.target.closest('.mute-item');
    if (!item) return;
    const index = parseInt(item.dataset.index, 10);

    if (e.target.closest('.mute-remove-btn')) {
      Kakko.removeMuteWordAt(index);
      renderMuteList();
      return;
    }

    if (e.target.closest('.mute-edit-btn')) {
      const words = Kakko.muteWords();
      const current = words[index];
      const wordEl = item.querySelector('.mute-item-word');
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'mute-item-edit-input';
      input.value = current;
      input.maxLength = 40;
      wordEl.replaceWith(input);
      input.focus();
      input.select();

      const editBtn = item.querySelector('.mute-edit-btn');
      editBtn.classList.add('confirm');
      editBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 15 15" fill="none"><path d="M2.5 7.8 5.8 11l6.7-7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

      function commit() {
        const v = input.value.trim();
        if (v) Kakko.updateMuteWordAt(index, v);
        renderMuteList();
      }
      editBtn.addEventListener('click', commit, { once: true });
      input.addEventListener('keydown', ev => {
        if (ev.key === 'Enter') { ev.preventDefault(); commit(); }
        if (ev.key === 'Escape') { ev.preventDefault(); renderMuteList(); }
      });
    }
  });

  if (window.Kakko) {
    renderMuteList();
    Kakko.onMuteWordsChange(renderMuteList);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      renderMuteList();
      if (window.Kakko) Kakko.onMuteWordsChange(renderMuteList);
    });
  }

  // ---- drag-to-open / drag-to-close gesture ----
  let panelWidth = panel.offsetWidth || 320;
  window.addEventListener('resize', () => { panelWidth = panel.offsetWidth || panelWidth; });

  let dragging = false, startX = 0, startTranslate = 0, moved = false, activePointerId = null;

  function currentTranslate() {
    const t = panel.style.transform.match(/-?\d+(\.\d+)?/);
    if (panel.classList.contains('open') && !t) return 0;
    return t ? parseFloat(t[0]) : panelWidth;
  }

  function setTranslate(px) {
    panel.style.transition = 'none';
    panel.style.transform = 'translateX(' + px + 'px)';
    backdrop.hidden = false;
    backdrop.style.transition = 'none';
    backdrop.style.opacity = String(Math.max(0, Math.min(1, 1 - px / panelWidth)));
  }

  function openPanel() {
    panel.classList.add('open');
    panel.style.transition = '';
    panel.style.transform = '';
    backdrop.hidden = false;
    backdrop.style.transition = '';
    backdrop.style.opacity = '';
    requestAnimationFrame(() => backdrop.classList.add('show'));
    tab.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.style.transition = '';
    panel.style.transform = '';
    backdrop.style.transition = '';
    backdrop.style.opacity = '';
    backdrop.classList.remove('show');
    tab.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { if (!panel.classList.contains('open')) backdrop.hidden = true; }, 320);
  }

  function onPointerDown(e) {
    dragging = true;
    moved = false;
    activePointerId = e.pointerId;
    startX = e.clientX;
    panelWidth = panel.offsetWidth || panelWidth;
    startTranslate = panel.classList.contains('open') ? 0 : panelWidth;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    let t = startTranslate + dx;
    t = Math.max(0, Math.min(panelWidth, t));
    setTranslate(t);
  }

  function onPointerUp(e) {
    if (!dragging || e.pointerId !== activePointerId) return;
    dragging = false;
    activePointerId = null;
    if (!moved) { return; }
    const dx = e.clientX - startX;
    const t = Math.max(0, Math.min(panelWidth, startTranslate + dx));
    if (t < panelWidth * 0.6) openPanel();
    else closePanel();
  }

  tab.addEventListener('pointerdown', onPointerDown);
  if (handle) handle.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  // keyboard accessibility: Enter / Space toggles for users who can't drag
  tab.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);
  backdrop.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('open')) closePanel(); });
}


window.initMutePanel = initMutePanel;
