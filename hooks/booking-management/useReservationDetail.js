import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _get from "lodash/get";
import {
  setDetailBooking,
  setCountBookingError,
} from "providers/BookingProvider/slice";
import {
  getReservationDetail,
  checkCancelBookingByCustomer,
  cancelBooking,
  countBookingCardError,
} from "providers/BookingProvider/actions";
import {
  switchConfirmModal,
  switchBackdropVisible,
} from "providers/GeneralProvider/slice";
import { ALL_BOOKING_STATUS } from "@utils/bookingConstants";
import helper from "@utils/helper";

const useReservationDetail = ({ bookingId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [justCancel, setJustCancel] = useState(false);
  const bookingPaymentErrorIds = useSelector(
    (state) => state.booking.bookingPaymentErrorIds
  );
  const bookingCardChangeIds = useSelector(
    (state) => state.booking.bookingCardChangeIds
  );
  useEffect(() => {
    if (bookingId) {
      setLoading(true);
      getReservationDetail({ bookingId })
        .then((result) => {
          dispatch(setDetailBooking(result));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, bookingId]);

  const handleCancelBooking = async ({ isErrorBooking }) => {
    try {
      dispatch(switchBackdropVisible(true));
      await cancelBooking({ bookingId });
      const detail = await getReservationDetail({ bookingId });
      dispatch(
        setDetailBooking({ ...detail, isCanceled: true, isErrorBooking })
      );
      if (
        bookingPaymentErrorIds.concat(bookingCardChangeIds).includes(bookingId)
      ) {
        countBookingCardError().then((result) => {
          dispatch(setCountBookingError(result));
        });
      }
      setJustCancel(true);
      dispatch(switchBackdropVisible(false));
      window.scrollTo(0, 0);
    } catch (error) {
      const errorCode = _get(error, "error.code");
      if (errorCode === 9013) {
        const detail = await getReservationDetail({ bookingId });
        dispatch(
          setDetailBooking({
            ...detail,
            isCanceled: true,
            isErrorBooking: true,
          })
        );
        setJustCancel(true);
      }
      dispatch(switchBackdropVisible(false));
      toast.info(_get(error, "error.error"));
    }
  };
  const showCancelBookingModal = async ({ status, isErrorBooking }) => {
    try {
      let checkResult;
      if (status === ALL_BOOKING_STATUS.CONFIRMED) {
        dispatch(switchBackdropVisible(true));
        checkResult = await checkCancelBookingByCustomer({ bookingId });
        dispatch(switchBackdropVisible(false));
      }
      const message = (
        <>
          {checkResult && checkResult.penalty > 0 ? (
            <>
              こちらの予約をキャンセルすると
              <span className="error-text">
                キャンセル料
                {checkResult.penalty * 100}% (¥
                {helper.addCommaToString(checkResult.fee)})
              </span>
              が発生します。
              <br />
              本当にキャンセルしますか?
            </>
          ) : (
            <div>
              {status === ALL_BOOKING_STATUS.CONFIRMED
                ? "こちらの予約を本当にキャンセルしますか？"
                : "こちらのリクエストを本当にキャンセルしますか？"}
            </div>
          )}
          <br />
          <br />
          ＊この操作は取り消しができません
        </>
      );
      dispatch(
        switchConfirmModal({
          visible: true,
          data: {
            title:
              status === ALL_BOOKING_STATUS.CONFIRMED
                ? "予約キャンセル"
                : "リクエストキャンセル",
            message,
            onConfirm: () => handleCancelBooking({ isErrorBooking }),
            cancelText: "いいえ",
            confirmText: "はい",
          },
        })
      );
    } catch (error) {
      dispatch(switchBackdropVisible(false));
      toast.info(_get(error, "error.error"));
    }
  };
  return { loading, showCancelBookingModal, justCancel };
};

export default useReservationDetail;
