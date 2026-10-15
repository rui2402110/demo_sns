/*
 * settings.js — page-local script for settings.html.
 * (ミュートワード管理 / パスワード変更モーダル / ログアウト)
 * Depends on: community-common.js (Kakko).
 */
function initSettings() {

  // ---- mute words (shared via community-common.js / Kakko.*) ----
  const muteListEl = document.getElementById('mute-list');
  const muteEmptyEl = document.getElementById('mute-empty');
  const muteInput = document.getElementById('mute-input');
  const muteAddBtn = document.getElementById('mute-add-btn');

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderMuteList() {
    if (!window.Kakko) return;
    const words = Kakko.muteWords();
    muteEmptyEl.hidden = words.length > 0;
    muteListEl.innerHTML = words.map((w, i) => (
      '<div class="mute-item" data-index="' + i + '">' +
        '<span class="mute-item-word">' + escHtml(w) + '</span>' +
        '<div class="mute-item-actions">' +
          '<button type="button" class="mute-icon-btn mute-edit-btn" aria-label="編集">' +
            '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M9.8 2.3 12.7 5.2 5 12.9 2 13l.1-3L9.8 2.3Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>' +
          '</button>' +
          '<button type="button" class="mute-icon-btn danger mute-remove-btn" aria-label="削除">' +
            '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 4.5h9M5.8 4.5V3a.9.9 0 0 1 .9-.9h1.6a.9.9 0 0 1 .9.9v1.5M6 7v4.2M9 7v4.2M4 4.5l.6 7.3a1.2 1.2 0 0 0 1.2 1.1h3.4a1.2 1.2 0 0 0 1.2-1.1l.6-7.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>'
    )).join('');
  }

  function addMuteWord() {
    if (!window.Kakko) return;
    const v = muteInput.value.trim();
    if (!v) return;
    const ok = Kakko.addMuteWord(v);
    if (ok) {
      muteInput.value = '';
      renderMuteList();
    } else {
      Kakko.showToast('すでに登録されています');
    }
  }

  muteAddBtn.addEventListener('click', addMuteWord);
  muteInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addMuteWord(); }
  });

  muteListEl.addEventListener('click', e => {
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
      editBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2.5 7.8 5.8 11l6.7-7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

  // ---- password modal (demo only, no backend) ----
  const pwModal = document.getElementById('password-modal');
  document.getElementById('open-password-modal').addEventListener('click', () => { pwModal.hidden = false; });
  document.getElementById('close-password-modal').addEventListener('click', () => { pwModal.hidden = true; });
  pwModal.addEventListener('click', e => { if (e.target === pwModal) pwModal.hidden = true; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !pwModal.hidden) pwModal.hidden = true; });

  document.getElementById('pw-submit').addEventListener('click', () => {
    const cur = document.getElementById('pw-current').value;
    const next = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;
    if (!cur || !next || !confirm) { Kakko.showToast('すべての項目を入力してください'); return; }
    if (next !== confirm) { Kakko.showToast('新しいパスワードが一致しません'); return; }
    pwModal.hidden = true;
    document.getElementById('pw-current').value = '';
    document.getElementById('pw-new').value = '';
    document.getElementById('pw-confirm').value = '';
    Kakko.showToast('パスワードを更新しました(デモ)');
  });

  // ---- logout (demo only) ----
  document.getElementById('logout-btn').addEventListener('click', () => {
    Kakko.showToast('ログアウトしました(デモ)');
  });
}
window.initSettings = initSettings;
