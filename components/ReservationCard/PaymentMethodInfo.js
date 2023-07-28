import { useRef, useEffect } from "react";
import clsx from "clsx";
import Image from "next/image";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { CARD_IMAGES, PAYMENT_PROVIDER } from "@utils/constants";
import CardListComponent from "components/CardManagement/PaymentMethodModal/CardList";
import AddCardModal from "@components/CardManagement/AddCardModal";
import { ALL_BOOKING_STATUS } from "utils/bookingConstants";
import helper from "@utils/helper";
import BankTransfer from "./BankTransferOption";

const PaymentMethodInfo = ({
  className,
  defaultCard = {},
  onCancel,
  onChangeCard,
  status,
  cardList,
  showOnlyCardList,
  loadingList,
  onSelectCard,
  selectedCard,
  onShowAddCardModal,
  paymentMethod,
  onChangePaymentMethod,
  onPaymentAgain,
  onAddCard,
  onCloseAddCardModal,
  openAddCard,
}) => {
  const paymentRef = useRef();

  useEffect(() => {
    if (showOnlyCardList) {
      paymentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start",
      });
    }
  }, [showOnlyCardList]);

  const handleChangeProvider = (provider) => {
    paymentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
    onChangePaymentMethod(provider);
  };
  return (
    <div
      ref={paymentRef}
      className={clsx("payment-method-information", { [className]: className })}
    >
      {status !== ALL_BOOKING_STATUS.CONFIRMED || showOnlyCardList ? (
        <>
          <CardListComponent
            showNoteText={false}
            list={cardList}
            loading={loadingList}
            onChange={(e) => onSelectCard(e.target.value)}
            selectedCard={selectedCard}
            onShowAddCard={onShowAddCardModal}
            showDeleteBtn={false}
            defaultCard={defaultCard}
            provider={paymentMethod}
            onChangeProvider={() => {
              handleChangeProvider(PAYMENT_PROVIDER.CREDIT_CARD);
            }}
          />
          {!showOnlyCardList && (
            <BankTransfer
              provider={paymentMethod}
              onChangeProvider={() => {
                handleChangeProvider(PAYMENT_PROVIDER.BANK_TRANSFER);
              }}
            />
          )}
          <Box display="flex" justifyContent="center" marginTop="24px">
            <Button
              variant="contained"
              color="secondary"
              className="contained-secondary-btn"
              disabled={paymentMethod === PAYMENT_PROVIDER.BANK_TRANSFER}
              onClick={onPaymentAgain}
            >
              OK
            </Button>
          </Box>
          {showOnlyCardList && (
            <>
              <Box marginTop="24px" className="cancel-booking-container">
                <Typography
                  align="center"
                  variant="body2"
                  className="error-text"
                  onClick={onCancel}
                >
                  予約をキャンセルする
                </Typography>
              </Box>
              <Box marginTop="24px">
                <Typography align="center" variant="body2">
                  ※ご予約の2日前までにクレジットカードの承認ができない場合、ご予約は自動的にキャンセルとなります。
                </Typography>
              </Box>
            </>
          )}
          {openAddCard && (
            <AddCardModal
              open={openAddCard}
              onSubmit={onAddCard}
              onClose={onCloseAddCardModal}
            />
          )}
        </>
      ) : (
        <>
          <div className="error-card-container">
            <div className="error-card-box">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                className="card-info"
              >
                <Image
                  className="card-image"
                  width="46px"
                  height="27px"
                  alt=""
                  src={
                    CARD_IMAGES[defaultCard.brand] ||
                    "/assets/images/cards/other.svg"
                  }
                />
                <div className="card-number-date-container">
                  <Typography variant="body2" className="card-number">
                    {helper.getCardNumberText(defaultCard)}
                  </Typography>
                  <Typography variant="body2" className="card-expire-date">
                    {moment(
                      new Date(defaultCard.exp_year, defaultCard.exp_month - 1)
                    ).format("MM/YY")}
                  </Typography>
                </div>
              </Box>
            </div>
          </div>
          <Typography variant="body2" align="center" className="error-text">
            どちらか選択してください
          </Typography>
          <Box
            className="payment-action-container"
            display="flex"
            justifyContent="space-between"
          >
            <IconButton disableRipple onClick={onCancel}>
              <div>
                <Image
                  className="card-image"
                  width="80px"
                  height="80px"
                  alt=""
                  src="/assets/images/cards/calendar.svg"
                />
                <Typography variant="subtitle2" align="center">
                  予約をキャンセルする
                </Typography>
              </div>
            </IconButton>
            <IconButton disableRipple onClick={onChangeCard}>
              <div>
                <Image
                  className="card-image"
                  width="80px"
                  height="80px"
                  alt=""
                  src="/assets/images/cards/guide-card.svg"
                />
                <Typography variant="subtitle2" align="center">
                  登録カードを変更する
                </Typography>
              </div>
            </IconButton>
          </Box>
        </>
      )}
    </div>
  );
};

export default PaymentMethodInfo;
