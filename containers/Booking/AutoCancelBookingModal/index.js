import { useEffect, useState } from "react";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import _get from "lodash/get";
import { useSelector, useDispatch } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import { CircularProgress } from "@material-ui/core";
import { toast } from "react-toastify";
import {
  getReservationDetail,
  remindedCustomerBookingAutoCancel,
} from "providers/BookingProvider/actions";
import Modal from "@components/Modal";
import NailistInformation from "@components/ReservationCard/NailistInfo";
import BookingInformation from "@components/ReservationCard/BookingInfo";
import ErrorInfo from "@components/ReservationCard/ErrorInfo";
import { CARD_IMAGES } from "@utils/constants";
import { removeAutoBookingCancelId } from "providers/BookingProvider/slice";
import helper from "@utils/helper";

const AutoCancelBookingModal = () => {
  const [loading, setLoading] = useState();
  const [autoCancelDetail, setAutoCancelDetail] = useState();
  const bookingAutoCancelIds = useSelector(
    (state) => state.booking.bookingAutoCancelIds
  );
  const firstBookingId = bookingAutoCancelIds[0];
  const dispatch = useDispatch();
  const defaultCard = _get(autoCancelDetail, "card", {});

  useEffect(() => {
    if (firstBookingId) {
      setLoading(true);
      getReservationDetail({ bookingId: firstBookingId })
        .then((result) => {
          setAutoCancelDetail(result);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, firstBookingId]);

  const handleCloseAutoCancelBookingModal = () => {
    try {
      remindedCustomerBookingAutoCancel({ bookingId: firstBookingId });
      dispatch(removeAutoBookingCancelId(firstBookingId));
    } catch (error) {
      toast(_get(error, "error.error"));
    }
  };

  if (!_isEmpty(bookingAutoCancelIds)) {
    return (
      <Modal
        handleClose={handleCloseAutoCancelBookingModal}
        className="auto-cancel-booking-modal"
        title="お知らせ"
        open
        maxWidth="md"
      >
        <div>
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress size={40} />
            </Box>
          ) : (
            <>
              <div className="info-box">
                <ErrorInfo status="CARD_ERROR_CANCEL" isPaymentError />
              </div>
              <div className="info-box booking-info-container">
                <h3>今回の施術</h3>
                <NailistInformation
                  bookingStatus={_get(autoCancelDetail, "bookingDetail.status")}
                  nailist={_get(autoCancelDetail, "bookingDetail.nailist")}
                  isPaymentError={_get(
                    autoCancelDetail,
                    "bookingDetail.isPaymentError"
                  )}
                  salon={{
                    salonName: _get(
                      autoCancelDetail,
                      "bookingDetail.salon.salonName"
                    ),
                  }}
                />
                <div className="dark-box booking-info">
                  <BookingInformation
                    data={_get(autoCancelDetail, "bookingDetail")}
                  />
                </div>
              </div>
              <div className="info-box">
                <h3>お支払い方法を選択</h3>
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
                        <Typography
                          variant="body2"
                          className="card-expire-date"
                        >
                          {moment(
                            new Date(
                              defaultCard.exp_year,
                              defaultCard.exp_month - 1
                            )
                          ).format("MM/YY")}
                        </Typography>
                      </div>
                    </Box>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    );
  }
  return null;
};

export default AutoCancelBookingModal;
