/*
 * community-list.js — page-local script for community-list.html (joined
 * communities list with search + favorite filter). Row markup mirrors
 * component-community-tile.frag. Depends on community-common.js (Kakko).
 */
function initCommunityList() {
  // 旧URL(一覧内の詳細表示 ?c=…)で来た場合は共通の詳細画面へ
  (function () {
    const legacy = new URLSearchParams(window.location.search).get('c');
    if (legacy) window.location.replace('community-detail.html?c=' + encodeURIComponent(legacy));
  })();

  const listEl = document.getElementById('community-list');
  const emptyEl = document.getElementById('list-empty');
  const filterInput = document.getElementById('work-filter');
  const filterClear = document.getElementById('work-filter-clear');
  const favFilter = document.getElementById('fav-filter');
  let favOnly = false;

  const STAR = filled => '<svg width="19" height="19" viewBox="0 0 22 22" fill="' + (filled ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z"/></svg>';
  const ARROW = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4.5 4.5L5 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function rowHTML(c) {
    const fav = Kakko.isFav(c.id);
    const last = c.posts[0];
    const teaser = last ? '<span class="community-card-teaser">' + Kakko.esc(last.name) + '：' + Kakko.esc(last.body) + '</span>' : '';
    return '<div class="community-row" data-community-id="' + c.id + '">' +
        '<a class="community-row-link" href="community-detail.html?c=' + encodeURIComponent(c.id) + '">' +
          Kakko.iconHTML(c) +
          '<span class="community-card-body">' +
            '<span class="community-card-title">' + Kakko.esc(c.name) + ' <span class="badge badge-open">オープン</span></span>' +
            '<span class="community-card-meta">『' + Kakko.esc(c.work) + '』 ・ ' + Kakko.memberText(c) + ' ・ ホスト ' + Kakko.esc(c.host.name) + '</span>' +
            teaser +
          '</span>' +
          '<span class="action-arrow" aria-hidden="true">' + ARROW + '</span>' +
        '</a>' +
        '<button class="fav-btn' + (fav ? ' active' : '') + '" type="button" data-fav="' + c.id + '" aria-pressed="' + fav + '" aria-label="' + (fav ? 'お気に入りを解除' : 'お気に入りに追加') + '" title="' + (fav ? 'お気に入り済み(タップで解除)' : 'お気に入りに追加') + '">' + STAR(fav) + '</button>' +
      '</div>';
  }

  function render() {
    const q = filterInput.value.trim().toLowerCase();
    filterClear.hidden = q.length === 0;
    const joined = Kakko.joinedIds().map(id => Kakko.get(id));
    const items = joined.filter(c => (!q || c.work.toLowerCase().includes(q)) && (!favOnly || Kakko.isFav(c.id)));
    listEl.innerHTML = items.map(rowHTML).join('');
    if (items.length) {
      emptyEl.hidden = true;
    } else {
      emptyEl.hidden = false;
      emptyEl.innerHTML = joined.length === 0
        ? '参加しているコミュニティがありません。<br><a href="community-join.html">コミュニティ参加</a>から探してみましょう'
        : (favOnly && !q ? 'お気に入りのコミュニティがありません。<br>タイルの星を押して追加できます' : '条件に合うコミュニティがありません');
    }
  }

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-fav]');
    if (!btn) return;
    const id = btn.dataset.fav;
    const now = Kakko.toggleFav(id);
    render();
    Kakko.showToast(now ? 'お気に入りに追加しました。タイムラインにタブが表示されます' : 'お気に入りを解除しました');
  });
  filterInput.addEventListener('input', render);
  filterClear.addEventListener('click', () => { filterInput.value = ''; filterInput.focus(); render(); });
  favFilter.addEventListener('click', () => {
    favOnly = !favOnly;
    favFilter.classList.toggle('active', favOnly);
    favFilter.setAttribute('aria-pressed', favOnly);
    render();
  });
  render();

}
window.initCommunityList = initCommunityList;
