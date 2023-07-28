import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { object, string } from "yup";
import { toast } from "react-toastify";
import { Container, Button, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import _get from "lodash/get";
import { useCookies } from "react-cookie";
import moment from "moment";
import {
  sendVerifyEmailToAuth,
  checkVerifyEmailAuth,
  getUserInformation,
} from "providers/AuthProvider/actions";
import { switchConfirmModal } from "@providers/GeneralProvider/slice";
import { getCurrentUserSuccess } from "providers/AuthProvider/slice";
import Title from "@components/Title";
import Layout from "components/Layout";
import Input from "components/Form/TextField";
import EmailAuhthenticationBlock from "@components/Auth/EmailAuthenticationBlock";
import {
  VALIDATION_TEXT,
  PAGE_TITLE,
  PAGE_SUBTITLE,
  AUTH_STEP,
  REGEX,
} from "utils/constants";
import { useAuthentication, useSpecificPageViewEvent } from "hooks";
import Helper from "@utils/helper";

const validationSchema = object().shape({
  email: string()
    .required(VALIDATION_TEXT.REQUIRED)
    .matches(REGEX.EMAIL, VALIDATION_TEXT.EMAIL_FORMAT),
});

const RegisterPage = ({ token }) => {
  const { replace, query } = useRouter();
  const [cookies, setCookie] = useCookies(["nw-cookie"]);
  const dispatch = useDispatch();
  const { redirect, step: bookingStep } = query;
  const [step, setStep] = useState(AUTH_STEP.REGISTER);
  const [submitting, setSubmitting] = useState(false);
  const [submittedEmail, setSubmmitedEmail] = useState("");
  const formikRef = useRef(null);
  const { handleResendEmail, handleConfirmEmail } = useAuthentication();
  const { trackEvent } = useSpecificPageViewEvent();
  const btnText =
    redirect && bookingStep ? "同意して会員登録・予約にすすむ" : "同意して次へ";

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
            replace("/register");
          }
        }
      }
    })();
  }, [cookies, dispatch, replace, setCookie, token]);

  const handleRegister = async (values) => {
    try {
      setSubmmitedEmail(values.email);
      await sendVerifyEmailToAuth(values);
      setStep(AUTH_STEP.EMAIL_AUTH);
      setSubmitting(false);
    } catch (e) {
      setSubmitting(false);
      toast.info(_get(e, "error.error"));
    }
  };

  const handleEditEmail = () => {
    setStep(AUTH_STEP.REGISTER);
  };

  useEffect(() => {
    trackEvent({ event: "signup_start" });
  }, []);

  return (
    <Layout hiddenFooter hiddenHeaderMenu>
      {!token ? (
        <Container className="register-container">
          <div className="register--form">
            <Title
              title={PAGE_TITLE[step]}
              japanese={PAGE_SUBTITLE[step]}
              positionClass="center"
            />
            {step === AUTH_STEP.REGISTER ? (
              <div className="inner-block">
                <Formik
                  initialValues={{ email: submittedEmail, type: "REGISTER" }}
                  validationSchema={validationSchema}
                  enableReinitialize
                  innerRef={formikRef}
                  validateOnMount
                  onSubmit={(values) => {
                    setSubmitting(true);
                    handleRegister(values);
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
                      />
                      <div className="helper-text">
                        <Typography
                          variant="body2"
                          className="term-privacy-text"
                          color="textPrimary"
                          align="center"
                        >
                          「同意して次へ」ボタンを押すことで、
                        </Typography>
                        <Typography
                          variant="body2"
                          className="term-privacy-text"
                          color="textPrimary"
                          align="center"
                        >
                          <Link href="/terms" passHref>
                            <a target="_blank" rel="noreferrer noopener">
                              利用規約
                            </a>
                          </Link>
                          及び
                          <Link href="/privacy-policies" passHref>
                            <a target="_blank" rel="noreferrer noopener">
                              プライバシーポリシー
                            </a>
                          </Link>
                          に同意したものとみなします。
                        </Typography>
                      </div>
                      {redirect && bookingStep && (
                        <Box
                          display="flex"
                          justifyContent="center"
                          marginTop="24px"
                        >
                          <Link href={{ pathname: "/login", query }}>
                            <a>
                              <Typography variant="body2" color="primary">
                                ログインはこちら
                              </Typography>
                            </a>
                          </Link>
                        </Box>
                      )}
                      <Box
                        display="flex"
                        justifyContent="center"
                        marginTop="24px"
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
                            btnText
                          )}
                        </Button>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </div>
            ) : (
              <EmailAuhthenticationBlock
                email={submittedEmail}
                onResend={() =>
                  handleResendEmail({ email: submittedEmail, type: "REGISTER" })
                }
                onConfirm={() => {
                  handleConfirmEmail(submittedEmail);
                }}
                onEdit={handleEditEmail}
              />
            )}
          </div>
        </Container>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </Layout>
  );
};

RegisterPage.auth = {
  private: false,
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

export default RegisterPage;
