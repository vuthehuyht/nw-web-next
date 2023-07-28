import { useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Box } from "@material-ui/core";

import { switchConfirmModal } from "@providers/GeneralProvider/slice";

const ConfirmModal = () => {
  const dispatch = useDispatch();
  const { pathname } = useRouter();
  const confirmModal = useSelector((state) => state.general.confirmModal);
  const { visible, data = {} } = confirmModal;
  const {
    className = "",
    title,
    message,
    onConfirm,
    onCancel,
    cancelText = "キャンセル",
    confirmText = "OK",
    hideCancelBtn = false,
  } = data;

  const handleConfirm = () => {
    dispatch(switchConfirmModal({ visible: false }));
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  };

  const handleCancel = (e, reason) => {
    if (reason !== "backdropClick") {
      dispatch(switchConfirmModal({ visible: false }));
      if (typeof onCancel === "function") {
        onCancel();
      }
    }
  };

  useEffect(() => {
    dispatch(switchConfirmModal({ visible: false }));
  }, [dispatch, pathname]);

  return (
    <Dialog
      className={`confirm-modal-container ${className}`}
      onClose={(e, reason) => handleCancel(e, reason)}
      aria-labelledby="confirm-modal"
      TransitionProps={{
        onExited: () => dispatch(switchConfirmModal({ data: {} })),
      }}
      open={visible}
    >
      <MuiDialogTitle disableTypography>
        <Typography variant="subtitle1">{title}</Typography>
      </MuiDialogTitle>
      <DialogContent>
        <div className="content-modal">{message}</div>
      </DialogContent>
      <MuiDialogActions>
        <Box
          display="flex"
          justifyContent="center"
          maxWidth="360px"
          width="100%"
        >
          {!hideCancelBtn && (
            <Button
              variant="outlined"
              className="cancel-btn"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            className="confirm-btn"
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Box>
      </MuiDialogActions>
    </Dialog>
  );
};

ConfirmModal.prototype = {
  className: PropTypes.string,
  handleClose: PropTypes.func,
  title: PropTypes.string,
  srcBanner: PropTypes.string,
  children: PropTypes.any,
  open: PropTypes.bool,
};

export default ConfirmModal;
