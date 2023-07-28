// 421 permission denied",
// 401 EMAIL_NOT_VERIFIED",
// 9016 Phone not exists!",
// 9014 This phone number already used by an other user!",
// 4011 PHONE_NOT_REGISTERED",
// 9006, 137 Invalid time booking
// 9023 Request booking while nailist edit menu
// 4012 INVALID_TOKEN when call checkingVerifyEmail
export const ERROR_MESSAGE = {
  401: "メールアドレスの認証 が完了していません。 再度メールをご確認い ただくかメールの再送 信をお試しください",
  9014: "こちらの電話番号はすでに登録済みです。\nTOPに戻ってログインをお試しください。",
  "User name already exists.": "こちらのユーザーネームは既に存在します",
  137: "こちらの日時は無効です。別の日時を選択してください。",
  9006: "こちらの日時は無効です。別の日時を選択してください。",
  4011: "こちらの電話番号での 該当するアカウントが 確認できませんでし た。",
  9016: (
    <>
      こちらの電話番号に該当する
      <br />
      アカウントが確認できませんでした。
    </>
  ),
  9023: "選択したメーニュが編集されました。もう一度やり直してください。",
  4012: "認証メールの期限が切れたためログインできません。\n認証メールを再度送信してください",
  421: "ログインできません。\nネイリストアカウントへはアプリからログインしてください。",
};
