/*
 * auth-form.js — login.html / register.html 共用のフォーム処理(デモ)
 * 見た目のみの認証: 空欄チェックだけ行い、入力内容は保存・送信しない。成功時も画面遷移しない。
 */
function initAuthForm() {
  var form = document.getElementById('auth-form');
  if (!form) return;
  var mode = form.getAttribute('data-mode'); // 'login' | 'register'
  var fields = [
    { input: document.getElementById('auth-username'), error: document.getElementById('auth-username-error'), msg: 'ユーザー名を入力してください' },
    { input: document.getElementById('auth-password'), error: document.getElementById('auth-password-error'), msg: 'パスワードを入力してください' }
  ];
  var status = document.getElementById('auth-status');

  function setError(f, text) {
    f.error.textContent = text || '';
    f.input.classList.toggle('invalid', !!text);
    f.input.setAttribute('aria-invalid', text ? 'true' : 'false');
  }

  fields.forEach(function (f) {
    f.input.addEventListener('input', function () { setError(f, ''); status.classList.remove('show'); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    fields.forEach(function (f) {
      var empty = f.input.value.trim().length === 0;
      setError(f, empty ? f.msg : '');
      if (empty && !firstInvalid) firstInvalid = f.input;
    });
    if (firstInvalid) { firstInvalid.focus(); status.classList.remove('show'); return; }

    var text = mode === 'register' ? '新規登録しました(デモ)' : 'ログインしました(デモ)';
    status.textContent = text;
    status.classList.add('show');
  });
}
window.initAuthForm = initAuthForm;
