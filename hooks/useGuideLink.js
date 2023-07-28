import { useCallback } from "react";
import CryptoJS from "crypto-js";

const FAQ_SUPPORT_NAILIE_URL =
  process.env.NEXT_PUBLIC_FAQ_SUPPORT_NAILIE_URL ||
  "https://support.nailie.jp/hc/ja";
const CONTACT_PAGE_NAILIE_URL =
  process.env.NEXT_PUBLIC_CONTACT_PAGE ||
  "https://nailie1665023641.zendesk.com/hc/ja/requests/new";

const FIXED_KEY =
  process.env.ZENDESK_FIXED_SECRET_KEY || "KEHTISUSYUTJEMSJANSJKE";
const IV = "KEHTISUSYUTJEMSJ";

function encryptQueryString({ username, objectId, email, phone }) {
  const now = String(Number(new Date())).substr(0, 10);
  const SECRET_KEY = CryptoJS.enc.Utf8.parse(FIXED_KEY + now);
  const hashOption = {
    mode: CryptoJS.mode.CBC,
    iv: CryptoJS.enc.Utf8.parse(IV),
  };

  const encryptByAES = (utf8String) =>
    CryptoJS.AES.encrypt(
      utf8String,
      SECRET_KEY,
      hashOption
    ).ciphertext.toString(CryptoJS.enc.Base64);

  const urlQSObject = {
    info0: now,
    info1: encryptByAES(phone),
    info2: encryptByAES(username),
    info3: encryptByAES(objectId),
    info4: encryptByAES(email),
  };

  return new URLSearchParams(urlQSObject).toString();
}

const useGuideLink = ({ username, objectId, email, phone }) => {
  const memoizedCallback = useCallback(
    (e) => {
      if (!objectId) {
        // not login => href original FAQ_SUPPORT_NAILIE_URL
        return;
      }

      e.preventDefault();
      window.open(
        `${FAQ_SUPPORT_NAILIE_URL}?${encryptQueryString({
          username,
          objectId,
          email,
          phone,
        })}`,
        "_blank"
      );
    },
    [username, objectId, email, phone]
  );

  return [FAQ_SUPPORT_NAILIE_URL, memoizedCallback];
};
const useContactLink = ({ username, objectId, email, phone }) => {
  const memoizedCallback = useCallback(
    (e) => {
      if (!objectId) {
        // not login => href original CONTACT_PAGE
        return;
      }
      e.preventDefault();
      window.open(
        `${CONTACT_PAGE_NAILIE_URL}?${encryptQueryString({
          username,
          objectId,
          email,
          phone,
        })}`,
        "_blank"
      );
    },
    [username, objectId, email, phone]
  );

  return [CONTACT_PAGE_NAILIE_URL, memoizedCallback];
};

export default { useGuideLink, useContactLink };
