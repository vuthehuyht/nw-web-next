import { useState } from "react";
import Router, { withRouter } from "next/router";
import { useDispatch } from "react-redux";
import { Button, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import _isEmpty from "lodash/isEmpty";
import NextLink from "next/link";
import { switchAuthentcateDialog } from "@providers/AuthProvider/slice";
import { ROOT_ROUTER } from "@utils/constants";
import ModalBox from "@components/ModalBox";
import SocialMedia from "@components/SocialMedia";
import { useWebCookie } from "hooks";

function goToPage(href) {
  Router.push(href);
  // .then(() => window.scrollTo(0, 0));
}

const MainMobileMenu = (props) => {
  const { onLogout, userAvatar } = props;
  const { pathname } = props.router;
  const [isOpen, setOpen] = useState(false);
  const { webCookie } = useWebCookie();
  const dispatch = useDispatch();
  const avatarSrc = _isEmpty(userAvatar)
    ? "/assets/images/default_avatar.svg"
    : userAvatar;
  const handleMenuClick = (key) => {
    setOpen(false);
    if (key === "auth") {
      if (webCookie) {
        onLogout();
      } else {
        dispatch(switchAuthentcateDialog(true));
      }
    }
  };

  return (
    <div className="main-mobile-menu">
      <ModalBox
        open={isOpen}
        className="menu-popup"
        closeIcon={<span className="icon-close"></span>}
        trigger={
          webCookie ? (
            <Box display="flex" alignItems="center">
              <Avatar alt="user-avatar" src={avatarSrc} />
              <i className="icon-angle-down" />
            </Box>
          ) : (
            <i className="icon-topmenu" />
          )
        }
        key={pathname}
        changeStatus={setOpen}
      >
        <>
          <img className="logo" src="/assets/images/logo_white.svg" />
          <div className="head-cat">
            <Button
              onClick={() => {
                goToPage(ROOT_ROUTER.HOME);
                setOpen(false);
              }}
              className={pathname === ROOT_ROUTER.HOME ? "link-active" : ""}
            >
              ホーム
            </Button>
            {/* <Button
              onClick={() => goToPage(ROOT_ROUTER.OURMANICURIST)}
              className={pathname == ROOT_ROUTER.OURMANICURIST ? 'link-active':''}
            >
              Our Manicurist
            </Button>
            <Button
              onClick={() => goToPage(ROOT_ROUTER.CAMPAIGNS)}
              className={pathname == ROOT_ROUTER.CAMPAIGNS ? 'link-active':''}
            >
              Campaigns
            </Button>
            <Button
              onClick={() => goToPage(ROOT_ROUTER.OURAPPLICATION)}
              className={pathname == ROOT_ROUTER.OURAPPLICATION ? 'link-active':''}
            >
              Our Application
            </Button> */}
            <Button
              target="_blank"
              href={`${process.env.DOMAIN_NAME}/nailist_lp`}
            >
              ネイリストの方はこちら
            </Button>
            {webCookie && (
              <NextLink href="/booking-management" variant="inherit">
                <Button
                  className={
                    pathname === ROOT_ROUTER.BOOKING_MANAGEMENT
                      ? "link-active"
                      : ""
                  }
                >
                  あなたの予約
                </Button>
              </NextLink>
            )}
            <Button onClick={() => handleMenuClick("auth")}>
              {webCookie ? "ログアウト" : "会員登録・ログイン"}
            </Button>
            <div className="social-section">
              <Typography component="h3">SNSのフォローはこちら</Typography>
              <SocialMedia />
            </div>
          </div>
        </>
      </ModalBox>
    </div>
  );
};

export default withRouter(MainMobileMenu);
