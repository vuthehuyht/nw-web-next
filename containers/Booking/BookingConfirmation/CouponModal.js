import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import _get from "lodash/get";
import _groupBy from "lodash/groupBy";
import _isEmpty from "lodash/isEmpty";
import Divider from "@material-ui/core/Divider";
import { toast } from "react-toastify";
import moment from "moment";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import { object, string } from "yup";
import Modal from "@components/Modal";
import Input from "components/Form/TextField";
import {
  getCouponList,
  addNewCoupon,
} from "@providers/BookingProvider/actions";
import { setCouponList } from "@providers/AuthProvider/slice";
import { switchBackdropVisible } from "@providers/GeneralProvider/slice";
import helper from "@utils/helper";
import webPageUrl from "lib/webPageUrl";
import { REGEX, VALIDATION_TEXT } from "utils/constants";

const validationSchema = object().shape({
  code: string()
    .min(3, VALIDATION_TEXT.INVALID_COUPON)
    .matches(REGEX.COUPON, VALIDATION_TEXT.INVALID_COUPON),
});

const CouponModal = ({ onSubmit, open, onClose }) => {
  const { asPath, replace } = useRouter();
  const dispatch = useDispatch();
  const couponFormRef = useRef();
  const currentUser = useSelector((state) => state.auth.currentUser);
  // Active coupon list
  const couponlist = _get(currentUser, "couponlist");
  const groupedCoupontList = _groupBy(couponlist, "minBookingPrice");
  // Expired coupon list
  const expiredCoupons = _get(currentUser, "expiredCoupons");

  const handleGetCouponList = useCallback(async () => {
    try {
      const result = await getCouponList();
      dispatch(setCouponList(result));
    } catch (e) {
      toast(_get(e, "error.error"));
    }
  }, [dispatch]);

  const handleAddCoupon = async (values) => {
    dispatch(switchBackdropVisible(true));
    try {
      await addNewCoupon(values);
      await handleGetCouponList();
      couponFormRef.current.resetForm();
    } catch (error) {
      const errorCode = _get(error, "error.code");
      const errorMsg = _get(error, "error.error");
      if (errorCode !== 141) {
        toast.info(errorMsg);
      } else toast.info("※こちらのクーポンコードはご利用になれません");
    }
    dispatch(switchBackdropVisible(false));
  };

  const handleCloseCouponModal = () => {
    // If open coupon modal by accessing the path /me/coupons
    if (asPath === webPageUrl.COUPON_LIST.source) {
      replace("/");
    } else onClose();
  };

  useEffect(() => {
    if (open) {
      handleGetCouponList();
    }
  }, [dispatch, handleGetCouponList, open]);

  const renderCouponImage = (coupon, isExpired) => (
    <Box
      key={`${coupon.objectId}-${coupon.code}-${_get(coupon, "endTime.iso")}`}
      position="relative"
    >
      <Button
        className="coupon-container"
        onClick={() => {
          if (onSubmit && !isExpired) {
            onSubmit(coupon);
          }
        }}
      >
        {coupon.quantity > 1 && <div className="coupon-shadow" />}
        <img src={coupon.image} />
        <Box className="coupon-info">
          <div>
            有効期限：
            {moment(coupon.endTime.iso).format("YYYY/MM/DD")}
          </div>
          <Box marginLeft="16px">コード：{coupon.code}</Box>
        </Box>
      </Button>
      {coupon.quantity > 1 && (
        <>
          <div
            className={clsx("coupon-quantity-background", {
              expired: isExpired,
            })}
          />
          <div className="coupon-quantity-text">x{coupon.quantity}</div>
        </>
      )}
    </Box>
  );

  const renderCouponList = (_groupedCoupontList) => {
    if (!_isEmpty(_groupedCoupontList)) {
      return (
        <>
          {Object.keys(_groupedCoupontList).map((minBookingPrice) => (
            <Box key={minBookingPrice}>
              <Typography variant="body2" className="coupon-price-title">
                ※¥{helper.addCommaToString(minBookingPrice)}
                以上のご予約に適用されます
              </Typography>
              <Box className="grouped-coupon-list">
                {(_groupedCoupontList[minBookingPrice] || []).map((coupon) =>
                  renderCouponImage(coupon)
                )}
              </Box>
            </Box>
          ))}
        </>
      );
    }
    return (
      <Typography
        align="center"
        variant="overline"
        component="div"
        style={{ color: "#aaaaaa" }}
      >
        保有しているクーポンはありません
      </Typography>
    );
  };

  return (
    <Modal
      className="coupon-list-modal"
      title="クーポン一覧"
      open={open}
      handleClose={handleCloseCouponModal}
      maxWidth="md"
    >
      <Formik
        initialValues={{ code: "" }}
        onSubmit={handleAddCoupon}
        innerRef={couponFormRef}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, setFieldValue, isValid, dirty }) => (
          <Form>
            <Box className="input-box">
              <Grid
                container
                className="input-container text-field-container"
                spacing={4}
              >
                <Grid item xs={12} sm={4} className="label-container">
                  <Typography variant="subtitle1" gutterBottom>
                    クーポンを発行する
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8} className="input-wrapper">
                  <Box display="flex">
                    <Input
                      name="code"
                      variant="filled"
                      type="text"
                      required
                      placeholder="クーポンコードを入力"
                      inputProps={{
                        maxLength: 32,
                        style: {
                          textTransform: "uppercase",
                        },
                      }}
                      endAdornment={
                        dirty && (
                          <IconButton
                            className="end-adornment"
                            style={{ marginRight: -12 }}
                            onClick={() => setFieldValue("code", "")}
                          >
                            <i
                              className="icon-round-close"
                              style={{ fontSize: 14 }}
                            />
                          </IconButton>
                        )
                      }
                    />
                    <Box>
                      <Button
                        className="apply-button"
                        variant="contained"
                        color="secondary"
                        disabled={!isValid || !dirty}
                        onClick={handleSubmit}
                      >
                        発行する
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Divider />
              <Typography variant="subtitle1" className="coupon-list-title">
                <strong>あなたの保有クーポン</strong>
              </Typography>
              <Grid item>{renderCouponList(groupedCoupontList)}</Grid>
              {!_isEmpty(expiredCoupons) && (
                <>
                  <Typography variant="subtitle1" className="coupon-list-title">
                    <strong>期限切れのクーポン</strong>
                  </Typography>
                  <Grid item>
                    <Box className="grouped-coupon-list" marginTop="24px">
                      {expiredCoupons.map((coupon) =>
                        renderCouponImage(coupon, true)
                      )}
                    </Box>
                  </Grid>
                </>
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

CouponModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
};

export default CouponModal;
