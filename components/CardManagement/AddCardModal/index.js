import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Modal from "@components/Modal";
import { CARD_IMAGES } from "@utils/constants";
import AddCardForm from "./AddCardForm";

const AddCardModal = ({ onSubmit, open, onClose }) => {
  const initialValues = {
    // eslint-disable-next-line prettier/prettier
    "cardNumber": "",
    "cc-exp-month": "",
    "cc-exp-year": "",
    "cc-csc": "",
  };

  return (
    <Modal
      className="add-card-modal"
      title="クレジットカード登録"
      open={open}
      handleClose={onClose}
      maxWidth="md"
    >
      <>
        <Box
          display="flex"
          justifyContent="center"
          className="card-type-container"
        >
          {Object.keys(CARD_IMAGES).map((key) => (
            <img
              className="card-image"
              src={CARD_IMAGES[key]}
              key={key}
              alt={key}
              layout="fill"
            />
          ))}
        </Box>
        <AddCardForm initialValues={initialValues} onSubmit={onSubmit} />
      </>
    </Modal>
  );
};

AddCardModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AddCardModal;
