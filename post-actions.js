/*
 * post-actions.js — like button + spoiler veil behaviour on post cards.
 * Feature-scoped, used by index.html, community.html, community-detail.html,
 * community-list.html (anywhere component-post-card.frag-shaped posts show
 * up, including ones injected later by Kakko.postHTML()).
 *
 * Uses event delegation on `document` so it keeps working for posts that are
 * rendered into the feed after this script runs (e.g. community tabs built
 * from JS, or future posts appended by the composer).
 */
function initPostActions() {
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.veil-trigger');
    if (trigger) {
      const post = trigger.closest('.post');
      post.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      return;
    }

    const hideAgain = e.target.closest('.hide-again');
    if (hideAgain) {
      const post = hideAgain.closest('.post');
      post.classList.remove('is-open');
      const t = post.querySelector('.veil-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
      return;
    }

    const like = e.target.closest('.engage-btn.like');
    if (like) {
      const countEl = like.childNodes[like.childNodes.length - 1];
      const current = parseInt(like.textContent.trim(), 10) || 0;
      const liked = like.classList.toggle('active');
      countEl.textContent = ' ' + (liked ? current + 1 : current - 1);
    }
  });
}
window.initPostActions = initPostActions;
