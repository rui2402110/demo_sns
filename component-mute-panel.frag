<div class="mute-tab" id="mute-tab" role="button" tabindex="0" aria-label="ドラッグしてミュートワード設定を開く" aria-expanded="false">
  <span class="mute-tab-label">
    <span class="mute-tab-grip"><span></span><span></span><span></span></span>
    ミュート設定
  </span>
</div>

<div class="mute-panel-backdrop" id="mute-panel-backdrop" hidden></div>

<aside class="mute-panel" id="mute-panel" aria-label="ミュートワード設定">
  <div class="mute-panel-handle" id="mute-panel-handle"></div>
  <div class="mute-panel-head">
    <p class="mute-panel-title">ミュートワード</p>
    <button type="button" class="mute-panel-close" id="mute-panel-close" aria-label="閉じる">✕</button>
  </div>
  <div class="mute-panel-body">
    <p class="mute-panel-desc">登録した単語を含む投稿を目立たなくします。設定画面のミュートワードと共有されます。</p>
    <div class="mute-add-row">
      <input type="text" class="mute-input" id="panel-mute-input" placeholder="ミュートしたい単語を入力" maxlength="40">
      <button type="button" class="mute-add-btn" id="panel-mute-add-btn">追加</button>
    </div>
    <p class="mute-empty" id="panel-mute-empty" hidden>登録されているミュートワードはありません</p>
    <div class="mute-list" id="panel-mute-list"></div>
    <a class="mute-panel-link" href="settings.html">設定画面で詳しく管理する →</a>
  </div>
</aside>
