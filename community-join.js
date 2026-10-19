/*
 * community-join.js — page-local script for community-join.html.
 * Depends on: community-common.js (Kakko), loader.js.
 */
function initCommunityJoin() {

  const input = document.getElementById('q');
  const clearBtn = document.getElementById('q-clear');
  const resultsEl = document.getElementById('results');
  const countEl = document.getElementById('result-count');
  const emptyEl = document.getElementById('empty');
  const tabs = document.querySelectorAll('.tab');
  const indicator = document.querySelector('.tab-indicator');
  let mode = 'latest';   // latest | oldest | user | community

  // ---- 検索対象(コミュニティとユーザー)を作成日の情報つきでまとめる ----
  function collect() {
    const items = [];
    Kakko.all().forEach(c => items.push({ kind: 'community', created: c.created, c }));
    Kakko.USERS.forEach(u => items.push({ kind: 'user', created: Kakko.toMs(u.created), u, c: Kakko.get(u.community) }));
    return items;
  }
  function matches(item, q) {
    if (!q) return true;
    const hay = item.kind === 'community'
      ? [item.c.name, item.c.work, item.c.desc, item.c.host.name]
      : [item.u.name, item.c ? item.c.name : '', item.c ? item.c.work : ''];
    return hay.join(' ').toLowerCase().includes(q);
  }

  function communityTile(c) {
    // 参加済みのコミュニティはこの画面に表示されないため、常に「参加する」のみ
    return '<section class="join-card" data-community-id="' + c.id + '">' +
        '<div class="join-card-head">' + Kakko.iconHTML(c) +
          '<div class="join-card-body">' +
            '<p class="community-card-title">' + Kakko.esc(c.name) + ' <span class="badge badge-open">オープン</span></p>' +
            '<p class="community-card-meta">『' + Kakko.esc(c.work) + '』 ・ ' + Kakko.memberText(c) + ' ・ ホスト ' + Kakko.esc(c.host.name) + ' ・ ' + Kakko.dateText(c.created) + ' 作成</p>' +
          '</div>' +
        '</div>' +
        '<p class="join-card-desc">' + Kakko.linkify(c.desc) + '</p>' +
        '<div class="join-actions">' +
          '<a class="detail-btn" href="community-detail.html?c=' + encodeURIComponent(c.id) + '&from=join">コミュニティ詳細</a>' +
          '<button class="join-btn" type="button" data-join="' + c.id + '">参加する</button>' +
        '</div>' +
      '</section>';
  }
  function userTile(u, c) {
    return '<article class="result-user"' + (c ? ' data-community-id="' + c.id + '"' : '') + '>' +
        '<div class="avatar ' + u.av + '">' + Kakko.esc(u.ini) + '</div>' +
        '<div class="result-user-body">' +
          '<p class="name">' + Kakko.esc(u.name) + '</p>' +
          '<p class="result-user-meta">' + (c ? Kakko.esc(c.name) + ' のホスト' : '') + ' ・ ' + Kakko.dateText(u.created) + ' 登録</p>' +
        '</div>' +
        (c ? '<a class="detail-btn" href="community-detail.html?c=' + encodeURIComponent(c.id) + '&from=join">コミュニティ詳細</a>' : '') +
      '</article>';
  }

  function render() {
    const q = input.value.trim().toLowerCase();
    clearBtn.hidden = q.length === 0;
    let items = collect().filter(it => matches(it, q));
    // 参加済みのコミュニティは、参加先を探す画面には表示しない
    // ユーザー(ホスト)のタイルは表示しない
    items = items.filter(it => it.kind === 'community' && !Kakko.isJoined(it.c.id));
    items.sort((a, b) => mode === 'oldest' ? a.created - b.created : b.created - a.created);

    resultsEl.innerHTML = items.map(it => it.kind === 'community' ? communityTile(it.c) : userTile(it.u, it.c)).join('');
    countEl.textContent = items.length + '件';
    emptyEl.hidden = items.length > 0;
    countEl.hidden = items.length === 0;
  }

  // ---- 参加(オープンのみ: 押すとすぐ参加) ----
  resultsEl.addEventListener('click', e => {
    const btn = e.target.closest('[data-join]');
    if (!btn) return;
    const c = Kakko.get(btn.dataset.join);
    Kakko.join(c.id);
    render();
    Kakko.showToast('「' + c.name + '」に参加しました');
  });

  // ---- フィルタタブ(最新 / 古い順 / ユーザー / コミュニティ) ----
  function positionIndicator(tab) {
    indicator.style.left = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth + 'px';
  }
  function activateTab(tab) {
    tabs.forEach(t => {
      t.classList.toggle('active', t === tab);
      t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
    });
    mode = tab.dataset.mode;
    positionIndicator(tab);
    render();
  }
  tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab)));
  window.addEventListener('resize', () => positionIndicator(document.querySelector('.tab.active')));

  input.addEventListener('input', render);
  clearBtn.addEventListener('click', () => { input.value = ''; input.focus(); render(); });

  // 「ユーザー」名などで直接開けるよう ?q= を受け付ける
  const initialQ = new URLSearchParams(window.location.search).get('q');
  if (initialQ) input.value = initialQ;

  positionIndicator(document.querySelector('.tab.active'));
  render();

}
window.initCommunityJoin = initCommunityJoin;
