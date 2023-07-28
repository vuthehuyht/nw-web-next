import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import CardListComponent from "components/CardManagement/PaymentMethodModal/CardList";
import { setCardList, setSelectedProvider } from "providers/CardProvider/slice";
import { getCardList } from "providers/CardProvider/actions";
import { useAddCardModal } from "hooks";

const AddCardModal = dynamic(() =>
  import("components/CardManagement/AddCardModal")
);

const CardList = ({ fetchData = true }) => {
  const [loadingList, setLoadingList] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const selectedProvider = useSelector((state) => state.card.selectedProvider);
  const list = useSelector((state) => state.card.list);
  const defaultCard = useSelector((state) => state.card.defaultCard);
  const dispatch = useDispatch();
  const {
    openAddCard,
    setOpenAddCard,
    handleAddCard,
    handleShowAddCardModal,
    handleCloseAddCardModal,
    handleShowDeleteConfirm,
    handleChangeDefaultCard,
  } = useAddCardModal();

  useEffect(() => {
    if (fetchData) {
      setLoadingList(true);
      getCardList().then((result) => {
        setLoadingList(false);
        dispatch(setCardList(result));
      });
    }
  }, [dispatch, fetchData]);

  useEffect(() => {
    if (defaultCard) {
      setSelectedCard(defaultCard);
    }
  }, [defaultCard]);

  const handleChangeProvider = (e) => {
    dispatch(setSelectedProvider({ selectedProvider: e.target.value }));
    if (!defaultCard) {
      setOpenAddCard(true);
    }
  };

  return (
    <>
      <CardListComponent
        list={list}
        loading={loadingList}
        onChange={(value) => handleChangeDefaultCard(value.target.value)}
        selectedCard={selectedCard}
        onDeleteCard={handleShowDeleteConfirm}
        onShowAddCard={handleShowAddCardModal}
        defaultCard={defaultCard}
        provider={selectedProvider}
        onChangeProvider={handleChangeProvider}
      />
      {openAddCard && (
        <AddCardModal
          open={openAddCard}
          onSubmit={handleAddCard}
          onClose={handleCloseAddCardModal}
        />
      )}
    </>
  );
};

export default CardList;
