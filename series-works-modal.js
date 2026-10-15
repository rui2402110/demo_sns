/*
 * series-works-modal.js — シリーズ内作品管理ポップアップ (component-series-works-modal.frag)
 *
 * SeriesWorksModal.open({ seriesId, onSave(ids) })
 * 追加/外すはポップアップ内で仮置きし、「保存する」で KakkoSeries.setWorks に反映する。
 * 他のシリーズに入っている作品は選択不可(1作品=1シリーズ)。
 */
(function () {
  'use strict';
  var S = window.KakkoSeries;
  var els = null, current = null, staged = [];
  function q(id) { return document.getElementById(id); }

  function bind() {
    if (els) return true;
    var overlay = q('series-works-overlay');
    if (!overlay) return false;
    els = { overlay: overlay, inList: q('sw-in-list'), outList: q('sw-out-list'), count: q('sw-in-count'), cancel: q('sw-cancel'), save: q('sw-save') };
    els.cancel.addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    els.save.addEventListener('click', save);
    overlay.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act]');
      if (!btn) return;
      var id = btn.closest('.sw-row').getAttribute('data-id');
      if (btn.getAttribute('data-act') === 'remove') staged = staged.filter(function (w) { return w !== id; });
      else if (staged.indexOf(id) === -1) staged.push(id);
      render();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('show')) close(); });
    return true;
  }

  function rowHTML(w, action, note) {
    var btn = action
      ? '<button type="button" class="sw-toggle ' + action + '" data-act="' + action + '">' + (action === 'add' ? '追加' : '外す') + '</button>'
      : '<span class="sw-note">' + S.esc(note) + '</span>';
    return '<div class="sw-row' + (action ? '' : ' disabled') + '" data-id="' + w.id + '">' +
      S.workIconHTML(w) +
      '<span class="community-card-body">' +
        '<span class="community-card-title">' + S.esc(w.title) + ' <span class="badge badge-type">' + S.esc(w.type) + '</span></span>' +
        '<span class="community-card-meta">閲覧 ' + S.num(w.views) + ' ・ いいね ' + S.num(w.likes) + '</span>' +
      '</span>' + btn + '</div>';
  }

  function render() {
    var inHTML = staged.map(function (id) { var w = S.workById(id); return w ? rowHTML(w, 'remove') : ''; }).join('');
    els.inList.innerHTML = inHTML || '<p class="sw-empty">まだ作品がありません。下の一覧から追加してください。</p>';
    els.count.textContent = staged.length;
    var out = S.works().filter(function (w) { return staged.indexOf(w.id) === -1; });
    var outHTML = out.map(function (w) {
      var other = S.seriesOfWork(w.id);
      if (other && other.id !== current.seriesId) return rowHTML(w, null, '「' + other.name + '」に登録済み');
      return rowHTML(w, 'add');
    }).join('');
    els.outList.innerHTML = outHTML || '<p class="sw-empty">追加できる作品はありません。</p>';
  }

  function close() { if (els) els.overlay.classList.remove('show'); current = null; }
  function save() {
    if (!current) return;
    var cb = current.onSave, ids = staged.slice();
    close();
    if (cb) cb(ids);
  }

  function open(opts) {
    if (!bind()) return;
    var s = S.get(opts.seriesId);
    if (!s) return;
    current = opts;
    staged = s.works.slice();
    render();
    els.overlay.classList.add('show');
  }

  window.SeriesWorksModal = { open: open, close: close };
})();
