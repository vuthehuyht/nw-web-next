import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import { object, string } from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import { Container, Button, CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import _get from "lodash/get";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import { useCookies } from "react-cookie";

import {
  sendVerifyEmailToAuth,
  checkAccountWithPhone,
  webLoginPhoneAuth,
  getUserInformation,
  checkVerifyEmailAuth,
} from "providers/AuthProvider/actions";
import Title from "@components/Title";
import Layout from "components/Layout";
import Input from "components/Form/TextField";
import {
  switchBackdropVisible,
  switchConfirmModal,
} from "@providers/GeneralProvider/slice";
import { getCurrentUserSuccess } from "@providers/AuthProvider/slice";
import Helper from "utils/helper";
import EmailAuhthenticationBlock from "@components/Auth/EmailAuthenticationBlock";
import {
  VALIDATION_TEXT,
  PAGE_SUBTITLE,
  PAGE_TITLE,
  FIREBASE_ERROR,
  AUTH_STEP,
  COUNTRY_CODE,
} from "utils/constants";
import OtpBlock from "components/Auth/OtpBlock";
import {
  useAuthentication,
  useWebCookie,
  useSpecificPageViewEvent,
} from "hooks";
import firebase from "lib/firebase";

const validationSchema = object().shape({
  email: string()
    .required(VALIDATION_TEXT.REQUIRED)
    .test(
      "isValidInput",
      VALIDATION_TEXT.EMAIL_PHONE_FORMAT,
      (value) => !!Helper.validateEmailAndPhone(value)
    ),
});

const LoginPage = ({ token }) => {
  const inputEmailRef = useRef();
  const [cookies, setCookie] = useCookies(["rememberMe", "nw-cookie"]);
  const { replace } = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loginStep, setLoginStep] = useState(AUTH_STEP.LOGIN);
  const [remember, setRemember] = useState(false);
  const [otp, setOtp] = useState("");
  const [submittedEmail, setSubmmitedEmail] = useState("");
  const [formattedPhone, setFormattedPhone] = useState("");
  const { trackEvent } = useSpecificPageViewEvent();

  const dispatch = useDispatch();
  const { setWebCookie } = useWebCookie();
  const {
    timeLeft,
    start,
    confirmation,
    handleResendEmail,
    handleResendOtp,
    sendOtpToPhone,
    handleConfirmEmail,
    setConfirmation,
  } = useAuthentication();

  useEffect(() => {
    (async () => {
      if (token && !_get(cookies, "nw-cookie")) {
        try {
          const result = await checkVerifyEmailAuth({
            token,
          });
          const { sessionToken, objectId } = result.user;
          if (result.success === true && result.redirectScreen === "SMS") {
            setCookie(
              "register-data",
              { sessionToken, objectId },
              { path: "/" }
            );
            // redirect to sms verify
            replace("/sms-authentication");
          }
          if (result.success === true && result.redirectScreen === "HOME") {
            const rememberMe = _get(cookies, "rememberMe");
            // set cookie
            setCookie(
              "nw-cookie",
              { sessionToken, objectId },
              {
                path: "/",
                ...(rememberMe === "true"
                  ? {
                      expires: moment()
                        .add(process.env.SESSION_EXPIRE_TIME, "s")
                        .toDate(),
                    }
                  : {}),
              }
            );
            const user = await getUserInformation({ userId: objectId });
            dispatch(getCurrentUserSuccess(user.user));
            // redirect
            replace("/");
          }
        } catch (error) {
          const verifyErrorCode = _get(error, "error.code");
          if (verifyErrorCode) {
            if (verifyErrorCode === 421) {
              dispatch(
                switchConfirmModal({
                  visible: true,
                  data: {
                    hideCancelBtn: true,
                    title: "ログインできません",
                    message:
                      "ログインできません。\nネイリストアカウントへはアプリからログインしてください。",
                  },
                })
              );
            } else Helper.toastError(error);
          }
          if (token) {
            replace("/login");
          }
        }
      }
    })();
  }, [cookies, dispatch, replace, setCookie, token]);

  const handleLogin = async (data) => {
    const loginType = Helper.validateEmailAndPhone(data.email);
    const { email } = data;
    try {
      if (loginType === "email") {
        setSubmmitedEmail(email);
        setCookie("rememberMe", remember);
        const result = await sendVerifyEmailToAuth(data);
        if (result.type === "REGISTER") {
          dispatch(
            switchConfirmModal({
              visible: true,
              data: {
                hideCancelBtn: true,
                title: "ログインできません",
                message:
                  "こちらのメールアドレスに該当する\nアカウントが確認できませんでした",
              },
            })
          );
        } else {
          // trackEvent({ event: "signup_email_input" });
          setLoginStep(AUTH_STEP.EMAIL_AUTH);
        }
      } else if (loginType === "phone") {
        if (email !== submittedEmail) {
          const formattedPhoneNumber = email.startsWith(COUNTRY_CODE.VN)
            ? email
            : `${COUNTRY_CODE.JP}${email}`;
          setFormattedPhone(formattedPhoneNumber);
          await checkAccountWithPhone({ phone: email });
          const result = await sendOtpToPhone({ phone: formattedPhoneNumber });
          setSubmmitedEmail(email);
          setConfirmation(result);
          start();
        }
        setLoginStep(AUTH_STEP.SMS_AUTH);
      }
      setSubmitting(false);
    } catch (error) {
      setSubmitting(false);
      if (_get(error, "error.code") === 9016) {
        dispatch(
          switchConfirmModal({
            visible: true,
            data: {
              hideCancelBtn: true,
              title: "ログインできません",
              message: Helper.getErrorMessage(error),
            },
          })
        );
      } else {
        const errorCode = _get(error, "code");
        const invalidPhoneCode = "auth/invalid-phone-number";
        if (errorCode && errorCode === invalidPhoneCode) {
          toast.info(FIREBASE_ERROR[`${invalidPhoneCode}-login`]);
        } else Helper.toastError(error);
      }
    }
  };

  const handleVerifyOtp = async (data) => {
    try {
      setOtp(data);
      if (data.length === 6) {
        dispatch(switchBackdropVisible(true));
        const credential = firebase.auth.PhoneAuthProvider.credential(
          confirmation.verificationId,
          data
        );
        await firebase.auth().signInWithCredential(credential);
        const result = await webLoginPhoneAuth();
        const { sessionToken, objectId } = result.user;
        const userInfo = await getUserInformation({ userId: objectId });
        dispatch(getCurrentUserSuccess(userInfo.user));
        dispatch(switchBackdropVisible(false));
        setWebCookie(
          { sessionToken, objectId },
          {
            path: "/",
            ...(remember
              ? {
                  expires: moment()
                    .add(process.env.SESSION_EXPIRE_TIME, "s")
                    .toDate(),
                }
              : {}),
          }
        );
      }
    } catch (error) {
      const errorCode = _get(error, "error.code");
      if ([421, 4011].includes(errorCode)) {
        dispatch(
          switchConfirmModal({
            visible: true,
            data: {
              hideCancelBtn: true,
              title: "ログインできません",
              message: Helper.getErrorMessage(error),
            },
          })
        );
      } else {
        Helper.toastError(error);
      }
      dispatch(switchBackdropVisible(false));
    }
  };

  const handleEditEmail = () => {
    setLoginStep(AUTH_STEP.LOGIN);
  };

  const handleEditEmailPhoneNumber = () => {
    setOtp("");
    setLoginStep(AUTH_STEP.LOGIN);
  };

  return (
    <Layout hiddenFooter hiddenHeaderMenu>
      {!token ? (
        <Container className="login-container">
          <Title
            title={PAGE_TITLE[loginStep]}
            japanese={PAGE_SUBTITLE[loginStep]}
            positionClass="center"
          />
          {loginStep === AUTH_STEP.LOGIN && (
            <div className="login--form">
              <Formik
                initialValues={{ email: submittedEmail, type: "LOGIN" }}
                validationSchema={validationSchema}
                enableReinitialize
                validateOnMount
                onSubmit={(values) => {
                  setSubmitting(true);
                  handleLogin(values);
                }}
              >
                {({ isValid, handleSubmit }) => (
                  <Form>
                    <Input
                      name="email"
                      variant="filled"
                      type="text"
                      placeholder="nailie@co.jp"
                      label="メールアドレスを入力"
                      required
                      lgGrid={[2, 6]}
                      onFocus={() => {
                        inputEmailRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                          inline: "start",
                        });
                      }}
                      ref={inputEmailRef}
                    />
                    <Grid container justifyContent="center">
                      <Grid item xs={12} sm={3} lg={2} />
                      <Grid
                        item
                        xs={12}
                        sm={9}
                        lg={6}
                        className="remember-checkbox"
                      >
                        <FormControlLabel
                          label="ログイン状態を維持"
                          control={
                            <Checkbox
                              onChange={() => setRemember(!remember)}
                              checked={remember}
                              color="default"
                            />
                          }
                        />
                      </Grid>
                    </Grid>
                    <Box
                      display="flex"
                      justifyContent="center"
                      marginTop="40px"
                    >
                      <Button
                        disabled={!isValid || submitting}
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                      >
                        {submitting ? (
                          <CircularProgress color="primary" size={24} />
                        ) : (
                          "次へ"
                        )}
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            </div>
          )}
          {loginStep === AUTH_STEP.EMAIL_AUTH && (
            <EmailAuhthenticationBlock
              email={submittedEmail}
              onResend={() =>
                handleResendEmail({ email: submittedEmail, type: "LOGIN" })
              }
              onConfirm={() => handleConfirmEmail(submittedEmail, remember)}
              onEdit={handleEditEmail}
            />
          )}
          {loginStep === AUTH_STEP.SMS_AUTH && (
            <OtpBlock
              otp={otp}
              onVerifyOtp={handleVerifyOtp}
              onResendOtp={() => handleResendOtp(formattedPhone)}
              onEditPhoneNumber={handleEditEmailPhoneNumber}
              timeLeft={timeLeft}
            />
          )}
          <div id="recaptcha-container" />
        </Container>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </Layout>
  );
};

export const getServerSideProps = async ({ query }) => {
  const { token } = query;
  return {
    props: token
      ? {
          token,
        }
      : {},
  };
};

LoginPage.auth = {
  private: false,
};

export default LoginPage;
