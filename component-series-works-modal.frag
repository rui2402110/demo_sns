<!--
  component-series-works-modal.frag
  シリーズ内作品管理ポップアップ。自分の作品を一覧し、追加/外すを切り替えて「保存する」で確定する。
  中身は series-works-modal.js (SeriesWorksModal.open) が描画する。
-->
<div class="sm-overlay" id="series-works-overlay">
  <div class="sm-card sw-card" role="dialog" aria-modal="true" aria-labelledby="sw-title">
    <p class="sm-title" id="sw-title">シリーズ内の作品を管理</p>
    <p class="sm-subtitle" id="sw-subtitle">作品の追加と、シリーズからの除外ができます</p>

    <p class="sw-heading">シリーズ内の作品 <span id="sw-in-count">0</span></p>
    <div class="sw-list" id="sw-in-list"></div>

    <p class="sw-heading">追加できる作品</p>
    <div class="sw-list" id="sw-out-list"></div>

    <div class="sm-actions">
      <button type="button" class="sm-cancel" id="sw-cancel">キャンセル</button>
      <button type="button" class="sm-submit" id="sw-save">保存する</button>
    </div>
  </div>
</div>
