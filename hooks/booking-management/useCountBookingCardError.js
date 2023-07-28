import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import _get from "lodash/get";
import { countBookingCardError } from "@providers/BookingProvider/actions";
import { setCountBookingError } from "providers/BookingProvider/slice";
import useInterval from "../useInterval";

const useCountBookingCardError = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser) || {};
  const currentId = currentUser.objectId;

  const countBookingError = async () => {
    try {
      const result = await countBookingCardError();
      dispatch(setCountBookingError(result));
    } catch (e) {
      toast.info(_get(e, "error.error"));
    }
  };
  useInterval(() => {
    if (currentId) {
      countBookingError();
    }
  }, 300000);

  useEffect(() => {
    if (currentId) {
      countBookingError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);
  return { countBookingError };
};

export default useCountBookingCardError;
