<!--
  component-community-tile.frag
  Representative example of a community list row/tile. In the running app
  rows are generated at runtime (see rowHTML()/tileHTML() style helpers,
  consolidated under Kakko.iconHTML + the page's own render loop in
  community-list.js / community.js), which build this exact markup for each
  joined/discoverable community.
-->
<div class="community-row" data-community-id="hai">
  <a class="community-row-link" href="community-detail.html?c=hai">
    <span class="community-icon" aria-hidden="true">灰</span>
    <span class="community-card-body">
      <span class="community-card-title">灰と星屑 感想部 <span class="badge badge-open">オープン</span></span>
      <span class="community-card-meta">『灰と星屑』 ・ 1,204人が参加 ・ ホスト ゆき</span>
      <span class="community-card-teaser">ゆき：積読解消するぞの意気込みで開いた…</span>
    </span>
    <span class="action-arrow" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4.5 4.5L5 12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
  </a>
  <button class="fav-btn active" type="button" data-fav="hai" aria-pressed="true" aria-label="お気に入りを解除" title="お気に入り済み(タップで解除)">
    <svg width="19" height="19" viewBox="0 0 22 22" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M11 2 13.8 8.4 20.8 9 15.4 13.6 17 20.4 11 16.7 5 20.4 6.6 13.6 1.2 9 8.2 8.4 11 2Z"/></svg>
  </button>
</div>
