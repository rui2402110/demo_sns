/*
 * series-store.js — シリーズと「自分の作品」のデモデータ + 保存(localStorage)
 * works-list.html / series-view.html などで共有。
 * localStorage が使えない環境ではページ内のみ保持。
 */
(function () {
  'use strict';
  var KEY = 'kakko.series.v1';

  // 自分の作品(デモ用カタログ)
  var WORKS = [
    { id: 'mine1',    title: 'あなたの小さな灯り', type: '小説',   views: 1204, likes: 89,  comments: 12, icon: 'star', tone: 'a1' },
    { id: 'mine2',    title: '週末の記録',         type: 'ブログ', views: 532,  likes: 34,  comments: 5,  icon: 'doc',  tone: 'a1' },
    { id: 'uminari1', title: '第1話　嵐と海図',     type: '画像',   views: 3410, likes: 210, comments: 8,  icon: 'doc',  tone: 'a2' },
    { id: 'uminari2', title: '第2話　仲間の合図',   type: '画像',   views: 2180, likes: 156, comments: 4,  icon: 'doc',  tone: 'a2' }
  ];

  function defaults() {
    return [{
      id: 'uminari',
      name: '海鳴りの一味',
      desc: '港町で育った少年・カイが、祖父の残した海図を手がかりに、幼馴染たちと共に伝説の島を目指す痛快アドベンチャー。話数を重ねるごとに、一味の絆と謎が少しずつ明らかになっていく。',
      status: 'ongoing',
      works: ['uminari1', 'uminari2']
    }];
  }

  var state;
  try {
    var raw = window.localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : defaults();
  } catch (e) { state = defaults(); }
  if (!Array.isArray(state)) state = defaults();

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ページ内のみ保持 */ }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n) { return Number(n).toLocaleString('en-US'); }

  function works() { return WORKS.slice(); }
  function workById(id) { for (var i = 0; i < WORKS.length; i++) if (WORKS[i].id === id) return WORKS[i]; return null; }
  function list() { return state.slice(); }
  function get(id) { for (var i = 0; i < state.length; i++) if (state[i].id === id) return state[i]; return null; }
  function seriesOfWork(workId) {
    for (var i = 0; i < state.length; i++) if (state[i].works.indexOf(workId) !== -1) return state[i];
    return null;
  }

  function create(data) {
    var s = { id: 's' + Date.now().toString(36), name: data.name, desc: data.desc || '', status: data.status === 'done' ? 'done' : 'ongoing', works: [] };
    state.push(s); save(); return s;
  }
  function update(id, patch) {
    var s = get(id); if (!s) return null;
    if (patch.name != null) s.name = patch.name;
    if (patch.desc != null) s.desc = patch.desc;
    if (patch.status != null) s.status = patch.status === 'done' ? 'done' : 'ongoing';
    save(); return s;
  }
  // 作品の所属を更新する。1つの作品は1つのシリーズにだけ所属できる。
  function setWorks(id, ids) {
    var s = get(id); if (!s) return null;
    state.forEach(function (o) {
      if (o !== s) o.works = o.works.filter(function (w) { return ids.indexOf(w) === -1; });
    });
    s.works = ids.filter(function (w) { return !!workById(w); });
    save(); return s;
  }
  function stats(s) {
    var v = 0, l = 0, n = 0;
    s.works.forEach(function (id) { var w = workById(id); if (w) { n++; v += w.views; l += w.likes; } });
    return { count: n, views: v, likes: l };
  }
  function metaText(s) {
    var st = stats(s);
    return st.count ? '全' + st.count + '話 ・ 閲覧 ' + num(st.views) + ' ・ いいね ' + num(st.likes) : '全0話';
  }
  function badgeHTML(s) {
    return '<span class="badge ' + (s.status === 'done' ? 'badge-series-done' : 'badge-series') + '">' + (s.status === 'done' ? '完結済み' : '連載中') + '</span>';
  }
  function workIconHTML(w, size) {
    size = size || 18;
    var glyph = w.icon === 'star'
      ? '<svg width="' + (size + 3) + '" height="' + (size + 3) + '" viewBox="0 0 22 22" fill="none"><path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/></svg>'
      : '<svg width="' + size + '" height="' + size + '" viewBox="0 0 20 20" fill="none"><path d="M4 4.5h9l3 3v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1Z" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/><path d="M6.5 9h7M6.5 12h7M6.5 15h4" stroke="#f4ead9" stroke-width="1" stroke-linecap="round"/></svg>';
    var grad = w.tone === 'a2'
      ? 'linear-gradient(135deg, var(--avatar-2), #2e4468 65%, var(--ink-soft))'
      : 'linear-gradient(135deg, var(--avatar-1), #7a3a2c 65%, var(--ink-soft))';
    return '<span class="work-icon" style="background: ' + grad + ';">' + glyph + '</span>';
  }

  window.KakkoSeries = {
    works: works, workById: workById, list: list, get: get, seriesOfWork: seriesOfWork,
    create: create, update: update, setWorks: setWorks, stats: stats,
    metaText: metaText, badgeHTML: badgeHTML, workIconHTML: workIconHTML, esc: esc, num: num
  };
})();
