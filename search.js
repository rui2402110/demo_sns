/*
 * search.js — page-local script for search.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initSearch() {

  // ---- filter tabs ----
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');
  const resultGroups = document.querySelectorAll('.result-group');

  function positionIndicator(tab) {
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    resultGroups.forEach(group => {
      group.hidden = tab.dataset.filter !== 'all' && group.dataset.type !== tab.dataset.filter;
    });
    positionIndicator(tab);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
  window.addEventListener('resize', () => {
    const active = document.querySelector('.tab.active');
    if (active) positionIndicator(active);
  });
  positionIndicator(document.querySelector('.tab.active'));

  // ---- like buttons (purely visual, demo only) ----
  document.querySelectorAll('.engage-btn.like').forEach(btn => {
    btn.addEventListener('click', () => {
      const countEl = btn.childNodes[btn.childNodes.length - 1];
      const current = parseInt(btn.textContent.trim(), 10);
      const liked = btn.classList.toggle('active');
      countEl.textContent = ' ' + (liked ? current + 1 : current - 1);
    });
  });

  // ---- follow buttons (purely visual, demo only) ----
  document.querySelectorAll('.follow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const following = btn.classList.toggle('active');
      btn.textContent = following ? 'フォロー中' : 'フォロー';
    });
  });

  // ---- search input: empty state + clear button ----
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const resultsEl = document.getElementById('results');
  const trendingStateEl = document.getElementById('trending-state');
  const historyStateEl = document.getElementById('history-state');
  const filterTabsEl = document.querySelector('.tabs');
  const tabTrackEl = document.querySelector('.tab-track');

  // ---- 検索前：話題のコミュニティ(コミュニティのトップ画面と同じ3件) ----
  function trendingCardHTML(c) {
    const joined = Kakko.isJoined(c.id);
    const action = joined
      ? '<a class="result-work-link" href="community-detail.html?c=' + encodeURIComponent(c.id) + '">見る</a>'
      : '<a class="result-work-link" href="community-join.html?q=' + encodeURIComponent(c.name) + '">参加する</a>';
    return '<article class="community-card" data-community-id="' + c.id + '">' +
        Kakko.iconHTML(c) +
        '<div class="community-card-body">' +
          '<p class="community-card-title">' + Kakko.esc(c.name) + '</p>' +
          '<p class="community-card-meta">『' + Kakko.esc(c.work) + '』 ・ ' + Kakko.memberText(c) + '</p>' +
        '</div>' + action +
      '</article>';
  }
  document.getElementById('trending-list').innerHTML = ['hai', 'silent', 'yoru']
    .map(Kakko.get).map(trendingCardHTML).join('');

  // ---- 検索中：検索履歴(デモ用の固定データ。本番ではcookieで1週間保持する想定) ----
  const SEARCH_HISTORY_DEMO = ['灰と星屑', 'りく', 'ネタバレ', '夜想曲のリベルタ'];
  const HISTORY_ICON = '<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 4.5V8l2.5 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3"/></svg>';
  document.getElementById('history-list').innerHTML = SEARCH_HISTORY_DEMO.map(term =>
    '<button type="button" class="history-row" data-term="' + Kakko.esc(term) + '">' +
      '<span class="history-icon">' + HISTORY_ICON + '</span>' +
      '<span class="history-term">' + Kakko.esc(term) + '</span>' +
    '</button>'
  ).join('');
  const historyListEl = document.getElementById('history-list');
  // クリックの瞬間に検索欄がblurして履歴パネルが先に閉じてしまわないようにする
  historyListEl.addEventListener('mousedown', e => {
    if (e.target.closest('[data-term]')) e.preventDefault();
  });
  historyListEl.addEventListener('click', e => {
    const row = e.target.closest('[data-term]');
    if (!row) return;
    searchInput.value = row.dataset.term;
    refreshSearchState();
  });

  // ---- 検索前 / 検索中 / 検索後 の切り替え ----
  // 検索前: 未フォーカス・未入力 → 話題のコミュニティ
  // 検索中: フォーカス中・未入力 → 検索履歴
  // 検索後: 入力あり → 検索結果(今まで通り)
  let inputFocused = false;

  function refreshSearchState() {
    const hasQuery = searchInput.value.trim().length > 0;
    searchClear.hidden = !hasQuery;

    resultsEl.hidden = !hasQuery;
    filterTabsEl.style.visibility = hasQuery ? 'visible' : 'hidden';
    tabTrackEl.style.visibility = hasQuery ? 'visible' : 'hidden';

    historyStateEl.hidden = !(inputFocused && !hasQuery);
    trendingStateEl.hidden = hasQuery || (inputFocused && !hasQuery);
  }

  searchInput.addEventListener('input', refreshSearchState);
  searchInput.addEventListener('focus', () => { inputFocused = true; refreshSearchState(); });
  searchInput.addEventListener('blur', () => { inputFocused = false; refreshSearchState(); });
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    refreshSearchState();
  });
  refreshSearchState();

}
window.initSearch = initSearch;
