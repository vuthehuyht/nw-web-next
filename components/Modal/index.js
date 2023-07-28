import PropTypes from "prop-types";
import Image from "next/image";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const DialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      <Typography variant="h3">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={(e) => {
            e.preventDefault();
            onClose(e);
          }}
        >
          <i className="icon-close" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const DialogClose = (props) => {
  const { onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography {...other}>
      {onClose ? (
        <IconButton aria-label="close" onClick={onClose}>
          <i className="icon-close" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
};

const Modal = ({
  className,
  handleClose,
  title,
  srcBanner,
  open,
  children,
  maxWidth,
  disableBackdropClick = false,
  preventDefault,
  hideCloseButton = false,
}) => (
  <Dialog
    className={`modal ${className || ""}`}
    onClose={(e, reason) => {
      e.stopPropagation();
      if (
        !["backdropClick", "escapeKeyDown"].includes(reason) ||
        !disableBackdropClick
      ) {
        handleClose(e, reason);
      }
    }}
    onClick={(e) => {
      if (preventDefault) {
        e.preventDefault();
      }
    }}
    aria-labelledby="dialog-title"
    open={open}
    maxWidth={maxWidth || "sm"}
  >
    {title && !srcBanner && (
      <DialogTitle
        id="dialog-title"
        onClose={hideCloseButton ? null : () => handleClose(false)}
      >
        {title}
      </DialogTitle>
    )}
    {!title && srcBanner && (
      <DialogTitle
        id="dialog-title"
        onClose={hideCloseButton ? null : () => handleClose(false)}
      >
        <Image
          alt="Nailie"
          src={srcBanner}
          layout="responsive"
          width={1}
          height={205 / 444}
          priority
        />
      </DialogTitle>
    )}
    {!title && !srcBanner && (
      <DialogClose
        id="dialog-close"
        onClose={hideCloseButton ? null : () => handleClose(false)}
      />
    )}
    <DialogContent>
      <div className="content-modal">{children}</div>
    </DialogContent>
    <MuiDialogActions />
  </Dialog>
);

Modal.prototype = {
  className: PropTypes.string,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  srcBanner: PropTypes.string,
  children: PropTypes.any,
  open: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  preventDefault: PropTypes.bool,
};

export default Modal;
