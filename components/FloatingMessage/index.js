import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import moment from "moment";

const FloatingMessage = ({
  path,
  paymentErrorQuery,
  countBookingPaymentError,
  countCardChange,
  timeLeft,
}) => (
  <div className="floating-message-wrapper">
    <Container>
      {timeLeft > 0 && (
        <Typography
          variant="body2"
          className="change-card-countdown"
          component="span"
        >
          カード変更期限あと
          <span className="count-down-timer">
            {Math.floor(moment.duration(timeLeft).asHours())}:
            {moment.utc(timeLeft).format("mm:ss")}
          </span>
        </Typography>
      )}
      <Link passHref href={{ pathname: path, query: paymentErrorQuery }}>
        <a href="">
          <div className="floating-message">
            {countBookingPaymentError > 0 && (
              <div className="floating-message__heading">重要なお知らせ</div>
            )}
            {(countBookingPaymentError > 0 || countCardChange > 0) && (
              <div className="floating-message__inner">
                {(countBookingPaymentError > 1 || countCardChange > 1) && (
                  <span className="count-payment-error">
                    {countBookingPaymentError || countCardChange}
                  </span>
                )}
                <h3 className="sub-title">
                  {countBookingPaymentError > 0
                    ? "お支払いエラー"
                    : "クレジットカードエラー"}
                </h3>
                <p>
                  {countBookingPaymentError > 0
                    ? "ネイリストさんへの支払いが完了できませんでしたこちらをタップして支払いをしてください"
                    : "クレジットカードエラーが発生しましたカード情報を確認してください"}
                </p>
              </div>
            )}
          </div>
        </a>
      </Link>
    </Container>
  </div>
);

export default FloatingMessage;
