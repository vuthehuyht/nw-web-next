import { useRef } from "react";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import _get from "lodash/get";
import _invoke from "lodash/invoke";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  notReviewedBookingSelectors,
  removeNotReviewedBooking,
  setDetailBooking,
} from "providers/BookingProvider/slice";
import {
  reviewNailist,
  skipReviewBooking,
  getReservationDetail,
} from "providers/BookingProvider/actions";
import {
  switchConfirmModal,
  switchBackdropVisible,
} from "@providers/GeneralProvider/slice";
import { ALL_BOOKING_STATUS } from "utils/bookingConstants";
import ReviewModal from "./ReviewModal";
import ConfirmReview from "./ConfirmReview";

const { CANCELED_RESERVATION, DONE, NOVISIT, CONFIRMED, CARD_ERROR_CANCEL } =
  ALL_BOOKING_STATUS;

const NotReviewedBookingModal = () => {
  const titleRef = useRef();
  const reviewFormRef = useRef();
  const dispatch = useDispatch();
  const { query, pathname, replace } = useRouter();
  const { review, bookingId } = query;
  const currentUser = useSelector((state) => state.auth.currentUser);

  const currentBooking = useSelector((state) => state.booking.currentBooking);
  const currentBookingDetail = _get(currentBooking, "bookingDetail");
  const statusBooking = _get(currentBookingDetail, "status");
  const penalty = _get(currentBookingDetail, "penalty");
  const currentAverageRating = _get(
    currentBookingDetail,
    "review.averageRating"
  );
  const isPaymentError =
    _get(currentBookingDetail, "isPaymentError") &&
    ([DONE, NOVISIT, CONFIRMED, CARD_ERROR_CANCEL].includes(statusBooking) ||
      (statusBooking === CANCELED_RESERVATION && penalty));

  // Open from the url
  const isOpenBookingReview =
    pathname === "/booking-management/[bookingId]" && review === "true";

  const notReviewedBookingIds = useSelector((state) =>
    notReviewedBookingSelectors.selectIds(state)
  );
  const notReviewedBookingEntities = useSelector((state) =>
    notReviewedBookingSelectors.selectEntities(state)
  );
  const firstId = isOpenBookingReview ? bookingId : notReviewedBookingIds[0];

  const bookingDetail = isOpenBookingReview
    ? currentBookingDetail
    : notReviewedBookingEntities[firstId];

  const handleReviewBooking = async (values) => {
    try {
      dispatch(switchBackdropVisible(true));
      await reviewNailist({
        ...values,
        isPublic: true,
        title: "",
        bookingId: firstId,
      });
      const result = await getReservationDetail({ bookingId: firstId });
      dispatch(switchBackdropVisible(false));
      reviewFormRef.current.resetForm();
      dispatch(
        switchConfirmModal({
          visible: true,
          data: {
            title: "送信完了",
            message: "レビューを送信しました\nご協力ありがとうございました",
            hideCancelBtn: true,
          },
        })
      );
      dispatch(setDetailBooking(result));
      dispatch(removeNotReviewedBooking({ bookingIds: [firstId] }));
    } catch (error) {
      dispatch(switchBackdropVisible(false));
      toast.info(_get(error, "error.error"));
    }
  };

  const handleSkipReview = () => {
    try {
      skipReviewBooking({ bookingId: firstId });
      titleRef.current.scrollIntoView({
        behavior: "smooth",
      });
      _invoke(reviewFormRef, "current.resetForm");
      dispatch(removeNotReviewedBooking({ bookingIds: [firstId] }));
      if (isOpenBookingReview) {
        setTimeout(() => {
          replace(`/booking-management/${firstId}`);
        }, 500);
      }
    } catch (error) {
      toast.info(_get(error, "error.error"));
    }
  };
  const handleShowConfirmReview = (values, isValid) => {
    if (!isValid) {
      dispatch(
        switchConfirmModal({
          visible: true,
          data: {
            title: "レビュー投稿",
            message: "星タップで評価をお願いします。",
            hideCancelBtn: true,
          },
        })
      );
    } else {
      const { skillsRating, serviceRating, priceRating, comment } = values;
      // eslint-disable-next-line prettier/prettier
      const averageRating = ((skillsRating + serviceRating + priceRating) / 3).toFixed(1);
      dispatch(
        switchConfirmModal({
          visible: true,
          data: {
            title: "レビュー投稿",
            message: (
              <ConfirmReview
                avatar={_get(currentUser, "avatar")}
                username={_get(currentUser, "username")}
                commentDate={moment().format("YYYY/MM/DD")}
                comment={comment}
                averageRating={averageRating}
              />
            ),
            onConfirm: () => handleReviewBooking(values),
          },
        })
      );
    }
  };

  const handleCloseReviewModal = () => {};
  if (
    !_isEmpty(notReviewedBookingIds) ||
    (isOpenBookingReview &&
      statusBooking === DONE &&
      !isPaymentError &&
      !currentAverageRating)
  ) {
    return (
      <ReviewModal
        open={
          !_isEmpty(notReviewedBookingIds) ||
          (isOpenBookingReview &&
            statusBooking === DONE &&
            !isPaymentError &&
            !currentAverageRating)
        }
        onReview={handleShowConfirmReview}
        onSkipReview={handleSkipReview}
        bookingDetail={bookingDetail}
        currentUser={currentUser}
        ref={titleRef}
        formikRef={reviewFormRef}
        onClose={handleCloseReviewModal}
      />
    );
  }
  return null;
};

export default NotReviewedBookingModal;
