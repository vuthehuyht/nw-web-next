/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import _get from "lodash/get";
import { toast } from 'react-toastify';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { setDetailBooking } from 'providers/BookingProvider/slice';
import {
  checkCardCanPayment,
  customerPaymentAgain,
  getReservationDetail,
} from 'providers/BookingProvider/actions'
import { switchBackdropVisible, switchConfirmModal } from '@providers/GeneralProvider/slice';
import {
} from "providers/GeneralProvider/slice";
import { PAYMENT_PROVIDER, PAYMENT_METHOD } from "@utils/constants";
import { ALL_BOOKING_STATUS } from '@utils/bookingConstants';
import CreditCardBox from '@components/ReservationCard/CreditCardBox';
import { countBookingCardError } from "@providers/BookingProvider/actions";
import { setCountBookingError } from "@providers/BookingProvider/slice";
import useAddCardModal from '../modal/useAddCardModal';

const { DONE, NOVISIT, CANCELED_RESERVATION, CONFIRMED } = ALL_BOOKING_STATUS;
const useChangeCardPayment = ({ bookingId, statusBooking, cardList, isPaymentError, defaultCard }) => {
  const dispatch = useDispatch();
  const [showOnlyCardList, setShowCardList] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_PROVIDER.CREDIT_CARD);
  const cardError = isPaymentError && statusBooking === CONFIRMED;
  const paymentError =
    isPaymentError && [DONE, NOVISIT, CANCELED_RESERVATION].includes(statusBooking);

  const { openAddCard, handleAddCard, handleShowAddCardModal, handleCloseAddCardModal, handleFetchCardList } = useAddCardModal();
  useEffect(() => {
    if (defaultCard) {
      setSelectedCard(defaultCard);
    }
  }, [defaultCard]);

  useEffect(() => {
    handleFetchCardList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handlePaymentAgain = async () => {
    try {
      dispatch(switchBackdropVisible(true));
      if (cardError) {
        await checkCardCanPayment({ bookingId, cardId: selectedCard });
      } else if (paymentError) {
        await customerPaymentAgain({
          bookingId,
          paymentMethod: PAYMENT_METHOD.ONLINE,
          cardId: selectedCard,
        });
      }
      const booking = await getReservationDetail({ bookingId });
      const countBookingError = await countBookingCardError();
      dispatch(setDetailBooking({ ...booking, isErrorBooking: true }));
      dispatch(setCountBookingError(countBookingError));
      dispatch(switchBackdropVisible(false));
      dispatch(switchConfirmModal({ visible: true, data: {
        title: "決済が完了",
        message: "決済が完了しました。ありがとうございました。",
        hideCancelBtn: true
      }}))
    } catch (error) {
      dispatch(switchBackdropVisible(false));
      toast.info(_get(error, "error.error"));
    }
  };

  const showPaymentAgainConfirm = () => {
    dispatch(switchConfirmModal({
      visible: true, data: {
        title: "決済が完了",
        confirmText: "はい",
        cancelText: "いいえ",
        onConfirm: handlePaymentAgain,
        message: <>
          <Box maxWidth={311} margin="0 auto">
            <CreditCardBox defaultCard={cardList.find(card => card.id === selectedCard)} />
          </Box>
          <Box marginTop="32px">
            <Typography variant="body2">こちらのカードで決済を行います。よろしいでしょうか？</Typography>
          </Box>
        </>,
      }
    }))
  }
  return {
    showOnlyCardList, setShowCardList, openAddCard, paymentMethod, setPaymentMethod,
    handleAddCard, handleShowAddCardModal, handleCloseAddCardModal, handlePaymentAgain,
    selectedCard, setSelectedCard, showPaymentAgainConfirm
  }
};

export default useChangeCardPayment;