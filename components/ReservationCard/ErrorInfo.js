import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ALL_BOOKING_STATUS, BOOKING_STATUS } from "utils/bookingConstants";

const {
  CANCELED_RESERVATION,
  CANCELED_REQUEST,
  NAILIE_CANCELED,
  DONE,
  NOVISIT,
  CONFIRMED,
  CARD_ERROR_CANCEL,
} = ALL_BOOKING_STATUS;

const ErrorInfo = ({ status, isPaymentError, justCancel, penalty }) => {
  const showCancelText =
    ([CANCELED_RESERVATION, CANCELED_REQUEST].includes(status) && justCancel) ||
    status === NAILIE_CANCELED;
  const cardError = isPaymentError && status === CONFIRMED;
  const paymentError =
    isPaymentError &&
    ([DONE, NOVISIT].includes(status) ||
      (status === CANCELED_RESERVATION && penalty));
  const cardErrorCancel = isPaymentError && status === CARD_ERROR_CANCEL;
  if (showCancelText) {
    return (
      <div className="booking-error-container">
        <Typography className="error-text" align="center" variant="body2">
          {BOOKING_STATUS[status].warningText}
        </Typography>
      </div>
    );
  }
  if (cardError || paymentError || cardErrorCancel) {
    return (
      <div className="booking-error-container">
        <Box display="flex" justifyContent="center" className="icon-container">
          <i className="icon-alert" />
        </Box>
        <Typography align="center" variant="body1" className="bold-error-text">
          {paymentError &&
            "「クレジットカード」もしくは「atone翌月後払い」の上限金額を超えたため決済ができませんでした。"}
          {cardError && "クレジットカードエラーが発生しました"}
        </Typography>
        <Typography align="center" variant="body2">
          {cardError && "登録カードを変更するか予約をキャンセルしてください"}
          {cardErrorCancel &&
            "クレジットカードエラーが発生したためこちらの予約は自動キャンセルとなりました"}
        </Typography>
        <Typography align="center" variant="body2" className="error-text">
          {paymentError && "お支払いを完了させてください"}
          {cardError &&
            "※ご予約の2日前までにクレジットカードの承認ができない場合、ご予約は自動的にキャンセルとなります"}
        </Typography>
      </div>
    );
  }

  return null;
};

export default ErrorInfo;
