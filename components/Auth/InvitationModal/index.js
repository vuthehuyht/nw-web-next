import { Formik, Form } from "formik";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { object, string } from "yup";
import Modal from "@components/Modal";
import Input from "components/Form/TextField";
import { REGEX, VALIDATION_TEXT } from "utils/constants";

const validationSchema = object().shape({
  inputInvitationCode: string()
    .test("isValidLength", VALIDATION_TEXT.INVALID_COUPON_LENGTH, (value) => {
      const trimmedValue = value?.trim();
      if (trimmedValue && trimmedValue.length < 6) {
        return false;
      }
      return true;
    })
    .test("isValidCode", VALIDATION_TEXT.INVALID_INVITATION_COUPON, (value) => {
      const trimmedValue = value?.trim();
      if (trimmedValue && !REGEX.INVITATION_COUPON.test(trimmedValue)) {
        return false;
      }
      return true;
    }),
});

const InvitationModal = ({ loading, onSubmit, onClose, open }) => {
  if (open) {
    return (
      <Modal
        className="invitation-code-modal"
        title="招待コードはお持ちですか?"
        open={open}
        handleClose={onClose}
        disableBackdropClick
        maxWidth="md"
        hideCloseButton
      >
        <Typography align="center">
          招待コードをお持ちの方は入力してください。 お持ち
          でない場合は、そのまま完了をタップしてください。
        </Typography>
        <Formik
          initialValues={{ inputInvitationCode: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isValid, handleSubmit, dirty }) => (
            <Form>
              <Box marginTop="32px">
                <Input
                  lgGrid={[4, 8]}
                  name="inputInvitationCode"
                  variant="filled"
                  type="text"
                  label="Invitation code"
                  inputProps={{
                    style: {
                      textTransform: "uppercase",
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                marginTop="32px"
                className="btn-container"
              >
                <Button
                  disabled={loading || (!isValid && dirty)}
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  loading={loading}
                >
                  {loading ? (
                    <CircularProgress color="primary" size={24} />
                  ) : (
                    "完了"
                  )}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
  return null;
};

export default InvitationModal;
