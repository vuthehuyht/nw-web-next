import { useState, useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import { Container, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import moment from "moment";
import dynamic from "next/dynamic";
import _get from "lodash/get";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import { toast } from "react-toastify";
import { object, string } from "yup";
import Title from "@components/Title";
import Layout from "components/Layout";

import {
  useAuthentication,
  useWebCookie,
  useContactSupport,
  useSpecificPageViewEvent,
} from "hooks";
import Helper from "utils/helper";
import {
  switchBackdropVisible,
  switchConfirmModal,
} from "@providers/GeneralProvider/slice";
import {
  getCurrentUserSuccess,
  switchProfileDialog,
} from "@providers/AuthProvider/slice";
import {
  linkPhoneAuthToAccount,
  getUserInformation,
} from "providers/AuthProvider/actions";
import firebase from "lib/firebase";
import {
  FIREBASE_ERROR,
  VALIDATION_TEXT,
  SUPPORT_TYPES,
} from "utils/constants";
import OtpBlock from "@components/Auth/OtpBlock";

const ContactModal = dynamic(() => import("@components/Auth/ContactModal"));

const PhoneInput = dynamic(() => import("components/Form/PhoneInput"), {
  ssr: false,
});

const validationSchema = object().shape({
  phone: string()
    .required(VALIDATION_TEXT.REQUIRED)
    .min(9, VALIDATION_TEXT.INVALID_PHONE),
});

const SMSAuthentication = () => {
  const dispatch = useDispatch();
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState("PHONE_AUTH");
  const [otp, setOtp] = useState("");
  const formikRef = useRef(null);
  const { setWebCookie } = useWebCookie();
  const [cookies, , removeCookie] = useCookies("register-data");
  const { trackEvent } = useSpecificPageViewEvent();
  const {
    openContact,
    loadingContact,
    handleContact,
    handleCloseContact,
    setOpenContact,
  } = useContactSupport([SUPPORT_TYPES.VERIFY_REGISTER]);
  const {
    timeLeft,
    start,
    handleResendOtp,
    confirmation,
    setConfirmation,
    sendOtpToPhone,
  } = useAuthentication();

  useEffect(() => {
    if (step === "PHONE_AUTH") {
      trackEvent({ event: "signup_sms_auth_input" });
    }
  }, [step]);

  const handleSubmit = async (values) => {
    if (values.phone !== submittedPhone) {
      setSubmitting(true);
      sendOtpToPhone(values)
        .then((result) => {
          setConfirmation(result);
          setSubmitting(false);
          setSubmittedPhone(values.phone);
          setStep("SMS_AUTH");
          start();
        })
        .catch((error) => {
          const errorCode = _get(error, "code");
          toast.info(FIREBASE_ERROR[errorCode]);
          setSubmitting(false);
        });
    } else setStep("SMS_AUTH");
  };

  const handleEditPhoneNumber = () => {
    setStep("PHONE_AUTH");
    setOtp("");
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
        await linkPhoneAuthToAccount({
          phone: submittedPhone,
          isRegistration: true,
          fromWeb: true,
        });
        dispatch(switchBackdropVisible(false));

        const registerData = cookies["register-data"];
        const { objectId, sessionToken } = registerData;
        setWebCookie(
          { sessionToken, objectId },
          {
            path: "/",
            expires: moment()
              .add(process.env.SESSION_EXPIRE_TIME, "s")
              .toDate(),
          }
        );
        const userInfor = await getUserInformation({
          userId: registerData.objectId,
        });
        trackEvent({ event: "signup_sms_auth_done" });
        dispatch(getCurrentUserSuccess(userInfor.user));
        dispatch(switchProfileDialog(true));
        removeCookie("register-data");
      }
    } catch (error) {
      const errorCode = _get(error, "error.code");
      dispatch(switchBackdropVisible(false));
      if (errorCode === 9014) {
        dispatch(
          switchConfirmModal({
            visible: true,
            data: {
              title: "エラー",
              message: Helper.getErrorMessage(error),
              hideCancelBtn: true,
            },
          })
        );
        setStep("PHONE_AUTH");
        setOtp("");
      } else {
        Helper.toastError(error);
      }
    }
  };

  return (
    <Layout hiddenFooter hiddenHeaderMenu>
      <Container className="sms-auth-container">
        <Title title="電話番号を入力" japanese="" positionClass="center" />
        {step === "PHONE_AUTH" ? (
          <div className="sms-auth--form">
            <Formik
              initialValues={{ phone: submittedPhone }}
              enableReinitialize
              validationSchema={validationSchema}
              innerRef={formikRef}
              validateOnMount
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ isValid }) => (
                <Form>
                  <PhoneInput
                    name="phone"
                    variant="filled"
                    type="text"
                    placeholder=""
                    label="電話番号"
                    required
                    maxLength={15}
                    defaultCountry={Helper.getISOCountryCode()}
                  />
                  <Box display="flex" justifyContent="center">
                    <Button
                      id="test-btn"
                      className="submit-btn"
                      disabled={!isValid || submitting}
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
                      {submitting ? (
                        <CircularProgress color="primary" size={24} />
                      ) : (
                        "OK"
                      )}
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </div>
        ) : (
          <OtpBlock
            onContactSupport={() => setOpenContact(true)}
            onVerifyOtp={handleVerifyOtp}
            onResendOtp={() => handleResendOtp(submittedPhone)}
            onEditPhoneNumber={handleEditPhoneNumber}
            timeLeft={timeLeft}
            otp={otp}
          />
        )}
        <div id="recaptcha-container" />
        {openContact && (
          <ContactModal
            open={openContact}
            onSubmit={handleContact}
            loading={loadingContact}
            onClose={handleCloseContact}
          />
        )}
      </Container>
    </Layout>
  );
};

SMSAuthentication.auth = {
  private: false,
};

export const getServerSideProps = async ({ req }) => {
  const parsedCookie = Helper.getRequestCookie(req);
  const registerCookie = parsedCookie["register-data"];
  if (registerCookie) {
    return {
      props: {},
    };
  }
  return {
    redirect: {
      destination: "/register",
    },
  };
};

export default SMSAuthentication;
