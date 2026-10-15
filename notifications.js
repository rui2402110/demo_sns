/*
 * notifications.js — page-local script for notifications.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initNotifications() {

  // ---- filter tabs ----
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');
  const notifItems = document.querySelectorAll('.notif-item');
  const headings = document.querySelectorAll('.notif-heading');

  function positionIndicator(tab) {
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    const filter = tab.dataset.filter;
    notifItems.forEach(item => {
      item.style.display = (filter === 'all' || item.dataset.type === filter) ? '' : 'none';
    });
    headings.forEach(h => {
      let el = h.nextElementSibling;
      let hasVisible = false;
      while (el && !el.classList.contains('notif-heading')) {
        if (el.style.display !== 'none') hasVisible = true;
        el = el.nextElementSibling;
      }
      h.style.display = hasVisible ? '' : 'none';
    });
    positionIndicator(tab);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
  window.addEventListener('resize', () => {
    const active = document.querySelector('.tab.active');
    if (active) positionIndicator(active);
  });
  positionIndicator(document.querySelector('.tab.active'));

  // ---- clicking a notification marks it as read (demo only) ----
  notifItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.remove('unread');
    });
  });

}
window.initNotifications = initNotifications;
