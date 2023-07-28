import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Modal from "@components/Modal";

const PaymentMethodModal = ({ open, onClose, children }) => (
  <Modal
    className="payment-method-modal"
    title="クレジットカード登録"
    open={open}
    handleClose={onClose}
    maxWidth="md"
  >
    <div>
      {children}
      <Box
        display="flex"
        justifyContent="center"
        marginTop="32px"
        className="btn-container"
      >
        <Button variant="contained" color="secondary" onClick={onClose}>
          OK
        </Button>
      </Box>
    </div>
  </Modal>
);

PaymentMethodModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  open: PropTypes.bool.isRequired,
};

export default PaymentMethodModal;
