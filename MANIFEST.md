# kakko. デモ ファイル構成 (全て同一階層)

## Components (HTML断片 / fetchで読み込み)
- `component-community-tile.frag`
- `component-composer.frag`
- `component-mute-panel.frag`
- `component-post-card.frag`
- `component-reply-modal.frag`
- `component-sidenav.frag`
- `component-toast.frag`
- `component-work-picker.frag`

- `component-series-modal.frag` : シリーズ作成/更新ポップアップ(共用)
- `component-series-works-modal.frag` : シリーズ内作品管理ポップアップ

## CSS (common.css + ページ別1本)
- `common.css` : 変数・リセット・サイドナビ・ボタン・フォーム・投稿カード・コンポーザー等の共通スタイル
- `community-create.css` : community-create.html 固有のスタイル
- `community-detail.css` : community-detail.html 固有のスタイル
- `community-join.css` : community-join.html 固有のスタイル
- `community-list.css` : community-list.html 固有のスタイル
- `community.css` : community.html 固有のスタイル
- `index.css` : index.html 固有のスタイル
- `notifications.css` : notifications.html 固有のスタイル
- `profile.css` : profile.html 固有のスタイル
- `search.css` : search.html 固有のスタイル
- `series-view.css` : series-view.html 固有のスタイル
- `settings.css` : settings.html 固有のスタイル
- `user-profile.css` : user-profile.html 固有のスタイル
- `works-list.css` : works-list.html 固有のスタイル
- `works-upload.css` : works-upload.html 固有のスタイル
- `works-view.css` : works-view.html 固有のスタイル
- `works.css` : works.html 固有のスタイル

- `auth.css` : auth.html / login.html / register.html 共用のページ固有スタイル

## JavaScript
- `loader.js` : KakkoLoader (コンポーネントfetch読み込み・ナビ強調)
- `community-common.js` : デモデータ・状態管理・アイコン・ホバーカード・ミュート共有ロジック
- `composer.js` : 投稿コンポーザー(添付/引用/作品ピッカー/投稿)
- `post-actions.js` : いいね等の投稿操作
- `post-replies.js` : 投稿内の返信の表示/非表示トグル(委譲)
- `work-catalog.js` : 引用・関連作品で共通の作品カタログ
- `related-works.js` : 作品投稿の関連作品(引用パレットで複数追加)
- `mute-panel.js` : ミュートワードパネル
- `reply-modal.js` : 返信モーダル
- `index.js` : index.html 固有の処理
- `community.js` : community.html 固有の処理
- `community-list.js` : community-list.html 固有の処理
- `community-detail.js` : community-detail.html 固有の処理
- `community-create.js` : community-create.html 固有の処理
- `community-join.js` : community-join.html 固有の処理
- `notifications.js` : notifications.html 固有の処理
- `profile.js` : profile.html 固有の処理
- `user-profile.js` : user-profile.html 固有の処理
- `search.js` : search.html 固有の処理
- `settings.js` : settings.html 固有の処理
- `series-view.js` : series-view.html 固有の処理
- `works.js` : works.html 固有の処理
- `works-list.js` : works-list.html 固有の処理
- `works-upload.js` : works-upload.html 固有の処理
- `works-view.js` : works-view.html 固有の処理

- `series-store.js` : シリーズ・自分の作品のデモデータ+保存(localStorage `kakko.series.v1`)
- `series-modal.js` : SeriesModal.open() シリーズ作成/更新
- `series-works-modal.js` : SeriesWorksModal.open() シリーズ内作品管理

- `auth-form.js` : ログイン/新規登録フォーム処理(見た目のみのデモ認証)

## Pages
- `community-create.html`
- `community-detail.html`
- `community-join.html`
- `community-list.html`
- `community.html`
- `index.html`
- `notifications.html`
- `profile.html`
- `search.html`
- `series-view.html`
- `settings.html`
- `user-profile.html`
- `works-list.html`
- `works-upload.html`
- `works-view.html`
- `works.html`
- `components-bundle.js` : component-*.html の自動生成まとめ(file://直開き用フォールバック。`build-components.py` で再生成)
- `auth.html` : ログイン/新規登録の選択画面
- `login.html` : ログイン画面
- `register.html` : 新規登録画面
