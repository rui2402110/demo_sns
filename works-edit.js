/*
 * works-edit.js — works-edit.html のページ固有スクリプト(デモ)。
 * 初期値は常に「灰と星屑」の値。保存しても実際の値は変更しない。
 * 関連作品は related-works.js(initRelatedWorks)が担当。
 * Depends on: community-common.js (Kakko), loader.js, work-catalog.js, related-works.js.
 */
function initWorksEdit() {
  const titleInput = document.getElementById('f-title');
  const editorBody = document.getElementById('editor-body');
  const descInput = document.getElementById('f-desc');
  const submitBtn = document.getElementById('edit-submit');

  // ---- 初期値(デモ: 「灰と星屑」) ----
  titleInput.value = '灰と星屑';
  editorBody.innerHTML = [
    '隕石が降った夜、僕らは互いの名前しか覚えていなかった。灰のように降り積もる沈黙の中で、彼女は空を指差してこう言った。「星屑なら、まだ拾えるかもしれない」',
    '幼馴染だったはずの二人の記憶は、あの夜を境に少しずつずれていく。それでも変わらないものを探して、僕は今日も瓦礫の街を歩いている。',
    '最終話となるこの章では、長く隠されていた真実と、ふたりの再会が描かれる。'
  ].map(t => '<p>' + t + '</p>').join('');
  descInput.value = '隕石が降った夜から始まる、二人の記憶と再会の物語。';

  // ---- HTML editor toolbar ----
  document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      editorBody.focus();
      if (btn.dataset.cmd === 'createLink') {
        const url = window.prompt('リンク先のURLを入力してください', 'https://');
        if (url) document.execCommand('createLink', false, url);
      } else if (btn.dataset.value) {
        document.execCommand(btn.dataset.cmd, false, btn.dataset.value);
      } else {
        document.execCommand(btn.dataset.cmd, false, null);
      }
      refreshSubmitState();
    });
  });

  // ---- 保存ボタンの有効/無効(タイトルと本文が空でなければ保存可) ----
  function refreshSubmitState() {
    submitBtn.disabled = !(titleInput.value.trim().length > 0 && editorBody.textContent.trim().length > 0);
  }
  titleInput.addEventListener('input', refreshSubmitState);
  editorBody.addEventListener('input', refreshSubmitState);
  refreshSubmitState();

  // ---- 保存(デモ: 値は変更せず完了画面を表示) ----
  submitBtn.addEventListener('click', () => {
    document.getElementById('success-title').textContent = '「' + titleInput.value.trim() + '」を更新しました';
    document.getElementById('create-view').hidden = true;
    document.getElementById('success-view').hidden = false;
    window.scrollTo(0, 0);
  });
}
window.initWorksEdit = initWorksEdit;
