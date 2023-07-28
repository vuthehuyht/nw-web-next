import { useSelector } from "react-redux";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";

import Modal from "@components/Modal";
import CompleteProfileForm from "./CompleteProfileForm";

const CompleteProfileModal = ({ loading, onSubmit, onClose, open }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userId = _get(currentUser, "objectId");
  const userAvatar = _get(currentUser, "avatar");

  const initialValues = {
    avatar: _isEmpty(userAvatar) ? null : { url: userAvatar },
    username: _get(currentUser, "username", ""),
  };

  return (
    <Modal
      className="complete-profile-modal"
      title="プロフィール画像を設定しましょう"
      open={open}
      handleClose={onClose}
      maxWidth="md"
    >
      <CompleteProfileForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        loading={loading}
        userId={userId}
      />
    </Modal>
  );
};

CompleteProfileModal.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CompleteProfileModal;
