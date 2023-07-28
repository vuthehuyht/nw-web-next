import { useMemo } from "react";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import _get from "lodash/get";

import PaymentBlock from "./PaymentBlock";
import SummaryBlock from "./SummaryBlock";
import UpdateUserBlock from "./UpdateUserBlock";

const BookingConfirmation = ({
  bookingDate,
  bookingSlot,
  menuBookings,
  nailistUsername,
  nailistAvatar,
  isDirectBooking,
  phonetic,
  fullName,
  phone,
  hasBooking,
  cancelPolicy,
  bookingCalculation,
  cardList,
  defaultCard,
  menus,
  loading,
  onSubmit,
  updateUserInfo,
  onSelectCoupon,
  selectedCoupon,
  onDeselectCoupon,
  openCouponModal,
  onCloseCouponModal,
  onOpenCouponModal,
}) => {
  const allNailistMenus = useMemo(
    () =>
      menus.reduce((obj, item) => {
        const formattedObj = { ...obj };
        item.menus.forEach((m) => {
          formattedObj[m.objectId] = m;
        });
        return formattedObj;
      }, {}),
    [menus]
  );

  return (
    <Box className="booking-confirmation-step">
      {!loading ? (
        <>
          <SummaryBlock
            nailistUsername={nailistUsername}
            nailistAvatar={nailistAvatar}
            allNailistMenus={allNailistMenus}
            menuBookings={menuBookings}
            bookingCalculation={bookingCalculation}
            bookingDate={bookingDate}
            bookingSlot={bookingSlot}
            coupon={selectedCoupon}
          />
          <PaymentBlock
            hasBooking={hasBooking}
            cardList={cardList}
            defaultCard={defaultCard}
            selectedCoupon={selectedCoupon}
            onSelectCoupon={onSelectCoupon}
            onDeselectCoupon={onDeselectCoupon}
            openCouponModal={openCouponModal}
            onCloseCouponModal={onCloseCouponModal}
            onOpenCouponModal={onOpenCouponModal}
          />
          <UpdateUserBlock
            hasBooking={!hasBooking}
            phonetic={phonetic}
            fullName={fullName}
            phone={phone}
            updateUserInfo={updateUserInfo}
            cancelDate={_get(bookingCalculation, "cancelDate")}
            data={cancelPolicy}
            nailistUsername={nailistUsername}
            nailistAvatar={nailistAvatar}
            onSubmit={onSubmit}
            defaultCard={defaultCard}
            isDirectBooking={isDirectBooking}
          />
        </>
      ) : (
        <Box display="flex" justifyContent="center" className="loading">
          <CircularProgress size={40} />
        </Box>
      )}
    </Box>
  );
};
export default BookingConfirmation;
