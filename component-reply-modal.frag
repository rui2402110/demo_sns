<div class="reply-modal-overlay" id="reply-modal-overlay" hidden>
  <div class="reply-modal" role="dialog" aria-modal="true" aria-label="返信を作成">
    <div class="reply-modal-head">
      <button type="button" class="reply-modal-close" id="reply-modal-close" aria-label="閉じる">✕</button>
    </div>
    <div class="reply-modal-body">
      <div class="reply-original">
        <div class="reply-original-avatarcol">
          <div class="avatar a1" id="reply-orig-avatar">あ</div>
          <div class="reply-thread-line"></div>
        </div>
        <div class="reply-original-main">
          <div class="reply-original-head">
            <span class="name" id="reply-orig-name"></span>
            <span class="community" id="reply-orig-community" hidden></span>
            <time class="time" id="reply-orig-time"></time>
          </div>
          <p class="reply-original-body" id="reply-orig-body"></p>
          <p class="reply-original-to">返信先: <span id="reply-orig-to-name"></span>さん</p>
        </div>
      </div>

      <div class="reply-compose">
        <div class="avatar a1">あ</div>
        <textarea class="reply-compose-input" id="reply-compose-input" placeholder="返信をポスト" rows="1"></textarea>
      </div>

      <div class="attach-preview" id="reply-attach-preview" hidden>
        <div class="attach-thumb" id="reply-attach-thumb"></div>
        <button class="attach-remove" id="reply-attach-remove" type="button" aria-label="添付を削除">×</button>
      </div>
    </div>
    <div class="reply-modal-foot">
      <div class="composer-tools">
        <button class="tool-btn" id="reply-tool-image" type="button" title="画像を添付">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.8" y="3.8" width="14.4" height="12.4" rx="1.6" stroke="currentColor" stroke-width="1.3"/><circle cx="7.2" cy="8" r="1.3" stroke="currentColor" stroke-width="1.2"/><path d="M3.4 14.2l4.6-4.6 3.6 3.6 2.1-2.1 3.3 3.3" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>
        </button>
        <button class="tool-btn" id="reply-tool-video" type="button" title="動画を添付">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4.5" width="10.5" height="11" rx="1.6" stroke="currentColor" stroke-width="1.3"/><path d="M13 9.2l4.5-2.4v6.4L13 10.8z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <button class="composer-submit" id="reply-submit" type="button" disabled>返信する</button>
    </div>
  </div>
</div>
