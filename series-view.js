/*
 * series-view.js — series-view.html のページ固有処理
 * ?id=シリーズID のシリーズを KakkoSeries から描画し、
 * 「シリーズを更新」「シリーズ内作品管理」のポップアップを開く。
 * Depends on: community-common.js (Kakko), series-store.js, series-modal.js, series-works-modal.js
 */
function initSeriesView() {
  var S = window.KakkoSeries;
  var id = new URLSearchParams(location.search).get('id') || 'uminari';
  var $ = function (i) { return document.getElementById(i); };

  function render() {
    var s = S.get(id);
    $('sv-header').hidden = !s;
    $('sv-list-heading').hidden = !s;
    $('sv-notfound').hidden = !!s;
    if (!s) { $('sv-list').innerHTML = ''; return; }

    document.title = 'kakko. ｜ ' + s.name;
    $('sv-title').innerHTML = S.esc(s.name) + ' ' + S.badgeHTML(s);
    $('sv-meta').textContent = S.metaText(s);
    $('sv-desc').innerHTML = s.desc ? S.esc(s.desc) : '<span class="series-desc-empty">概要は未設定です</span>';

    var rows = s.works.map(function (wid) {
      var w = S.workById(wid);
      if (!w) return '';
      return '<article class="mywork-row">' + S.workIconHTML(w) +
        '<span class="community-card-body">' +
          '<span class="community-card-title">' + S.esc(w.title) + ' <span class="badge badge-type">' + S.esc(w.type) + '</span></span>' +
          '<span class="community-card-meta">閲覧 ' + S.num(w.views) + ' ・ いいね ' + S.num(w.likes) + ' ・ コメント ' + w.comments + '</span>' +
        '</span>' +
        '<span class="mywork-actions"><a class="result-work-link" href="works-view.html?id=' + encodeURIComponent(w.id) + '">見る</a></span>' +
      '</article>';
    }).join('');
    $('sv-list').innerHTML = rows || '<div class="empty-state"><p>まだ作品がありません。「シリーズ内作品管理」から追加できます。</p></div>';
  }

  $('sv-edit').addEventListener('click', function () {
    var s = S.get(id); if (!s) return;
    SeriesModal.open({
      mode: 'edit', name: s.name, desc: s.desc, status: s.status,
      onSubmit: function (data) {
        S.update(id, data);
        render();
        Kakko.showToast('シリーズを更新しました');
      }
    });
  });

  $('sv-manage').addEventListener('click', function () {
    SeriesWorksModal.open({
      seriesId: id,
      onSave: function (ids) {
        S.setWorks(id, ids);
        render();
        Kakko.showToast('シリーズ内の作品を更新しました(全' + ids.length + '話)');
      }
    });
  });

  render();
}
window.initSeriesView = initSeriesView;
