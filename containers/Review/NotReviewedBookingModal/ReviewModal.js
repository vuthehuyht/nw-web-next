import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import _get from "lodash/get";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { object, string, number } from "yup";
import { Formik, Form } from "formik";
import Modal from "@components/Modal";
import Rating from "components/Form/Rating";
import Input from "components/Form/TextField";
import NailistInformation from "@components/ReservationCard/NailistInfo";
import BookingInformation from "@components/ReservationCard/BookingInfo";

const validationSchema = object().shape({
  skillsRating: number().required().min(1),
  serviceRating: number().min(1).required(),
  priceRating: number().min(1).required(),
  comment: string().trim(),
});

const NotReviewedBookingModal = forwardRef(
  (
    {
      open,
      onReview,
      onSkipReview,
      bookingDetail,
      currentUser,
      onClose,
      formikRef,
    },
    ref
  ) => (
    <Modal
      handleClose={onClose}
      className="not-reviewed-booking-modal"
      title="レビュー"
      open={open}
      maxWidth="md"
    >
      <>
        <Typography variant="subtitle1" ref={ref}>
          {_get(currentUser, "username")}様
        </Typography>
        <Typography variant="subtitle1">
          本日はNailieのご利用誠にありがとうございまし た。
          今後のネイリストのサービス向上の為にも今回
          の施術についてご意見をお聞かせください。
        </Typography>
        <div className="treatment-title">
          <Typography variant="subtitle2">今回の施術 </Typography>
        </div>
        <div className="booking-info-container">
          <NailistInformation
            nailist={_get(bookingDetail, "nailist")}
            salon={{ salonName: _get(bookingDetail, "salon.salonName") }}
            bookingStatus={_get(bookingDetail, "status")}
            isPaymentError={_get(bookingDetail, "isPaymentError")}
          />
          <div className="dark-box booking-info">
            <BookingInformation data={bookingDetail} />
          </div>
          {_get(bookingDetail, "memoAdditionalPrice") && (
            <div className="dark-box memo-change-price">
              <Box className="memo-heading">
                <i className="icon-price" />
                <Typography variant="body2" component="span">
                  金額変更メモ
                </Typography>
              </Box>
              {_get(bookingDetail, "memoAdditionalPrice")}
            </div>
          )}
        </div>

        <div className="review-form">
          <Formik
            initialValues={{
              skillsRating: 0,
              serviceRating: 0,
              priceRating: 0,
              comment: "",
            }}
            innerRef={formikRef}
            validationSchema={validationSchema}
            validateOnMount
          >
            {({ isValid, values }) => (
              <Form>
                <div className="rating-section">
                  <Rating name="skillsRating" label="技術" />
                  <Rating name="serviceRating" label="接客" />
                  <Rating name="priceRating" label="価格" />
                </div>
                <Input
                  smGrid={[3, 9]}
                  lgGrid={[3, 9]}
                  name="comment"
                  variant="filled"
                  type="text"
                  label="レビューコメント"
                  multiline
                  maxRows={4}
                  minRows={4}
                  inputProps={{
                    maxLength: 200,
                  }}
                />
                <Box
                  display="flex"
                  justifyContent="center"
                  className="btn-container"
                >
                  <Button
                    onClick={() => onReview(values, isValid)}
                    variant="contained"
                    color="secondary"
                  >
                    レビューを投稿
                  </Button>
                </Box>
                <Typography
                  align="center"
                  className="link-text"
                  onClick={onSkipReview}
                >
                  スキップ
                </Typography>
              </Form>
            )}
          </Formik>
        </div>
      </>
    </Modal>
  )
);

export default NotReviewedBookingModal;
