import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import _get from "lodash/get";
import { toast } from "react-toastify";
import { webGetConfirmationStepBookingFlowData } from "providers/BookingProvider/actions";
import {
  updateInforUser,
  getUserInformation,
} from "providers/AuthProvider/actions";
import { getCurrentUserSuccess } from "providers/AuthProvider/slice";
import { getCardList } from "providers/CardProvider/actions";
import { setCardList } from "providers/CardProvider/slice";

const useConfirmationStep = ({
  step,
  bookingDate,
  menuBookings,
  nailistId,
  bookingResult,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [nailistData, setNailist] = useState();
  const [bookingCalculation, setBookingCalculation] = useState();
  const [cancelPolicy, setCancelPolicy] = useState({});
  const cardList = useSelector((state) => state.card.list);
  const defaultCard = useSelector((state) => state.card.defaultCard);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const { objectId, phonetic, fullName, phone, hasBooking } = currentUser;
  const nailistUsername = _get(nailistData, "username");
  const nailistAvatar = _get(nailistData, "avatar");
  const isDirectBooking = _get(nailistData, "isDirectBooking");

  useEffect(async () => {
    if (step === "confirmation" && !bookingResult) {
      setLoading(true);

      const updatedUser = await getUserInformation({ userId: objectId });
      dispatch(getCurrentUserSuccess(updatedUser.user));

      const apiCalls = [
        webGetConfirmationStepBookingFlowData({
          nailistId,
          calculation: {
            bookingDate,
            menuBookings,
            userId: nailistId,
          },
        }),
        getCardList(),
      ];

      Promise.all(apiCalls)
        .then((result) => {
          const getCardListResult = _get(result, "[1]");
          const nailist = _get(result, "[0].nailist", {});
          const calculation = _get(result, "[0].calculation", {});
          setNailist(nailist);
          setBookingCalculation(calculation);
          setCancelPolicy(calculation.cancelPolicy);
          dispatch(setCardList(getCardListResult));
        })
        .finally(() => setLoading(false));
    }
  }, [bookingDate, bookingResult, dispatch, menuBookings, nailistId, step]);

  const handleUpdateUserInformation = useCallback(
    async (payload) => {
      try {
        await updateInforUser({ ...payload });
        const newUserInfor = await getUserInformation({ userId: objectId });
        dispatch(getCurrentUserSuccess(newUserInfor.user));
      } catch (error) {
        toast.info(_get(error, "error.error"));
      }
    },
    [dispatch, objectId]
  );
  return {
    loading,
    cancelPolicy,
    bookingCalculation,
    cardList,
    defaultCard,
    hasBooking,
    phonetic,
    fullName,
    phone,
    nailistUsername,
    nailistAvatar,
    isDirectBooking,
    handleUpdateUserInformation,
  };
};

export default useConfirmationStep;
