import Link from "next/link";
import Router, { withRouter } from "next/router";
import { useSelector } from "react-redux";
import NProgress from "nprogress";
import { useZendeskLink } from "hooks";

const FooterBar = (props) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [FAQ_SUPPORT_NAILIE_URL, guideLinkHandler] =
    useZendeskLink.useGuideLink(currentUser);
  const [CONTACT_PAGE_NAILIE_URL, contactLinkHandler] =
    useZendeskLink.useContactLink(currentUser);

  const progress = () => {
    // 进度条
    Router.onRouteChangeStart = () => NProgress.start();
    Router.onRouteChangeComplete = () => {
      // this.props.hideDispatch();
      NProgress.done();
    };
    Router.onRouteChangeError = () => NProgress.done();
  };

  progress();
  const { pathname } = props.router;
  // const blogPath = [
  //   '/faq',
  //   '/terms',
  //   '/contact',
  //   '/company',
  //   '/privacy-policies',
  //   '/about',
  // ];

  return (
    <nav className="footer-nav">
      <ul className="footer-nav-menu">
        <li>
          <Link href={FAQ_SUPPORT_NAILIE_URL}>
            <a target="_blank" onClick={guideLinkHandler}>
              ガイド
            </a>
          </Link>
          {/* <Link href="https://support.nailie.jp/hc/ja">
            <a target="_blank">ガイド</a>
          </Link> */}
        </li>
        <li>
          <Link href={`${process.env.DOMAIN_NAME}/nailist_lp`}>
            <a target="_blank">ネイリストの方はこちら</a>
          </Link>
        </li>
        <li>
          <Link href="/terms">
            <a className={pathname === "/terms" ? "link-active" : ""}>
              利用規約
            </a>
          </Link>
        </li>
        <li>
          <Link href={CONTACT_PAGE_NAILIE_URL}>
            <a target="_blank" onClick={contactLinkHandler}>
              お問い合わせ
            </a>
          </Link>
          {/* <Link href="/contact">
            <a className={pathname === "/contact" ? "link-active" : ""}>
              お問い合わせ
            </a>
          </Link> */}
        </li>
        <li>
          <Link href="/company">
            <a className={pathname === "/company" ? "link-active" : ""}>
              特定商取引法に基づく表記
            </a>
          </Link>
        </li>
        <li>
          <Link href="/privacy-policies">
            <a
              className={pathname === "/privacy-policies" ? "link-active" : ""}
            >
              プライバシーポリシー
            </a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a className={pathname === "/about" ? "link-active" : ""}>
              会社概要
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default withRouter(FooterBar);
