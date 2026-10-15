<section class="composer" id="composer" hidden>
  <p class="composer-target" id="composer-target"></p>
  <div class="composer-row">
    <div class="avatar a1">あ</div>
    <textarea
      class="composer-input"
      id="composer-input"
      placeholder="いま感じたことをシェアしよう"
      rows="1"
    ></textarea>
  </div>

  <!-- 添付プレビュー（画像・動画デモ） -->
  <div class="attach-preview" id="attach-preview" hidden>
    <div class="attach-thumb" id="attach-thumb"></div>
    <button class="attach-remove" id="attach-remove" type="button" aria-label="添付を削除">×</button>
  </div>

  <!-- 引用プレビュー -->
  <div class="quote-preview" id="quote-preview" hidden>
    <div class="quote-preview-icon" id="quote-preview-icon"></div>
    <div class="quote-preview-body">
      <p class="quote-preview-title" id="quote-preview-title"></p>
      <p class="quote-preview-meta" id="quote-preview-meta"></p>
    </div>
    <button class="attach-remove" id="quote-remove" type="button" aria-label="引用を解除">×</button>
  </div>

  <div class="composer-foot">
    <div class="composer-tools">
      <button class="tool-btn" id="tool-image" type="button" title="画像を添付">
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.8" y="3.8" width="14.4" height="12.4" rx="1.6" stroke="currentColor" stroke-width="1.3"/><circle cx="7.2" cy="8" r="1.3" stroke="currentColor" stroke-width="1.2"/><path d="M3.4 14.2l4.6-4.6 3.6 3.6 2.1-2.1 3.3 3.3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
      </button>
      <button class="tool-btn" id="tool-video" type="button" title="動画を添付">
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="10.5" height="11" rx="1.6" stroke="currentColor" stroke-width="1.3"/><path d="M13 9.2l4.5-2.4v6.4L13 10.8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
      </button>
      <button class="tool-btn" id="tool-quote" type="button" title="作品を引用">
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><path d="M5 6.5h10M5 10h10M5 13.5h6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="composer-actions">
      <button class="composer-cancel" id="composer-cancel" type="button">キャンセル</button>
      <button class="composer-submit" id="composer-submit" type="button" disabled>投稿する</button>
    </div>
  </div>
</section>
