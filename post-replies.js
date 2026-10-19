/*
 * post-replies.js — 投稿カード内の「返信を表示/隠す」トグル。
 * document への委譲なので、静的な投稿・Kakko.postHTML() で描画した投稿・
 * Kakko.appendReply() で後から追加された返信ブロックのいずれでも動く。
 */
function initPostReplies() {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.replies-toggle');
    if (!btn) return;
    const list = btn.parentElement.querySelector('.replies-list');
    const label = btn.querySelector('.replies-toggle-label');
    if (!list || !label) return;
    const count = list.querySelectorAll('.reply-item').length;
    const open = list.hidden;
    list.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.classList.toggle('open', open);
    label.textContent = open ? '返信を隠す' : (count + '件の返信を表示');
  });
}
