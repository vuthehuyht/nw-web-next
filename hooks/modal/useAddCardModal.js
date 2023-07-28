/* eslint-disable prettier/prettier */
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import _get from "lodash/get";
import { toast } from 'react-toastify';
import moment from 'moment';
import { switchBackdropVisible } from '@providers/GeneralProvider/slice';
import {

  switchConfirmModal,
} from "providers/GeneralProvider/slice";
import { setCardList, setSelectedProvider } from "providers/CardProvider/slice";
import {
  getCardToken,
  getCardList,
  get4GTokenCard,
  addCreditCard,
  deleteCard,
  setDefaultCard,
} from "providers/CardProvider/actions";
import { PAYMENT_PROVIDER, CARD_PROVIDER } from "@utils/constants";
import helper from '@utils/helper';

const useAddCardModal = () => {
  const dispatch = useDispatch();
  const [openAddCard, setOpenAddCard] = useState(false);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const selectedProvider = useSelector((state) => state.card.selectedProvider);
  const defaultCard = useSelector((state) => state.card.defaultCard);
  const paymentProvider = useSelector((state) => state.card.provider);

  const handleFetchCardList = async () => {
    const result = await getCardList();
    dispatch(setCardList(result));
    dispatch(switchBackdropVisible(false));
  };

  const handleAddCard = async (values) => {
    try {
      dispatch(switchBackdropVisible(true));
      let token;
      // paymentProvider: provider get from api
      // if stripe call get card token of stripe
      if (paymentProvider === CARD_PROVIDER.STRIPE) {
        token = await getCardToken(values);
      } else {
        // else call get card token of veritrans
        token = await get4GTokenCard({
          card_number: values.cardNumber,
          card_expire: `${values['cc-exp-month']}/${moment(
            values['cc-exp-year'],
            "YYYY"
          ).format("YY")}`,
          security_code: values['cc-csc'],
          lang: "en",
        });
      }
      await addCreditCard({
        tokenId: paymentProvider === CARD_PROVIDER.STRIPE ? token.id.trim() : token.token,
        customerName: currentUser.name,
        phonetic: currentUser.phonetic || null,
        customerPhone: currentUser.phone,
        setDefault: true
      });
      await handleFetchCardList();
      setOpenAddCard(false);
    } catch (error) {
      toast.info(
        _get(error, "error.error", "こちらのカードのご使用ができません。")
      );
      dispatch(switchBackdropVisible(false));
    }
  };



  const handleShowAddCardModal = () => {
    setOpenAddCard(true);
  };

  const handleCloseAddCardModal = () => {
    if (!defaultCard && selectedProvider === PAYMENT_PROVIDER.CREDIT_CARD) {
      dispatch(setSelectedProvider({ selectedProvider: null }));
    }
    setOpenAddCard(false);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      dispatch(switchBackdropVisible(true));
      await deleteCard({ cardId });
      handleFetchCardList();
    } catch (error) {
      toast.info(_get(error, "error.error"));
      dispatch(switchBackdropVisible(false));
    }
  };

  const handleShowDeleteConfirm = (item) => {
    dispatch(
      switchConfirmModal({
        visible: true,
        data: {
          title: "カードを削除",
          onConfirm: () => handleDeleteCard(item.id),
          message: (
            <>
              <b>{helper.getCardNumberText(item)}</b>
              のカードを削除しますか？
            </>
          ),
        },
      })
    );
  };

  const handleChangeDefaultCard = async (cardId) => {
    try {
      dispatch(switchBackdropVisible(true));
      await setDefaultCard({ cardId });
      handleFetchCardList();
    } catch (error) {
      toast.info(_get(error, "error.error"));
      dispatch(switchBackdropVisible(false));
    }
  };

  return {
    openAddCard, setOpenAddCard,
    handleAddCard, handleShowAddCardModal, handleCloseAddCardModal,
    handleShowDeleteConfirm, handleChangeDefaultCard, handleFetchCardList
  }
};

export default useAddCardModal;