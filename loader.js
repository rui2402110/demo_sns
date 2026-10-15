/*
 * loader.js — KakkoLoader
 *
 * Tiny runtime component loader shared by every page. Pages fetch a
 * component-xxx.frag fragment and inject its markup into a slot element,
 * then (usually in a .then()) run that component's own init JS.
 *
 * NOTE on where this lives: the task allowed adding this either into
 * community-common.js or a new file — this project keeps it as its own
 * loader.js, loaded by pages right before community-common.js, so the
 * "data/state module" (community-common.js) stays focused on demo data,
 * rendering helpers (postHTML/iconHTML/linkify), mute-word state and the
 * community hover-card (left in community-common.js, per the "pick one and
 * be consistent" instruction — the hover-card logic was already there and
 * is tightly coupled to the data layer, so it was not extracted further).
 */
(function () {
  function load(url, targetSelector) {
    var target = typeof targetSelector === 'string'
      ? document.querySelector(targetSelector)
      : targetSelector;
    if (!target) {
      return Promise.reject(new Error('KakkoLoader: target not found for ' + targetSelector));
    }
    function inject(html) {
      // VS Code の Live Server は .html の応答に自動リロード用スクリプトを差し込む。
      // 断片には </body> が無いため最初の </svg> の中に入り、以降のマークアップが壊れるので除去する。
      html = html.replace(/<!--\s*Code injected by live-server\s*-->\s*<script[\s\S]*?<\/script>\s*/gi, '');
      target.innerHTML = html;
      target.dispatchEvent(new CustomEvent('kakko:loaded', { detail: { url: url } }));
      return target;
    }
    // 通常は fetch。file:// など fetch できない環境では components-bundle.js の内容を使う。
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('KakkoLoader: failed to fetch ' + url + ' (' + r.status + ')');
        return r.text();
      })
      .catch(function (err) {
        var bundle = window.KAKKO_COMPONENTS;
        if (bundle && typeof bundle[url] === 'string') return bundle[url];
        throw err;
      })
      .then(inject);
  }

  // Loads several components in parallel. Returns a Promise of an array of
  // the resolved target elements, in the same order as `items`.
  function loadAll(items) {
    return Promise.all(items.map(function (it) { return load(it.url, it.target); }));
  }

  // Marks the sidenav item matching the current page as active. Pages call
  // this after injecting component-sidenav.frag.
  function markActiveNav(navKey) {
    document.querySelectorAll('.sidenav-nav .nav-item').forEach(function (item) {
      item.classList.toggle('active', item.dataset.nav === navKey);
    });
  }

  window.KakkoLoader = { load: load, loadAll: loadAll, markActiveNav: markActiveNav };
})();
