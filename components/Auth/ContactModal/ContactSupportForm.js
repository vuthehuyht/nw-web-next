import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { object, string } from "yup";
import Input from "components/Form/TextField";
import { VALIDATION_TEXT, REGEX } from "utils/constants";

const validationSchema = object().shape({
  phone: string()
    .required(VALIDATION_TEXT.REQUIRED)
    .min(9, VALIDATION_TEXT.PHONE_FORMAT)
    .matches(REGEX.PHONE, VALIDATION_TEXT.PHONE_FORMAT),
  email: string()
    .trim()
    .required(VALIDATION_TEXT.REQUIRED)
    .matches(REGEX.EMAIL, VALIDATION_TEXT.EMAIL_FORMAT),
  deviceInfo: string().trim(),
  question: string().required(VALIDATION_TEXT.REQUIRED),
});

const ContactSupportForm = ({ initialValues, onSubmit, loading }) => (
  <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    enableReinitialize
    validateOnMount
    onSubmit={onSubmit}
  >
    {({ isValid, handleSubmit, dirty }) => (
      <Form>
        <Box marginTop="32px">
          <Input
            name="phone"
            variant="filled"
            type="text"
            label="ご登録の電話番号"
            required
            inputProps={{
              maxLength: 15,
            }}
          />
          <Input
            name="email"
            variant="filled"
            type="text"
            required
            label="メールアドレス"
          />
          <Input
            name="deviceInfo"
            variant="filled"
            type="text"
            label="ご利用のメールアプリ"
            placeholder="iPhoneのメールアプリ、Gmailなど"
          />
          <Input
            name="question"
            variant="filled"
            type="text"
            label="お問い合わせ内容"
            required
            multiline
            maxRows={4}
            minRows={4}
            placeholder="「認証メールが届かない」、「認証メールは届いたが、認証ボタンがタップできない」「SMS認証コードが届かない」など詳細を入力してください。"
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          marginTop="32px"
          className="btn-container"
        >
          <Button
            disabled={loading || !isValid || !dirty}
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress color="primary" size={24} /> : "保存"}
          </Button>
        </Box>
      </Form>
    )}
  </Formik>
);

ContactSupportForm.propTypes = {
  initialValues: PropTypes.any.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ContactSupportForm;
