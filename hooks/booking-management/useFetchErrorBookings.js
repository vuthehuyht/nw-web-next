import { useEffect, useCallback, useState } from "react";
import _get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { setErrorBooking } from "providers/BookingProvider/slice";
import {
  getListOfErrorPaymentBookings,
  getListOfNeedChangeCardBookings,
} from "providers/BookingProvider/actions";

const useFetchErrorBookings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState();
  const currentPage = useSelector((state) => state.booking.errorBooking.page);
  const { query, replace, isReady } = useRouter();
  const { page: queryPage, errorType } = query;

  const handleGetErrorBooking = useCallback(
    async (payload) => {
      try {
        replace({
          pathname: "/payment-error",
          query: payload,
        });
        setLoading(true);
        if (payload.errorType === "card-change") {
          const bookings = await getListOfNeedChangeCardBookings();
          dispatch(setErrorBooking({ bookings, page: payload.page }));
          setLoading(false);
        } else {
          const bookings = await getListOfErrorPaymentBookings();
          dispatch(setErrorBooking({ bookings, page: payload.page }));
          setLoading(false);
        }
      } catch (error) {
        toast.info(_get(error, "error.error"));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );
  useEffect(() => {
    // Query of nextjs will be empty at first rendering, use isReady to check if query is empty or not
    if (isReady && Number(queryPage) !== currentPage) {
      handleGetErrorBooking({ errorType, page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, handleGetErrorBooking, errorType, isReady]);
  return { handleGetErrorBooking, loading };
};

export default useFetchErrorBookings;
