import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import _get from "lodash/get";
import moment from "moment";
import { useRouter } from "next/router";

import { useCookies } from "react-cookie";

import {
  sendVerifyEmailToAuth,
  checkVerifyEmailAuth,
  getUserInformation,
} from "providers/AuthProvider/actions";
import {
  switchBackdropVisible,
  switchConfirmModal,
} from "providers/GeneralProvider/slice";
import { getCurrentUserSuccess } from "providers/AuthProvider/slice";
import firebase from "lib/firebase";
import helper from "@utils/helper";
import { useSpecificPageViewEvent } from "hooks";
import useCountDown from "./useCountDown";
import useWebCookie from "./useWebCookie";

const RESEND_TIME = 60000;
const INTERVAL = 1000;

const useAuthentication = () => {
  const dispatch = useDispatch();
  const [timeLeft, { start }] = useCountDown(RESEND_TIME, INTERVAL);
  const [confirmation, setConfirmation] = useState();
  const [recaptcha, setRecaptcha] = useState();
  const { setWebCookie } = useWebCookie();
  const { push, query } = useRouter();
  const [, setCookie] = useCookies(["register-data"]);
  const { trackEvent } = useSpecificPageViewEvent();

  const sendOtpToPhone = (payload) => {
    let appVerifier = recaptcha;
    if (!appVerifier) {
      appVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
      });
      setRecaptcha(appVerifier);
    }
    return firebase.auth().signInWithPhoneNumber(payload.phone, appVerifier);
  };

  const handleResendEmail = async (data) => {
    try {
      dispatch(switchBackdropVisible(true));
      await sendVerifyEmailToAuth(data);
      dispatch(switchBackdropVisible(false));
      toast.info("認証メールを再送信しました");
    } catch (e) {
      dispatch(switchBackdropVisible(false));
      helper.toastError(e);
    }
  };

  const handleResendOtp = async (phone) => {
    if (timeLeft === 0) {
      try {
        dispatch(switchBackdropVisible(true));
        const result = await sendOtpToPhone({ phone });
        setConfirmation(result);
        start(RESEND_TIME);
        dispatch(switchBackdropVisible(false));
      } catch (error) {
        helper.toastError(error);
        dispatch(switchBackdropVisible(false));
      }
    }
  };

  const handleConfirmEmail = async (email, rememberMe = true) => {
    try {
      dispatch(switchBackdropVisible(true));
      const result = await checkVerifyEmailAuth({ email });
      const { sessionToken, objectId } = result.user;
      if (result.success === true && result.redirectScreen === "SMS") {
        // trackEvent({
        //   event: "sign_up",
        // });
        setCookie("register-data", { sessionToken, objectId }, { path: "/" });
        push({ pathname: "/sms-authentication", query });
      } else if (result.success === true && result.redirectScreen === "HOME") {
        const userInfo = await getUserInformation({ userId: objectId });
        dispatch(getCurrentUserSuccess(userInfo.user));
        setWebCookie(
          { sessionToken, objectId },
          {
            path: "/",
            ...(rememberMe
              ? {
                  expires: moment()
                    .add(process.env.SESSION_EXPIRE_TIME, "s")
                    .toDate(),
                }
              : {}),
          }
        );
      }
      dispatch(switchBackdropVisible(false));
    } catch (error) {
      dispatch(switchBackdropVisible(false));
      const errorCode = _get(error, "error.code");
      if (errorCode === 421) {
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
      } else helper.toastError(error);
    }
  };

  return {
    handleResendEmail,
    handleResendOtp,
    sendOtpToPhone,
    handleConfirmEmail,
    setConfirmation,
    setRecaptcha,
    timeLeft,
    start,
    confirmation,
    recaptcha,
  };
};

export default useAuthentication;
