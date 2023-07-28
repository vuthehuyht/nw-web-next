import PropTypes from "prop-types";
import Modal from "@components/Modal";
import UserInformationForm from "./UserInformationForm";

const UserInformationModal = ({ onSubmit, open, onClose, isValid }) => {
  const handleSubmit = (values) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      className="user-information-modal"
      title="お客様情報"
      open={open}
      handleClose={onClose}
      maxWidth="md"
    >
      <UserInformationForm
        onSubmit={handleSubmit}
        showSubmitBtn
        isValid={isValid}
      />
    </Modal>
  );
};

UserInformationModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  isValid: PropTypes.bool,
};

export default UserInformationModal;
