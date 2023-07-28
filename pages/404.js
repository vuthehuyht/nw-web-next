import Link from "next/link";

export default function Custom404() {
  return (
    <div className="error-page">
      <div className="error-inner">
        <h1 className="status-code">
          <img src="/assets/images/404.svg" alt="404" />
        </h1>
        <h2 className="title">ページが見つかりません</h2>
        <p className="sub-title">
          お探しのページは一時的にアクセスできない状態か、移動または削除された可能性があります。
        </p>
        <p className="content">
          <Link href="/">
            <a className="back-btn">HOME画面へ戻る</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
