import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import _find from "lodash/find";
import { isAndroid } from "react-device-detect";
import QRCode from "qrcode.react";
import Button from "@material-ui/core/Button";
import { DOWNLOADS } from "utils/constants";
import Modal from "@components/Modal";
import { useSpecificPageViewEvent } from "hooks";

const BookButton = ({
  linkData,
  className,
  children,
  onReserve,
  isDirectBooking,
  isAvailableBooking = true,
}) => {
  const { query } = useRouter();
  const { trackEvent } = useSpecificPageViewEvent();
  const [openFindNailieDialog, setOpenFindNailieDialog] = useState(false);
  const [isMobileAndroid, setIsMobileAndroid] = useState(false);
  const typeDevice = isMobileAndroid ? "android" : "iOS";
  const btnDownload = _find(DOWNLOADS, ["type", typeDevice]);
  const directBookingText = isDirectBooking
    ? "今すぐ予約"
    : "予約をリクエストする";
  const bookingBtnText = isAvailableBooking ? directBookingText : "空きなし";

  useEffect(() => {
    setIsMobileAndroid(isAndroid);
  }, []);

  const handleClickBookBtn = () => {
    if (typeof onReserve === "function") {
      trackEvent({ event: "start_request", nailist_id: query.nailieId });
      onReserve();
    } else {
      setOpenFindNailieDialog(true);
    }
  };

  return (
    <div className={`book-wrapper ${className || ""}`}>
      <Button
        variant="contained"
        color="secondary"
        className="book-btn"
        onClick={handleClickBookBtn}
        disabled={!isAvailableBooking}
      >
        {children || bookingBtnText}
      </Button>

      <Modal
        className="find-nailie-dialog"
        srcBanner="/assets/images/heading-banner-download.webp"
        open={openFindNailieDialog}
        handleClose={setOpenFindNailieDialog}
      >
        <div className="heading">
          <div className="heading-logo">
            <i className="icon-n" />
          </div>
          <div className="heading-content">
            <h2>Nailie (ネイリー) - ネイル予約</h2>
            <h3>アプリで予約に進む</h3>
          </div>
        </div>
        <div className="btn-download-app">
          <a
            href={linkData || btnDownload.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            アプリを開く
          </a>
        </div>
        <div className="qr">
          <QRCode value={linkData || ""} size={160} />
        </div>
      </Modal>
    </div>
  );
};

BookButton.propTypes = {
  linkData: PropTypes.any,
  className: PropTypes.string,
  children: PropTypes.element,
  onReserve: PropTypes.func,
  isAvailableBooking: PropTypes.bool,
  isDirectBooking: PropTypes.bool,
};

export default BookButton;
