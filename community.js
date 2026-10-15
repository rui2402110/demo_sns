/*
 * community.js — page-local script for community.html (the community hub:
 * trending + recommended community cards). Uses the shared community-tile
 * markup shape (see component-community-tile.frag) generated here via
 * Kakko helpers, consistent with community-list.js / community-detail.js.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initCommunityHub() {
  function card(c, sub) {
    const joined = Kakko.isJoined(c.id);
    const action = joined
      ? '<a class="result-work-link" href="community-detail.html?c=' + encodeURIComponent(c.id) + '&from=hub">見る</a>'
      : '<a class="result-work-link" href="community-join.html?q=' + encodeURIComponent(c.name) + '">参加する</a>';
    return '<article class="community-card" data-community-id="' + c.id + '">' +
        Kakko.iconHTML(c) +
        '<div class="community-card-body">' +
          '<p class="community-card-title">' + Kakko.esc(c.name) + ' <span class="badge badge-open">オープン</span></p>' +
          '<p class="community-card-meta">' + sub + '</p>' +
        '</div>' + action +
      '</article>';
  }
  function meta(c) {
    return '『' + Kakko.esc(c.work) + '』 ・ ' + Kakko.memberText(c) + (Kakko.isJoined(c.id) ? ' ・ 参加中' : '');
  }
  document.getElementById('trending').innerHTML = ['hai', 'silent', 'yoru']
    .map(Kakko.get).map(c => card(c, meta(c))).join('');
  document.getElementById('recommend').innerHTML = [
    ['hana', '灰と星屑 感想部と近いジャンルです'],
    ['kosatsu', '灰と星屑 感想部のメンバーが参加しています'],
    ['yoru', 'はるとさんがホストをしています'],
  ].map(([id, reason]) => card(Kakko.get(id), reason)).join('');
}
window.initCommunityHub = initCommunityHub;
