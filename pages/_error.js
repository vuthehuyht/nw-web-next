import Link from "next/link";

function Error({ statusCode }) {
  return (
    <div className="error-page">
      <div className="error-inner">
        <h1 className="status-code">
          <img src="/assets/images/500.svg" alt={statusCode || "On CLient"} />
        </h1>
        <h2 className="title">ページは表示できません。</h2>
        <p className="sub-title">
          お探しのページは、システムエラーの為、表示でませんでした。時間を置いてもう一度お試しください。
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

Error.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
