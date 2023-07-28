import _pick from "lodash/pick";
import _get from "lodash/get";
import api from "lib/api";
import { LIMIT } from "@utils/constants";

const config = {
  baseURL: process.env.DOMAIN_NAME,
};
export const getMenusBookingByUser = (payload) =>
  api.post("/api/functions/getMenusBookingByUser", payload, config);

export const getDateNotAvailableTime = (payload) =>
  api.post("/api/functions/getDateNotAvailableTimeV2", payload, config);

export const getAvailableTimesByDay = (payload) =>
  api.post("/api/functions/getAvailableTimesByDay", payload, config);

export const requestBooking = (payload) => {
  const params = _pick(payload, [
    "fullName",
    "phone",
    "phonetic",
    "nailistId",
    "slot",
    "bookingDate",
    "menuBookings",
    "paymentMethod",
    "cardId",
    "cancelPolicy",
    "latestMenuChangeMoment",
    "couponId",
  ]);
  return api.post(
    "/api/functions/requestBooking",
    { ...params, fromWeb: true },
    config
  );
};

export const webGetConfirmationStepBookingFlowData = (payload) => {
  const params = _pick(payload, ["nailistId", "calculation"]);
  return api.post(
    "/api/functions/webGetConfirmationStepBookingFlowData",
    params,
    config
  );
};

export const getBookingList = (payload) =>
  api.post(
    "/api/functions/getBookingList",
    { ...payload, countMessage: true },
    config
  );

export const getReservationDetail = (payload) =>
  api.post(
    "/api/functions/getReservationDetailV2",
    { ...payload, countMessage: true },
    config
  );

export const checkCancelBookingByCustomer = (payload) =>
  api.post("/api/functions/checkCancelBookingByCustomer", payload, config);

export const cancelBooking = (payload) =>
  api.post("/api/functions/cancelBookingV2", payload, config);

export const getBookingsNotReviewByCustomer = (payload) =>
  api.post("/api/functions/getBookingsNotReviewByCustomerV2", payload, config);

export const reviewNailist = (payload) => {
  const params = _pick(payload, [
    "bookingId",
    "skillsRating",
    "serviceRating",
    "priceRating",
    "isPublic",
    "comment",
  ]);
  return api.post("/api/functions/reviewNailistV2", params, config);
};

export const skipReviewBooking = (payload) =>
  api.post("/api/functions/skipReviewBooking", payload, config);

export const getListOfErrorPaymentBookings = (payload) =>
  api.post("/api/functions/getListOfErrorPaymentBookingsV2", payload, config);

export const getListOfNeedChangeCardBookings = (payload) =>
  api.post("/api/functions/getListOfNeedChangeCardBookingsV2", payload, config);

export const countBookingCardError = () =>
  api.post("/api/functions/countBookingCardError", {}, config);

export const customerPaymentAgain = (payload) => {
  const params = _pick(payload, ["bookingId", "paymentMethod", "cardId"]);
  return api.post("/api/functions/customerPaymentAgainV2", params, config);
};

export const checkCardCanPayment = (payload) =>
  api.post("/api/functions/checkCardCanPayment", payload, config);

export const remindedCustomerBookingAutoCancel = (payload) =>
  api.post("/api/functions/remindedCustomerBookingAutoCancel", payload, config);

export const addNewCoupon = (payload) => {
  const { code } = payload;
  return api.post(
    "/api/functions/addNewCoupon",
    { code: code.toUpperCase(), lang: "ja" },
    config
  );
};

export const getCouponList = (payload) =>
  api.post("/api/functions/getCouponListV2", payload, config);

export const getCouponDetail = (payload) => {
  const params = _pick(payload, [
    "bookingDate",
    "slot",
    "code",
    "nailistId",
    "priceBooking",
  ]);
  return api.post("/api/functions/getCouponDetail", params, config);
};

export const verifyInvitationCode = (payload) => {
  const { inputInvitationCode } = payload;
  return api.post(
    "/api/functions/verifyInvitationCode",
    { inputInvitationCode: inputInvitationCode.toUpperCase() },
    config
  );
};

export const checkNailistCanBookV3 = (payload) =>
  api.post("/api/functions/checkNailistCanBookV3", payload, config);

export const searchNailist = async (payload, callServer) => {
  const { page } = payload;
  const params = {
    page: page || 1,
    limit: payload.limit ? payload.limit : LIMIT,
    ...payload,
  };
  const result = await api.post(
    callServer
      ? "/functions/webAdvancedSearchNailist"
      : "/api/functions/webAdvancedSearchNailist",
    params,
    callServer ? {} : config
  );
  return callServer ? _get(result, "result", {}) : result;
};
export const getStatusDirectBookingForNailist = (payload) =>
  api.post("/api/functions/getStatusDirectBookingForNailist", payload, config);
