import { useState, memo } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import dynamic from "next/dynamic";
import { Divider } from "@material-ui/core";
import { CARD_IMAGES } from "@utils/constants";
import CardList from "containers/CardManagement/CardList";
import PaymentMethodModal from "components/CardManagement/PaymentMethodModal";
import helper from "@utils/helper";

const CouponModal = dynamic(() =>
  import("containers/Booking/BookingConfirmation/CouponModal")
);
const PaymentBlock = ({
  cardList = [],
  defaultCard,
  hasBooking,
  onSelectCoupon,
  selectedCoupon,
  onDeselectCoupon,
  onOpenCouponModal,
  onCloseCouponModal,
  openCouponModal,
}) => {
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const defaultPaymentCard =
    cardList.find((card) => card.id === defaultCard) || {};

  const renderSelectedCoupon = (_selectedCoupon) => (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Typography>クーポンコードを追加</Typography>
      <Box display="flex" alignItems="center">
        <Typography color="primary">
          <strong>{_selectedCoupon?.code}</strong>
        </Typography>
        {_selectedCoupon ? (
          <IconButton
            style={{ marginRight: "-16px" }}
            onClick={(e) => {
              e.stopPropagation();
              onDeselectCoupon();
            }}
          >
            <i
              className="icon-round-close"
              style={{ fontSize: 16, color: "#AAAAAA" }}
            />
          </IconButton>
        ) : (
          <IconButton style={{ marginRight: "-16px" }}>
            <i className="icon-angle-right" style={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {!hasBooking || !defaultCard ? (
        <div className="card-list-block">
          <Typography>支払い方法</Typography>
          <CardList fetchData={false} />
        </div>
      ) : (
        <Box className="card-list-block" style={{ padding: 0 }}>
          <Button fullWidth onClick={() => setOpenPaymentModal(true)}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography>支払い方法</Typography>
              <Box display="flex" alignItems="center">
                <img src={CARD_IMAGES[defaultPaymentCard.brand]} alt="" />
                <Typography variant="subtitle2" className="card-number">
                  {helper.getCardNumberText(defaultPaymentCard)}
                </Typography>
              </Box>
            </Box>
          </Button>
          <Divider variant="middle" />
          <Button
            fullWidth
            {...(!selectedCoupon ? { onClick: onOpenCouponModal } : {})}
          >
            <Box display="flex" width="100%" style={{ marginTop: 0 }}>
              {renderSelectedCoupon(selectedCoupon)}
            </Box>
          </Button>
        </Box>
      )}
      {(!hasBooking || !defaultCard) && (
        <Button
          className="point-coupon-block"
          fullWidth
          {...(!selectedCoupon ? { onClick: onOpenCouponModal } : {})}
        >
          <Typography align="left" className="block-title">
            クーポン
          </Typography>
          {renderSelectedCoupon(selectedCoupon)}
        </Button>
      )}
      {openPaymentModal && defaultCard && (
        <PaymentMethodModal
          open={openPaymentModal && defaultCard}
          onClose={() => setOpenPaymentModal(false)}
        >
          <CardList />
        </PaymentMethodModal>
      )}
      {openCouponModal && (
        <CouponModal
          open={openCouponModal}
          onClose={onCloseCouponModal}
          onSubmit={onSelectCoupon}
        />
      )}
    </>
  );
};

export default memo(PaymentBlock);
