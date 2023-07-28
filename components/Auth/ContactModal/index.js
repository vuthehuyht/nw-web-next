import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Modal from "@components/Modal";
import ContactSupportForm from "./ContactSupportForm";

const ContactSupportModal = ({ onSubmit, open, loading, onClose }) => {
  const initialValues = {
    deviceInfo: "",
    email: "",
    phone: "",
    question: "",
  };

  return (
    <Modal
      className="contact-support-modal"
      title="お問い合わせフォーム"
      open={open}
      handleClose={onClose}
      maxWidth="md"
    >
      <>
        <Typography variant="body2" className="helper-text title">
          {
            "お問い合わせ内容を入力してください。ご入力頂いたアドレスに返答させていただきます。\n\n"
          }
        </Typography>
        <Typography variant="body2" className="helper-text">
          {`※「認証メールが届かない」、「認証メールは届いたが、認証ボタンがタップできない」
          「SMS認証コードが届かない」など詳細を入力してください。.`}
        </Typography>
        <ContactSupportForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          loading={loading}
          onClose={onClose}
        />
      </>
    </Modal>
  );
};

ContactSupportModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ContactSupportModal;
