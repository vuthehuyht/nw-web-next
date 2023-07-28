/* eslint-disable prettier/prettier */
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import Box from "@material-ui/core/Box";
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Layout from "components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import HeaderWidthBackButton from "@components/HeaderWidthBackButton";
import NailistInformation from "@components/ReservationCard/NailistInfo";
import BookingInformation from "@components/ReservationCard/BookingInfo";
import CardInformation from "@components/ReservationCard/PaymentCardInfo";
import PaymentMethodInfo from "@components/ReservationCard/PaymentMethodInfo";
import ReviewInformation from "@components//ReservationCard/ReviewInfo";
import { setNotReviewedBooking } from "providers/BookingProvider/slice";
import { ALL_BOOKING_STATUS, BOOKING_STATUS } from "utils/bookingConstants";
import { useReservationDetail, useChangeCardPayment } from "hooks";
import ErrorInfo from "@components/ReservationCard/ErrorInfo";
import { InstallationPopupWrapper } from "@components/InstallationPopup";

const {
  CANCELED_RESERVATION,
  CANCELED_REQUEST,
  DONE,
  NOVISIT,
  CONFIRMED,
  CARD_ERROR_CANCEL,
} = ALL_BOOKING_STATUS;
const BookingDetail = () => {
  const { query, back } = useRouter();
  const { bookingId } = query;
  const dispatch = useDispatch();
  const { loading, showCancelBookingModal, justCancel } = useReservationDetail({
    bookingId,
  });
  const cardList = useSelector((state) => state.card.list);
  const defaultCard = useSelector((state) => state.card.defaultCard);

  const currentBooking =
    useSelector((state) => state.booking.currentBooking) || {};
  const bookingPaymentErrorIds = useSelector(
    (state) => state.booking.bookingPaymentErrorIds
  );
  const bookingCardChangeIds = useSelector(
    (state) => state.booking.bookingCardChangeIds
  );
  const paymentCard = _get(currentBooking, "card");
  const statusBooking = _get(currentBooking, "bookingDetail.status");
  const penalty = _get(currentBooking, "bookingDetail.penalty");
  const nailistPhone = _get(currentBooking, "bookingDetail.nailist.phone");
  const messageCount = _get(currentBooking, "bookingDetail.messageCount");
  const hasChangeByAdmin = _get(
    currentBooking,
    "bookingDetail.hasChangeByAdmin"
  );

  const isPaymentError =
    _get(currentBooking, "bookingDetail.isPaymentError") &&
    ([DONE, NOVISIT, CONFIRMED, CARD_ERROR_CANCEL].includes(statusBooking) ||
      (statusBooking === CANCELED_RESERVATION && penalty));

  const {
    showOnlyCardList,
    setShowCardList,
    openAddCard,
    paymentMethod,
    setPaymentMethod,
    handleAddCard,
    handleShowAddCardModal,
    handleCloseAddCardModal,
    selectedCard,
    setSelectedCard,
    showPaymentAgainConfirm,
  } = useChangeCardPayment({
    bookingId,
    errorCard: paymentCard,
    cardList,
    isPaymentError,
    statusBooking,
    defaultCard,
  });

  const breadcrumbs = [
    {
      text: "あなたの予約",
      href: "/booking-management",
    },
    { text: query.bookingId || "bookingID" },
  ];

  const startDate = moment(
    `${_get(currentBooking, "bookingDetail.bookingDate.iso")} ${_get(
      currentBooking,
      "bookingDetail.slot",
      ""
    )
      .toString()
      .padStart(4, "0")}`,
    "YYYY-MM-DDTHH:mm:ss.SSSSZ HHmm"
  );

  const showReviewModal = () => {
    dispatch(
      setNotReviewedBooking({ bookings: [currentBooking.bookingDetail] })
    );
  };

  return (
    <Layout hiddenFooter>
      <div className="booking-management-layout">
        <Breadcrumbs data={breadcrumbs} />
        <div className="booking-management-heading">
          <Container>
            {isPaymentError &&
            statusBooking === ALL_BOOKING_STATUS.CONFIRMED ? (
              <HeaderWidthBackButton
                handleBack="/booking-management"
                title={_get(
                  BOOKING_STATUS[ALL_BOOKING_STATUS.PAYMENT_ERROR],
                  "text",
                  "あなたの予約"
                )}
              />
            ) : (
              <HeaderWidthBackButton
                handleBack="/booking-management"
                title={_get(
                  BOOKING_STATUS[statusBooking],
                  "text",
                  "あなたの予約"
                )}
              />
            )}
          </Container>
        </div>
        <div className="booking-management-layout__inner reservation-details-wrapper">
          {loading && (
            <div className="loading-box">
              <CircularProgress color="primary" />
            </div>
          )}
          {!loading && (
            <Container className="reservation-details-container">
              <Box className="info-box">
                <ErrorInfo
                  penalty={penalty}
                  bookingId={bookingId}
                  justCancel={justCancel}
                  status={statusBooking}
                  isPaymentError={isPaymentError}
                  bookingPaymentErrorIds={bookingPaymentErrorIds}
                  bookingCardChangeIds={bookingCardChangeIds}
                />
                <h3>ネイリスト情報/予約内容</h3>
                <Box display="flex" justifyContent="space-between">
                  <NailistInformation
                    className="nailist-info"
                    nailist={_get(currentBooking, "bookingDetail.nailist")}
                    salon={_get(currentBooking, "bookingDetail.salon")}
                    bookingStatus={statusBooking}
                    isPaymentError={_get(currentBooking, "bookingDetail.isPaymentError")}
                  />
                  {!_get(currentBooking, "bookingDetail.isPaymentError") && (
                    <Box padding="26px 24px 0px 0px" display="flex">
                      {[ALL_BOOKING_STATUS.CONFIRMED, ALL_BOOKING_STATUS.WAITING_DONE].includes(statusBooking) && (
                        <a href={`tel:${nailistPhone}`}>
                          <i
                            style={{ fontSize: 28, marginRight: 24 }}
                            className="icon-phone"
                          />
                        </a>
                      )}
                      <InstallationPopupWrapper
                        title={`メッセージ機能は\nアプリにてご利用いただけます`}
                        footer={`アプリをインストール＞ログインして\nネイリストとメッセージのやりとりをしましょう！`}
                      >
                        <Badge
                          badgeContent={messageCount}
                          color="secondary"
                          style={{ verticalAlign: "unset" }}
                        >
                          <i
                            style={{ fontSize: 28 }}
                            className="icon-message pointer"
                          />
                        </Badge>
                      </InstallationPopupWrapper>
                    </Box>
                  )}
                </Box>
                <div className="dark-box booking-info">
                  <BookingInformation
                    data={_get(currentBooking, "bookingDetail")}
                  />
                </div>
                {_get(currentBooking, "bookingDetail.memoAdditionalPrice") &&
                  !hasChangeByAdmin && (
                    <div className="dark-box memo-change-price">
                      <Box className="memo-heading">
                        <i className="icon-price" />
                        <Typography variant="body2" component="span">
                          金額変更メモ
                        </Typography>
                      </Box>
                      {_get(
                        currentBooking,
                        "bookingDetail.memoAdditionalPrice"
                      )}
                    </div>
                  )}
              </Box>
              {isPaymentError && (
                <Box className="info-box">
                  <h3>
                    {statusBooking === ALL_BOOKING_STATUS.CONFIRMED
                      ? "エラーが発生しているクレジットカード"
                      : "お支払い方法を選択"}
                  </h3>
                  <PaymentMethodInfo
                    showOnlyCardList={showOnlyCardList}
                    onChangeCard={() => setShowCardList(true)}
                    cardList={cardList}
                    onCancel={() =>
                      showCancelBookingModal({
                        status: statusBooking,
                        isErrorBooking: true,
                      })
                    }
                    defaultCard={paymentCard}
                    status={statusBooking}
                    onSelectCard={(card) => setSelectedCard(card)}
                    selectedCard={selectedCard}
                    onShowAddCardModal={handleShowAddCardModal}
                    paymentMethod={paymentMethod}
                    onChangePaymentMethod={(value) => setPaymentMethod(value)}
                    onPaymentAgain={showPaymentAgainConfirm}
                    openAddCard={openAddCard}
                    onAddCard={handleAddCard}
                    onCloseAddCardModal={handleCloseAddCardModal}
                  />
                </Box>
              )}
              {!isPaymentError && (
                <Box className="info-box">
                  <h3>ネイリスト情報/予約内容</h3>
                  <CardInformation
                    data={{
                      ..._get(currentBooking, "card"),
                      objectId: _get(currentBooking, "bookingDetail.objectId"),
                      requestedDate: _get(
                        currentBooking,
                        "bookingDetail.requestedDate"
                      ),
                      cancelFree: _get(currentBooking, "cancelFree"),
                      paymentMethod: _get(
                        currentBooking,
                        "bookingDetail.paymentMethod"
                      ),
                    }}
                  />
                  {[CANCELED_RESERVATION, CANCELED_REQUEST].includes(
                    statusBooking
                  ) &&
                    justCancel && (
                      <Box
                        display="flex"
                        justifyContent="center"
                        className="button-actions cancel"
                      >
                        <Button
                          className="cancel-confirm-button"
                          onClick={() => back()}
                        >
                          OK
                        </Button>
                      </Box>
                    )}
                  {/* REQUESTED - CONFIRMED_BOOKING */}
                  {(_isEqual(statusBooking, "REQUESTED") ||
                    (_isEqual(statusBooking, "CONFIRMED") &&
                      startDate.diff(moment(), "seconds") > 0)) && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      className="button-actions cancel"
                    >
                      <Button
                        color="secondary"
                        className="cancel-button"
                        onClick={() =>
                          showCancelBookingModal({ status: statusBooking })
                        }
                      >
                        {statusBooking === "CONFIRMED" ? '予約をキャンセルする' : '予約リクエストをキャンセルする'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {/* DONE BOOKING */}
              {_isEqual(statusBooking, "DONE") && !isPaymentError && (
                <Box className="info-box">
                  <h3>レビュー</h3>
                  {_get(
                    currentBooking,
                    "bookingDetail.review.averageRating"
                  ) ? (
                    <ReviewInformation
                      data={_get(currentBooking, "bookingDetail.review")}
                      dataClient={_get(currentBooking, "bookingDetail.client")}
                      dataNailist={_get(
                        currentBooking,
                        "bookingDetail.nailist"
                      )}
                    />
                  ) : (
                    <>
                      <Typography component="p">
                        レビューを投稿してネイリストに感想を伝えましょう！
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="center"
                        className="button-actions review"
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          className="review-button"
                          onClick={showReviewModal}
                        >
                          レビューを投稿する
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Container>
          )}
        </div>
      </div>
    </Layout>
  );
};

BookingDetail.auth = {
  private: true,
};
export default BookingDetail;
