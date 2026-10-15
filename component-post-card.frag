<!--
  component-post-card.frag
  Representative example of a single post card. In the running app most post
  cards are rendered at runtime by Kakko.postHTML() (see community-common.js),
  which builds this exact markup shape for each post in a community's/feed's
  data. This fragment documents the shape and can also be fetched + injected
  directly by pages that just need one static example post.
-->
<article class="post">
  <div class="post-head">
    <div class="avatar a1">ゆ</div>
    <div class="post-meta">
      <span class="name">ゆき</span>
      <span class="community">灰と星屑 感想部</span>
    </div>
    <time class="time">10分前</time>
  </div>
  <p class="body">積読解消するぞの意気込みで開いた『夜想曲のリベルタ』1巻、もう心を持っていかれた…</p>
  <div class="engage">
    <button class="engage-btn like" aria-label="いいね">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 13.8s-5.6-3.4-5.6-7.3a3.1 3.1 0 0 1 5.6-1.9 3.1 3.1 0 0 1 5.6 1.9c0 3.9-5.6 7.3-5.6 7.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
      18
    </button>
    <button class="engage-btn" aria-label="コメント">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2.5 3.5h11v7.2h-6l-3 2.6v-2.6h-2V3.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
      2
    </button>
  </div>
</article>
