import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import QRCode from "qrcode.react";
import Modal from "@components/Modal";

const InstallationPopup = ({ open, onClose, title, footer }) => (
  <Modal
    className="installation-dialog"
    srcBanner="/assets/images/heading-banner-download.webp"
    open={open}
    handleClose={onClose}
    disableBackdropClick
    preventDefault
  >
    <div className="installation-section">
      {title && (
        <Typography className="title-text">
          <strong>{title}</strong>
        </Typography>
      )}
      <div className="qr-code">
        <QRCode value={process.env.DOWNLOAD_APP_URL} size={143} />
      </div>
      {footer && <Typography className="help-text">{footer}</Typography>}
      <Button
        onClick={(e) => e.stopPropagation()}
        type="link"
        target="_blank"
        rel="noopener noreferrer"
        href={process.env.DOWNLOAD_APP_URL}
        variant="contained"
        color="secondary"
      >
        アプリで開く
      </Button>
    </div>
  </Modal>
);

export default InstallationPopup;
