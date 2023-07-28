import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { switchAuthentcateDialog, logOut } from "@providers/AuthProvider/slice";
import { FOOTER_TEXT } from "@utils/constants";
import MainMobileMenu from "@components/MainMenu/MainMobileMenu";
import { useWebCookie } from "hooks";
import AuthenticateModal from "@components/Auth/AuthenticateModal";
import FloatingMessage from "containers/Booking/FloatingMessage";
import ScrollArrow from "../ScrollArrow";
import SocialMedia from "../SocialMedia";
import FooterBar from "./FooterBar";

const MainMenu = dynamic(() => import("@components/MainMenu"));

const CONTENT_STICKY_HEIGHT = 145;

const FrontLayout = (props) => {
  const { replace, pathname } = useRouter();
  const [sticky, setSticky] = useState(false);
  const { hiddenFooter, hiddenHeader, hiddenHeaderMenu } = props;
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const { removeWebCookie } = useWebCookie();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userAvatar = _get(currentUser, "avatar");
  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  const checkStickyHeader = useCallback(() => {
    if (!sticky && window && window.pageYOffset > CONTENT_STICKY_HEIGHT) {
      setSticky(true);
    } else if (
      sticky &&
      window &&
      window.pageYOffset <= CONTENT_STICKY_HEIGHT
    ) {
      setSticky(false);
    }
  }, [sticky]);

  useEffect(() => {
    if (!["/sms-authentication", "/login"].includes(pathname)) {
      window.addEventListener("scroll", checkStickyHeader, { passive: true });
    }
    return () => window.removeEventListener("scroll", checkStickyHeader);
  }, [checkStickyHeader, pathname]);

  const handleLogout = async () => {
    await replace("/");
    dispatch(logOut());
    removeWebCookie({ path: "/" });
  };

  const showAuthDialog = () => {
    dispatch(switchAuthentcateDialog(true));
  };

  return (
    <>
      {!hiddenHeader && (
        <>
          <header
            className={clsx("common-header", { "sticky-header": sticky })}
          >
            {isMobileLayout && (
              <>
                <div className="head-logo">
                  <Link href="/">
                    <a href="">
                      <Image
                        width={84}
                        height={40}
                        src="/assets/images/logo_black.svg"
                        alt="Nailie"
                      />
                    </a>
                  </Link>
                  {!hiddenHeaderMenu && (
                    <MainMobileMenu
                      onLogout={handleLogout}
                      userAvatar={userAvatar}
                    />
                  )}
                </div>
              </>
            )}
            {!isMobileLayout && (
              <MainMenu
                userName={_get(currentUser, "name")}
                userAvatar={userAvatar}
                hiddenHeaderMenu={hiddenHeaderMenu}
                onShowAuthDialog={showAuthDialog}
                onLogout={handleLogout}
              />
            )}
            <AuthenticateModal />
          </header>
        </>
      )}

      <main id="layout-wrapper">{props.children}</main>

      <footer className="common-footer">
        {!hiddenFooter && (
          <>
            <div className="head-logo">
              <Link href="/">
                <a>
                  <img src="/assets/images/logo_black.svg" alt="Nailie" />
                </a>
              </Link>
            </div>
            <SocialMedia />
            <FooterBar />
            <div className="copyright">{FOOTER_TEXT}</div>
          </>
        )}
        <ScrollArrow />
      </footer>
      <FloatingMessage />
    </>
  );
};

FrontLayout.defaultProps = {
  hiddenFooter: false,
  hiddenHeader: false,
  hiddenHeaderMenu: false,
};

FrontLayout.propTypes = {
  hiddenFooter: PropTypes.bool,
  hiddenHeader: PropTypes.bool,
  hiddenHeaderMenu: PropTypes.bool,
};
export default FrontLayout;
