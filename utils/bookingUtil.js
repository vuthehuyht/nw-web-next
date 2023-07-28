import _get from "lodash/get";
import moment from "moment";
import {
  STATUS_CANCEL_BY_CUSTOMER,
  STATUS_CANCEL_BY_NAILIST,
  ALL_BOOKING_STATUS,
} from "@utils/bookingConstants";

const BookingUtil = {
  getCancelBeforeDays: (data) => {
    let cancelBefore;
    const canceledDate = _get(data, "canceledDate.iso");
    const bookingDate = _get(data, "bookingDate.iso");
    const status = _get(data, "status");

    if (status === ALL_BOOKING_STATUS.NOVISIT) {
      cancelBefore = 0;
    } else if (canceledDate) {
      cancelBefore = Math.abs(
        moment(canceledDate)
          .startOf("d")
          .diff(moment(bookingDate).startOf("d"), "d")
      );
    }
    return { cancelBefore };
  },
  getCustomerCancelPayment: (data = {}) =>
    Math.floor(
      data.price * _get(data, "penalty", 0) -
        _get(data, "bookingPointInfo.usePoint", 0) -
        _get(data, "bookingPointInfo.usePoint", 0)
    ),
  getPaymentPrice: (data = {}) => {
    let totalPrice = data.price;
    let addPrice = 0;
    const isChangePrice = _get(data, "additionalPrice", 0) > 0;
    const usePoint = _get(data, "bookingPointInfo.usePoint", 0) > 0;
    const useCoupon = _get(data, "coupon.value", 0) > 0;
    const isCancelledByCustomer = STATUS_CANCEL_BY_CUSTOMER.includes(
      data.status
    );
    const isCancelledByNailist = STATUS_CANCEL_BY_NAILIST.includes(data.status);
    const isCancelledByOperator =
      data.status === ALL_BOOKING_STATUS.NAILIE_CANCELED;
    if (isChangePrice) {
      totalPrice = data.additionalPrice;
      addPrice = totalPrice - _get(data, "price");
    }
    let totalPayment = totalPrice;

    if (usePoint) {
      totalPayment = totalPrice - _get(data, "bookingPointInfo.usePoint", 0);
    }
    if (useCoupon) {
      totalPayment = totalPrice - _get(data, "coupon.value");
    }

    if (isCancelledByCustomer) {
      totalPrice = Math.floor(data.price * _get(data, "penalty", 0));
      totalPayment = Math.floor(
        data.price * _get(data, "penalty", 0) -
          _get(data, "bookingPointInfo.usePoint", 0) -
          _get(data, "bookingPointInfo.usePoint", 0)
      );
    }

    if (isCancelledByOperator || isCancelledByNailist) {
      totalPrice = 0;
      totalPayment = 0;
    }

    return {
      addPrice,
      totalPayment,
      totalPrice,
      isCancelledByCustomer,
      isCancelledByOperator,
      isCancelledByNailist,
      isChangePrice,
      useCoupon,
      usePoint,
    };
  },
  getLatestMenuChangeMoment: (menus, selectedIds) => {
    const allUpdatedTimes = menus.reduce((prevUpdatedTimes, currentMenu) => {
      const allMenuUpdatedTimes = currentMenu.menus.reduce(
        (prevMenuUpdateTimes, curMenu) => {
          if (selectedIds.includes(curMenu.objectId)) {
            return prevMenuUpdateTimes.concat(curMenu.updatedAt.iso);
          }
          return prevMenuUpdateTimes;
        },
        []
      );
      return prevUpdatedTimes.concat(allMenuUpdatedTimes);
    }, []);

    return new Date(
      Math.max(...allUpdatedTimes.map((e) => new Date(e)))
    ).toISOString();
  },
  // TODO: Replace with i18n or a general way to handle error
  handleCouponError: (data = {}) => {
    const { reason, minBookingPrice, startTime, endTime } = data;
    if (reason === "PRICE_MUST_GREATER_THAN_OR_EQUAL") {
      return `※クーポンコード割引は \n${minBookingPrice} 以上のご予約が対象となります`;
    }
    if (reason === "COUPON_NOT_IN_EFFECTIVE_DATE") {
      return `※こちらのクーポンコードは施術日が\n${startTime} ~ ${endTime}のご予約が対象となります`;
    }
    if (reason === "CANNOT_USE_SAME_NAILIST") {
      return "こちらのクーポンは1人のネイリストにつき、1回までしか使用できません。\n※こちらのネイリストにはすでにクーポンを使用済みです。";
    }
    return "※こちらのクーポンコードはご利用になれません";
  },
};

export default BookingUtil;
