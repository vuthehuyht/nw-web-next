import { withRouter } from "next/router";
import Container from "@material-ui/core/Container";
import Link from "next/link";
import PropTypes from "prop-types";
import SocialMedia from "@components/SocialMedia";
import { useWebCookie } from "hooks";
import DropdownMenu from "./DropdownMenu";

const MainMenu = (props) => {
  const { hiddenHeaderMenu, onLogout, onShowAuthDialog, userName, userAvatar } =
    props;
  const { webCookie } = useWebCookie();

  return (
    <Container className="main-menu">
      <Link href="/">
        <a className="home-link">
          <img src="/assets/images/logo_black.svg" alt="Nailie" />
        </a>
      </Link>
      {/* <ul>
        <li>
          <Link activeClassName="link-active" href="/">ホーム</Link>
        </li>
         <li>
          <Link activeClassName="link-active" href="/our-manicurist">
            Our Manicurist
          </Link>
        </li>
        <li>
          <Link activeClassName="link-active" href="/campaigns">
            Campaigns
          </Link>
        </li>
        <li>
          <Link activeClassName="link-active" href="/our-application">
            Our application
          </Link>
        </li> 
        <li>
          <Link href="https://nailie.jp/nailist_lp/">
            ネイリストの方はこちら
          </Link>
        </li>
      </ul> */}
      {!hiddenHeaderMenu && (
        <div className="right-block">
          <div className="menu">
            <Link
              href={`${process.env.DOMAIN_NAME}/nailist_lp`}
              target="_blank"
            >
              <a target="_blank" className="nailie-link">
                ネイリストの方はこちら
              </a>
            </Link>
          </div>
          <SocialMedia />
          <div className="authenticate-wrapper">
            {!webCookie ? (
              <a href="#" onClick={onShowAuthDialog} className="nailie-link">
                会員登録・ログイン
              </a>
            ) : (
              <DropdownMenu
                userName={userName}
                userAvatar={userAvatar}
                onLogout={onLogout}
              />
            )}
          </div>
        </div>
      )}
    </Container>
  );
};

MainMenu.propTypes = {
  hiddenHeaderMenu: PropTypes.bool,
  onShowAuthDialog: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
};

export default withRouter(MainMenu);
