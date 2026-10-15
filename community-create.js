/*
 * community-create.js — page-local script for community-create.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initCommunityCreate() {

  const nameInput = document.getElementById('f-name');
  const workInput = document.getElementById('f-work');
  const descInput = document.getElementById('f-desc');
  const dupWarning = document.getElementById('dup-warning');
  const dupWarningText = document.getElementById('dup-warning-text');
  const submitBtn = document.getElementById('create-submit');

  // ---- 同じ作品の既存コミュニティを知らせる(共通データを参照) ----
  workInput.addEventListener('input', () => {
    const value = workInput.value.trim();
    const match = value.length > 0
      ? Kakko.all().find(c => value.includes(c.work) || c.work.includes(value))
      : null;
    if (match) {
      dupWarningText.textContent = '「' + match.name + '」（' + Kakko.memberText(match) + '）が見つかりました。';
      dupWarning.hidden = false;
    } else {
      dupWarning.hidden = true;
    }
    refreshSubmitState();
  });
  nameInput.addEventListener('input', refreshSubmitState);

  // ---- 概要: URLがあればリンクとしての表示イメージを見せる ----
  const descPreview = document.getElementById('desc-preview');
  const descPreviewText = document.getElementById('desc-preview-text');
  descInput.addEventListener('input', () => {
    const text = descInput.value;
    const hasUrl = /https?:\/\/[A-Za-z0-9\-._~:\/?#\[\]@!$&;'()*+,=%]+/.test(text);
    descPreview.hidden = !hasUrl;
    if (hasUrl) descPreviewText.innerHTML = Kakko.linkify(text);
  });

  // ---- アイコン設定(色 × 図柄 / 画像) ----
  const iconState = { glyph: 'star', color: 'orange', image: null };
  const iconPreview = document.getElementById('icon-preview');
  const uploadBtn = document.getElementById('icon-upload');
  const removeBtn = document.getElementById('icon-remove');
  const fileInput = document.getElementById('icon-file');

  function renderIconSetting() {
    iconPreview.innerHTML = Kakko.iconHTML({ icon: iconState }, { size: 72, radius: 20 });
    removeBtn.hidden = !iconState.image;
    uploadBtn.textContent = iconState.image ? '画像を変更する' : '画像を選ぶ';
  }
  uploadBtn.addEventListener('click', () => fileInput.click());
  removeBtn.addEventListener('click', () => { iconState.image = null; fileInput.value = ''; renderIconSetting(); });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { Kakko.showToast('画像ファイルを選んでください'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // 正方形に切り抜いて小さく保存する(デモの保存容量を抑えるため)
        const size = 128, side = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        canvas.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        iconState.image = canvas.toDataURL('image/jpeg', 0.85);
        renderIconSetting();
      };
      img.onerror = () => Kakko.showToast('画像を読み込めませんでした');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  renderIconSetting();

  // ---- 作成(コミュニティ形式はオープンのみ) ----
  function refreshSubmitState() {
    submitBtn.disabled = !(nameInput.value.trim() && workInput.value.trim());
  }
  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const id = Kakko.create({ name: name, work: workInput.value.trim(), desc: descInput.value.trim(), icon: Object.assign({}, iconState) });
    document.getElementById('success-title').textContent = '「' + name + '」を作成しました';
    document.getElementById('success-detail').href = 'community-detail.html?c=' + encodeURIComponent(id);
    document.getElementById('create-view').hidden = true;
    document.getElementById('success-view').hidden = false;
    window.scrollTo(0, 0);
  });

}
window.initCommunityCreate = initCommunityCreate;
