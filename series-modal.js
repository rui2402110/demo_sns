/*
 * series-modal.js — シリーズ作成/更新ポップアップ (component-series-modal.frag)
 *
 * SeriesModal.open({ mode: 'create' | 'edit', name, desc, status, onSubmit({name, desc, status}) })
 * 要素は open() 時に取得するので、コンポーネントを読み込んだ後ならいつでも呼べる。
 */
(function () {
  'use strict';
  var els = null, current = null;
  function q(id) { return document.getElementById(id); }

  function bind() {
    if (els) return true;
    var overlay = q('series-modal-overlay');
    if (!overlay) return false;
    els = {
      overlay: overlay, title: q('series-modal-title'), sub: q('series-modal-subtitle'),
      name: q('series-name'), desc: q('series-desc'), submit: q('series-modal-submit'), cancel: q('series-modal-cancel')
    };
    els.cancel.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    els.name.addEventListener('input', validate);
    els.name.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !els.submit.disabled) { e.preventDefault(); submit(); } });
    els.submit.addEventListener('click', submit);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('show')) close(); });
    return true;
  }
  function validate() { els.submit.disabled = els.name.value.trim().length === 0; }
  function selectedStatus() { return document.querySelector('input[name="series-status"]:checked').value; }
  function close() { if (els) els.overlay.classList.remove('show'); current = null; }

  function submit() {
    var name = els.name.value.trim();
    if (!name || !current) return;
    var cb = current.onSubmit;
    var data = { name: name, desc: els.desc.value.trim(), status: selectedStatus() };
    close();
    if (cb) cb(data);
  }

  function open(opts) {
    if (!bind()) return;
    opts = opts || {};
    current = opts;
    var edit = opts.mode === 'edit';
    els.title.textContent = edit ? 'シリーズを更新する' : 'シリーズを作成する';
    els.sub.textContent = edit ? 'シリーズ名・概要・状態を変更できます' : '連なる作品をまとめる、シリーズを新しく作ります';
    els.submit.textContent = edit ? '更新する' : '作成する';
    els.name.value = opts.name || '';
    els.desc.value = opts.desc || '';
    document.querySelector('input[name="series-status"][value="' + (opts.status === 'done' ? 'done' : 'ongoing') + '"]').checked = true;
    validate();
    els.overlay.classList.add('show');
    setTimeout(function () { els.name.focus(); }, 60);
  }

  window.SeriesModal = { open: open, close: close };
})();
