import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import moment from "moment";
import FloatingMessageComponent from "components/FloatingMessage";
import { useCountDown } from "hooks";

const FloatingMessage = () => {
  const { query, pathname } = useRouter();
  const { bookingId } = query;
  const countBookingPaymentError = useSelector(
    (state) => state.booking.countBookingPaymentError
  );
  const countCardChange = useSelector((state) => state.booking.countCardChange);
  const bookingPaymentErrorIds =
    useSelector((state) => state.booking.bookingPaymentErrorIds) || [];
  const bookingCardChangeIds =
    useSelector((state) => state.booking.bookingCardChangeIds) || [];
  const expiredDateCardChange = useSelector(
    (state) => state.booking.expiredDateCardChange
  );
  const errorVisible = useSelector((state) => state.booking.errorVisible);

  const timeToBookingDate = moment(expiredDateCardChange) - moment();
  const [timeLeft, { start }] = useCountDown();
  const paymentErrorQuery = {};
  if (countBookingPaymentError > 1) {
    paymentErrorQuery.errorType = "payment-error";
  } else if (countCardChange) {
    paymentErrorQuery.errorType = "card-change";
  }
  const path =
    countBookingPaymentError > 1 || countCardChange > 1
      ? "/payment-error"
      : `/booking-management/${
          bookingPaymentErrorIds[0] || bookingCardChangeIds[0]
        }`;

  useEffect(() => {
    if (expiredDateCardChange) {
      start(timeToBookingDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, expiredDateCardChange]);
  // Hide when on Payment error list and error booking detail
  if (
    !errorVisible ||
    pathname === "/payment-error" ||
    bookingPaymentErrorIds.concat(bookingCardChangeIds).includes(bookingId)
  ) {
    return null;
  }
  return (
    <FloatingMessageComponent
      paymentErrorQuery={paymentErrorQuery}
      path={path}
      timeLeft={timeLeft}
      countBookingPaymentError={countBookingPaymentError}
      countCardChange={countCardChange}
    />
  );
};

export default FloatingMessage;
