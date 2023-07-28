import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import _get from "lodash/get";
import { isMobile } from "react-device-detect";
import _isEmpty from "lodash/isEmpty";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useRouter } from "next/router";
import MUILink from "@material-ui/core/Link";
import { useSpecificPageViewEvent } from "hooks";
import { InstallationPopupWrapper } from "@components/InstallationPopup";
import Modal from "@components/Modal";
import { switchAuthentcateDialog } from "@providers/AuthProvider/slice";

const AuthenticateModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  // const { trackEvent } = useSpecificPageViewEvent();
  const authenticateVisible = useSelector(
    (state) => state.auth.authenticateVisible
  );
  const redirect = _get(authenticateVisible, "redirect.pathname");
  const query = _get(authenticateVisible, "redirect.query", {});
  const handleClose = () => {
    dispatch(switchAuthentcateDialog(false));
  };

  const handleRedirect = (url) => {
    handleClose();
    router.push({ pathname: url, query: { ...query, redirect } });
  };

  const renderOpenStoreLink = () => (
    <MUILink
      target="_blank"
      rel="noopener noreferrer"
      color="secondary"
      href={process.env.DOWNLOAD_APP_URL}
    >
      アプリから登録
    </MUILink>
  );

  if (!authenticateVisible) {
    return null;
  }
  return (
    <Modal
      className="authenticate-dialog"
      srcBanner="/assets/images/heading-banner-download.webp"
      open={
        typeof authenticateVisible === "object"
          ? !_isEmpty(authenticateVisible)
          : authenticateVisible
      }
      handleClose={handleClose}
      disableBackdropClick
    >
      <div className="authenticate-section">
        <img src="/assets/images/register-note.png" alt="" />
        <Button
          className="btn-round"
          variant="contained"
          color="secondary"
          onClick={() => handleRedirect("/register")}
        >
          お客様としてはじめる
        </Button>
        <Typography variant="body2" color="secondary">
          ネイリストの方は
          {isMobile ? (
            renderOpenStoreLink()
          ) : (
            <InstallationPopupWrapper>
              {renderOpenStoreLink()}
            </InstallationPopupWrapper>
          )}
        </Typography>
        <Typography variant="body2" color="primary" className="login-text">
          すでにアカウントをお持ちの方は
          <Link
            href={{ pathname: "/login", query: { ...query, redirect } }}
            passHref
          >
            <MUILink onClick={handleClose}>ログイン</MUILink>
          </Link>
        </Typography>
      </div>
    </Modal>
  );
};

export default AuthenticateModal;
