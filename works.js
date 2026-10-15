/*
 * works.js — page-local script for works.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initWorks() {

  // ---- mobile sidebar drawer ----
  const sidenavDrawer = document.getElementById('sidenav-drawer');
  const sidenavBackdrop = document.getElementById('sidenav-backdrop');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const sidenavCloseBtn = document.getElementById('sidenav-close');

  function openDrawer() {
    sidenavDrawer.classList.add('mobile-open');
    sidenavBackdrop.classList.add('show');
    menuToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidenavDrawer.classList.remove('mobile-open');
    sidenavBackdrop.classList.remove('show');
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggleBtn.addEventListener('click', openDrawer);
  sidenavCloseBtn.addEventListener('click', closeDrawer);
  sidenavBackdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 980) closeDrawer();
  });

  // ---- works search box (demo only, no real filtering) ----
  const worksSearchInput = document.getElementById('works-search-input');
  const worksSearchClear = document.getElementById('works-search-clear');

  worksSearchInput.addEventListener('input', () => {
    worksSearchClear.hidden = worksSearchInput.value.length === 0;
  });

  worksSearchClear.addEventListener('click', () => {
    worksSearchInput.value = '';
    worksSearchClear.hidden = true;
    worksSearchInput.focus();
  });

  worksSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      Kakko.showToast('検索機能は準備中です（デモ）');
    }
  });

  // ---- content-type tabs ----
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');
  const workCards = document.querySelectorAll('.work-card');

  function positionIndicator(tab) {
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    workCards.forEach(card => {
      card.hidden = tab.dataset.filter !== 'all' && card.dataset.type !== tab.dataset.filter;
    });
    positionIndicator(tab);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
  window.addEventListener('resize', () => {
    const active = document.querySelector('.tab.active');
    if (active) positionIndicator(active);
  });
  positionIndicator(document.querySelector('.tab.active'));

  // ---- favorite toggle (visual only, demo) ----
  document.querySelectorAll('.work-fav-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

}
window.initWorks = initWorks;
