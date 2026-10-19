/*
 * related-works.js — 作品投稿の「関連作品」欄。
 * 作品引用と同じパレット(component-work-picker.frag)で作品を選び、
 * 引用プレビューと同じカードを積み上げる(何件でも追加可)。
 * component-work-picker.frag を読み込んだ後に initRelatedWorks() を呼ぶ。
 * window.RelatedWorks.get() で選択中の作品一覧を取得できる。
 */
function initRelatedWorks() {
  const { WORKS, WORK_ICONS } = window.KakkoWorks;
  const listEl = document.getElementById('related-list');
  const addBtn = document.getElementById('related-add');
  const overlay = document.getElementById('palette-overlay');
  const paletteList = document.getElementById('palette-list');
  if (!listEl || !addBtn || !overlay) return;
  let selected = [];

  function render() {
    listEl.innerHTML = selected.map(w => `
      <div class="quote-preview related-item" data-id="${w.id}">
        <div class="quote-preview-icon" style="${w.style}">${WORK_ICONS[w.icon]}</div>
        <div class="quote-preview-body">
          <p class="quote-preview-title">${w.title}</p>
          <p class="quote-preview-meta">${w.type} ・ ${w.author}</p>
        </div>
        <button class="attach-remove" type="button" data-remove="${w.id}" aria-label="関連作品から外す">×</button>
      </div>
    `).join('');
  }

  listEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    selected = selected.filter(w => w.id !== btn.dataset.remove);
    render();
  });

  function closePalette() { overlay.hidden = true; }

  function openPalette() {
    const rest = WORKS.filter(w => !selected.some(s => s.id === w.id));
    paletteList.innerHTML = rest.length ? rest.map(w => `
      <button class="palette-item" type="button" data-id="${w.id}">
        <span class="palette-item-icon" style="${w.style}">${WORK_ICONS[w.icon]}</span>
        <span class="palette-item-body">
          <span class="palette-item-title">${w.title}</span>
          <span class="palette-item-meta">${w.type} ・ ${w.author} ・ 閲覧 ${w.views}</span>
        </span>
      </button>
    `).join('') : '<p class="palette-empty">追加できる作品はもうありません</p>';
    paletteList.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('click', () => {
        selected.push(WORKS.find(w => w.id === item.dataset.id));
        render();
        closePalette();
      });
    });
    overlay.querySelector('.palette-title').textContent = '関連作品に追加する作品を選ぶ';
    overlay.hidden = false;
  }

  addBtn.addEventListener('click', openPalette);
  document.getElementById('palette-close').addEventListener('click', closePalette);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePalette(); });

  window.RelatedWorks = { get: function () { return selected.slice(); } };
}
window.initRelatedWorks = initRelatedWorks;
