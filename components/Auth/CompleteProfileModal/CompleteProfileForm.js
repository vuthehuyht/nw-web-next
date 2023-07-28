import { useRef } from "react";
import { Formik, Form } from "formik";
import _get from "lodash/get";
import PropTypes from "prop-types";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { object, string } from "yup";
import Input from "components/Form/TextField";
import AvatarUpload from "components/Form/AvatarUpload";
import { REGEX, VALIDATION_TEXT, IMAGE_TYPE } from "utils/constants";
import { useSpecificPageViewEvent } from "hooks";

const validationSchema = object().shape({
  avatar: object().nullable(),
  username: string()
    .trim()
    .max(30)
    .matches(REGEX.USERNAME, VALIDATION_TEXT.USERNAME_FORMAT)
    .required(VALIDATION_TEXT.REQUIRED),
});

const CompleteProfileForm = ({ initialValues, onSubmit, loading, userId }) => {
  const formikRef = useRef(null);
  const { trackEvent } = useSpecificPageViewEvent();

  const handleFormSubmit = (values) => {
    trackEvent({ event: "signup_profile_save" });
    const dirty = _get(formikRef, "current.dirty");
    onSubmit(values, dirty);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formikRef}
      enableReinitialize
      validateOnMount
      onSubmit={handleFormSubmit}
    >
      {({ isValid, handleSubmit }) => (
        <Form>
          <Box display="flex" justifyContent="center">
            <AvatarUpload
              name="avatar"
              userId={userId}
              uploadType={IMAGE_TYPE.AVATAR}
            />
          </Box>
          <Box marginTop="32px">
            <Input
              name="username"
              variant="filled"
              type="text"
              label="ユーザーネーム"
              inputProps={{
                maxLength: 30,
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
              disabled={loading || !isValid}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              {loading ? (
                <CircularProgress color="primary" size={24} />
              ) : (
                "保存"
              )}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

CompleteProfileForm.propTypes = {
  initialValues: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
  userId: PropTypes.string,
  loading: PropTypes.bool.isRequired,
};

export default CompleteProfileForm;
