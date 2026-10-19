/*
 * works-upload.js — page-local script for works-upload.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initWorksUpload() {

  // ---- elements ----
  const titleInput = document.getElementById('f-title');
  const editorField = document.getElementById('editor-field');
  const editorBody = document.getElementById('editor-body');
  const dropzoneField = document.getElementById('dropzone-field');
  const dropzone = document.getElementById('dropzone');
  const dropzoneLabel = document.getElementById('dropzone-label');
  const dropzoneText = document.getElementById('dropzone-text');
  const fileInput = document.getElementById('file-input');
  const filePreviewGrid = document.getElementById('file-preview-grid');
  const filePreviewHint = document.getElementById('file-preview-hint');
  const submitBtn = document.getElementById('upload-submit');
  let selectedFiles = [];
  let previewURLs = [];

  // ---- content-type switch ----
  const typeLabels = {
    image: { label: 'ファイル（画像）', text: 'ここに画像をドラッグ＆ドロップ', accept: 'image/*' },
    video: { label: 'ファイル（動画）', text: 'ここに動画をドラッグ＆ドロップ', accept: 'video/*' },
  };

  document.querySelectorAll('input[name="wtype"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isText = radio.value === 'text';
      editorField.hidden = !isText;
      dropzoneField.hidden = isText;
      if (!isText) {
        const t = typeLabels[radio.value];
        dropzoneLabel.textContent = t.label;
        if (selectedFiles.length === 0) dropzoneText.textContent = t.text;
        fileInput.setAttribute('accept', t.accept);
      }
      refreshSubmitState();
    });
  });

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

  editorBody.addEventListener('input', refreshSubmitState);

  // ---- ファイルプレビュー（画像サムネイル表示 + ドラッグで並び替え） ----
  const VIDEO_PREVIEW_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="4.5" width="14.5" height="15" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M17.5 10.3l4.2-2.6v8.6l-4.2-2.6" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';
  const GENERIC_PREVIEW_ICON = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 4.5h14v13H4z" stroke="currentColor" stroke-width="1.3"/><path d="M4 14.5l4.5-5 3.5 3.8 2.5-2.8 3.5 4" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>';

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function revokePreviewURLs() {
    previewURLs.forEach(u => { if (u) URL.revokeObjectURL(u); });
    previewURLs = [];
  }

  function renderFilePreview() {
    revokePreviewURLs();
    filePreviewHint.hidden = selectedFiles.length < 2;
    filePreviewGrid.innerHTML = selectedFiles.map((f, i) => {
      let thumbInner;
      if (f.type && f.type.startsWith('image/')) {
        const url = URL.createObjectURL(f);
        previewURLs[i] = url;
        thumbInner = `<img src="${url}" alt="${escHtml(f.name)}">`;
      } else {
        previewURLs[i] = null;
        thumbInner = `<span class="file-preview-icon">${f.type && f.type.startsWith('video/') ? VIDEO_PREVIEW_ICON : GENERIC_PREVIEW_ICON}</span>`;
      }
      return `
        <div class="file-preview-card" draggable="true" data-index="${i}">
          <span class="file-preview-order">${i + 1}</span>
          <button type="button" class="file-preview-remove" data-index="${i}" aria-label="削除">×</button>
          <div class="file-preview-thumb">${thumbInner}</div>
          <p class="file-preview-name">${escHtml(f.name)}</p>
        </div>
      `;
    }).join('');
    attachPreviewEvents();
  }

  function attachPreviewEvents() {
    filePreviewGrid.querySelectorAll('.file-preview-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedFiles.splice(parseInt(btn.dataset.index, 10), 1);
        renderFilePreview();
        updateDropzoneState();
      });
    });

    const cards = filePreviewGrid.querySelectorAll('.file-preview-card');
    cards.forEach(card => {
      card.addEventListener('dragstart', e => {
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.index);
      });
      card.addEventListener('dragend', () => {
        cards.forEach(c => { c.classList.remove('dragging'); c.classList.remove('drag-over'); });
      });
      card.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('drag-over'));
      card.addEventListener('drop', e => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        const toIndex = parseInt(card.dataset.index, 10);
        if (Number.isNaN(fromIndex) || fromIndex === toIndex) return;
        const [moved] = selectedFiles.splice(fromIndex, 1);
        selectedFiles.splice(toIndex, 0, moved);
        renderFilePreview();
      });
    });
  }

  function updateDropzoneState() {
    dropzone.classList.toggle('has-file', selectedFiles.length > 0);
    const type = document.querySelector('input[name="wtype"]:checked').value;
    if (selectedFiles.length > 0) {
      dropzoneText.textContent = selectedFiles.length + '件のファイルを選択中';
    } else if (typeLabels[type]) {
      dropzoneText.textContent = typeLabels[type].text;
    }
    refreshSubmitState();
  }

  function addFiles(fileList) {
    Array.from(fileList).forEach(f => selectedFiles.push(f));
    renderFilePreview();
    updateDropzoneState();
  }

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener('change', () => {
    addFiles(fileInput.files);
    fileInput.value = '';
  });

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', e => {
    if (e.dataTransfer && e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  });

  // 関連作品は related-works.js(作品引用と同じパレット)が担当

  // ---- submit validation ----
  function refreshSubmitState() {
    const type = document.querySelector('input[name="wtype"]:checked').value;
    const hasTitle = titleInput.value.trim().length > 0;
    const hasContent = type === 'text'
      ? editorBody.textContent.trim().length > 0
      : selectedFiles.length > 0;
    submitBtn.disabled = !(hasTitle && hasContent);
  }

  titleInput.addEventListener('input', refreshSubmitState);

  submitBtn.addEventListener('click', () => {
    document.getElementById('success-title').textContent = '「' + titleInput.value.trim() + '」を投稿しました';
    document.getElementById('create-view').hidden = true;
    document.getElementById('success-view').hidden = false;
    window.scrollTo(0, 0);
  });

}
window.initWorksUpload = initWorksUpload;
