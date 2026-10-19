/*
 * works-list.js — works-list.html のページ固有処理
 * シリーズ一覧・(シリーズに属さない)作品一覧を KakkoSeries から描画し、
 * シリーズ作成は共用ポップアップ(SeriesModal)を使う。
 * Depends on: community-common.js (Kakko), series-store.js, series-modal.js
 */
function initWorksList() {
  var S = window.KakkoSeries;

  function render() {
    // シリーズ一覧
    document.getElementById('series-list').innerHTML = S.list().map(function (s) {
      return '<a class="series-row" href="series-view.html?id=' + encodeURIComponent(s.id) + '">' +
        '<span class="series-icon">' +
          '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 14c1-4 2.5-8 6.5-9.5C9 7 10.5 8.5 13 9c-1.5 2-4 2.5-6 2-1.5 1-3 2-4.5 3Z" stroke="#f4ead9" stroke-width="1.1" stroke-linejoin="round"/><path d="M13 9c1.5-.5 3-1.5 4.5-3.5" stroke="#f4ead9" stroke-width="1.1" stroke-linecap="round"/></svg>' +
        '</span>' +
        '<span class="community-card-body">' +
          '<span class="community-card-title">' + S.esc(s.name) + ' ' + S.badgeHTML(s) + '</span>' +
          '<span class="community-card-meta">' + S.metaText(s) + '</span>' +
        '</span></a>';
    }).join('');

    // シリーズに入っていない作品
    var free = S.works().filter(function (w) { return !S.seriesOfWork(w.id); });
    document.getElementById('works-list').innerHTML = free.map(function (w) {
      return '<article class="mywork-row">' + S.workIconHTML(w, 18) +
        '<span class="community-card-body">' +
          '<span class="community-card-title">' + S.esc(w.title) + ' <span class="badge badge-type">' + S.esc(w.type) + '</span></span>' +
          '<span class="community-card-meta">閲覧 ' + S.num(w.views) + ' ・ いいね ' + S.num(w.likes) + ' ・ コメント ' + w.comments + '</span>' +
        '</span>' +
        '<span class="mywork-actions">' +
          '<a class="ghost-btn" href="works-edit.html?id=' + encodeURIComponent(w.id) + '">編集</a>' +
          '<a class="result-work-link" href="works-view.html?id=' + encodeURIComponent(w.id) + '">見る</a>' +
        '</span></article>';
    }).join('') || '<div class="empty-state"><p>シリーズに入っていない作品はありません。</p></div>';
  }

  // ---- series create (共用ポップアップ) ----
  document.getElementById('open-series-modal').addEventListener('click', function () {
    SeriesModal.open({
      mode: 'create',
      onSubmit: function (data) {
        S.create(data);
        render();
        Kakko.showToast('「' + data.name + '」を作成しました');
      }
    });
  });

  render();
}
window.initWorksList = initWorksList;
