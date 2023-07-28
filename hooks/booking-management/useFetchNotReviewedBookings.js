import { useEffect, useCallback } from "react";
import _get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setNotReviewedBooking } from "providers/BookingProvider/slice";
import { getBookingsNotReviewByCustomer } from "providers/BookingProvider/actions";

const useFetchNotReviewedBookings = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser) || {};
  const currentId = currentUser.objectId;

  const handleGetNotReviewBooking = useCallback(
    async (userId) => {
      if (userId) {
        try {
          getBookingsNotReviewByCustomer().then((result) => {
            dispatch(
              setNotReviewedBooking({
                bookings: result,
              })
            );
          });
        } catch (error) {
          toast.info(_get(error, "error.error"));
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    handleGetNotReviewBooking(currentId);
  }, [currentId, dispatch, handleGetNotReviewBooking]);
  return { handleGetNotReviewBooking };
};

export default useFetchNotReviewedBookings;
