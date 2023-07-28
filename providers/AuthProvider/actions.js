import { parsePhoneNumber } from "react-phone-number-input";
import _isUndefined from "lodash/isUndefined";
import api from "lib/api";
import firebase from "lib/firebase";
import { COUNTRY_CODE, USER_STATUS } from "@utils/constants";

const config = {
  baseURL: process.env.DOMAIN_NAME,
};

export const sendVerifyEmailToAuth = (payload) =>
  api.post("/api/functions/webSendVerifyEmailToAuth", { ...payload }, config);

export const checkVerifyEmailAuth = (payload) =>
  api.post("/api/functions/webCheckVerifyEmailAuth", { ...payload }, config);

export const linkPhoneAuthToAccount = async (payload) => {
  const parsedPhone = parsePhoneNumber(payload.phone);
  const currentFirebaseUser = firebase.auth().currentUser;
  const token = await currentFirebaseUser.getIdToken(true);
  const id = currentFirebaseUser.uid;

  const params = {
    ...payload,
    phoneCountryCode: parsedPhone.countryCallingCode,
    phone: `0${parsedPhone.nationalNumber}`,
    authData: {
      token,
      id,
    },
    setUserStatus: USER_STATUS.ACTIVE,
    version: process.env.API_VERSION,
  };
  return api.post("/api/linkPhoneAuthToAccount", params, config);
};

export const checkAccountWithPhone = (payload) => {
  let { phone } = payload;
  if (phone.startsWith(COUNTRY_CODE.JP)) {
    phone = phone.slice(3);
  }
  return api.post(
    "/api/functions/checkAccountWithPhone",
    { phone, version: process.env.API_VERSION },
    config
  );
};

export const getUserInformation = (payload) =>
  api.post("/api/functions/getUserInformation", payload, config);

export const webLoginPhoneAuth = async () => {
  const currentFirebaseUser = firebase.auth().currentUser;
  const token = await currentFirebaseUser.getIdToken(true);
  const id = currentFirebaseUser.uid;

  return api.post(
    "/api/functions/webLoginPhoneAuth",
    {
      firebaseCredential: {
        id,
        token,
      },
    },
    config
  );
};

export const updateInforUser = (payload) => {
  const { avatar, username, fullName, furigana, inputInvitationCode } = payload;
  const inforUser = {
    username,
  };
  if (avatar && avatar.objectId) {
    inforUser.avatarId = avatar.objectId;
  }
  if (fullName) {
    inforUser.fullName = fullName.trim();
  }
  if (furigana) {
    inforUser.phonetic = furigana.trim();
  }
  if (!_isUndefined(inputInvitationCode)) {
    inforUser.inputInvitationCode = inputInvitationCode.toUpperCase();
  }
  return api.post("/api/functions/updateInforUserV2", { inforUser }, config);
};

export const saveQuestionSupportTicketForApp = async (payload) =>
  api.post("/api/functions/saveQuestionSupportTicketForApp", payload, config);
