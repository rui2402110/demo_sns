<!--
  component-series-modal.frag
  シリーズの「作成」「更新」で共用するポップアップ。
  タイトル・ボタン文言・初期値は series-modal.js (SeriesModal.open) が差し替える。
-->
<div class="sm-overlay" id="series-modal-overlay">
  <div class="sm-card" role="dialog" aria-modal="true" aria-labelledby="series-modal-title">
    <p class="sm-title" id="series-modal-title">シリーズを作成する</p>
    <p class="sm-subtitle" id="series-modal-subtitle">連なる作品をまとめる、シリーズを新しく作ります</p>

    <div class="form-field">
      <label class="form-label" for="series-name">シリーズ名</label>
      <input type="text" id="series-name" class="form-input" placeholder="例：海鳴りの一味" autocomplete="off" maxlength="60">
    </div>

    <div class="form-field">
      <label class="form-label" for="series-desc">概要</label>
      <textarea id="series-desc" class="form-input form-textarea" rows="3" placeholder="シリーズの概要を書きましょう"></textarea>
    </div>

    <div class="form-field" style="margin-bottom: 4px;">
      <label class="form-label">状態</label>
      <div class="sm-status-options">
        <label class="sm-status-option">
          <input type="radio" name="series-status" value="ongoing" class="format-radio" checked>
          連載中
        </label>
        <label class="sm-status-option">
          <input type="radio" name="series-status" value="done" class="format-radio">
          完結済み
        </label>
      </div>
    </div>

    <div class="sm-actions">
      <button type="button" class="sm-cancel" id="series-modal-cancel">キャンセル</button>
      <button type="button" class="sm-submit" id="series-modal-submit" disabled>作成する</button>
    </div>
  </div>
</div>
