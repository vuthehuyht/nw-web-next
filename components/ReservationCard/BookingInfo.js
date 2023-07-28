import Box from "@material-ui/core/Box";
import moment from "moment";
import clsx from "clsx";
import _get from "lodash/get";
import _findIndex from "lodash/findIndex";
import _isEqual from "lodash/isEqual";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { isMobile } from "react-device-detect";
import MenuTag from "components/Booking/BookingMenus/MenuTag";
import {
  STATUS_EARN_POINT,
  CANCEL_BEFORE_TEXT,
  ALL_BOOKING_STATUS,
} from "@utils/bookingConstants";
import HELPER from "@utils/helper";
import BookingUtil from "utils/bookingUtil";
import { InstallationPopupWrapper } from "@components/InstallationPopup";

const BookingInfo = ({ className, data = {} }) => {
  const { penalty, status, hasChangeByAdmin } = data;
  const isChangePrice = _get(data, "additionalPrice", 0) > 0;
  const earnPoint = _findIndex(
    STATUS_EARN_POINT,
    (item) => item === data.status
  );

  const {
    addPrice,
    totalPayment,
    totalPrice,
    isCancelledByCustomer,
    isCancelledByNailist,
    useCoupon,
    usePoint,
  } = BookingUtil.getPaymentPrice(data);
  const { cancelBefore } = BookingUtil.getCancelBeforeDays(data);
  return (
    <div className={clsx("booking-information", { [className]: className })}>
      <Box display="flex" className="booking-date-container">
        <i className="icon-calendar" />
        <Typography variant="body2">
          {`${moment(_get(data, "bookingDate.iso")).format("YYYY/MM/DD")}`}
          &nbsp;
          {HELPER.formatTime(
            _get(data, "slot").toString().padStart(4, "0"),
            "HH:mm"
          )}
          &nbsp;~&nbsp;
          {HELPER.formatTime(
            _get(data, "expectedEndTime").toString().padStart(4, "0"),
            "HH:mm"
          )}
        </Typography>
      </Box>
      <div className="menu-detail-container">
        {_get(data, "menuBookings").map((itemMenu, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={6} sm={6}>
              {_get(itemMenu, "repeatType") && (
                <MenuTag type={_get(itemMenu, "repeatType")} />
              )}

              <Typography variant="subtitle2" component="span">
                {_get(itemMenu, "title")}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
              <div>{`${_get(itemMenu, "time")}`} 分</div>
            </Grid>
            <Grid item xs={3} sm={3}>
              ¥{`${HELPER.addCommaToString(_get(itemMenu, "price"))}`}
            </Grid>
          </Grid>
        ))}
        {isChangePrice && !hasChangeByAdmin && (
          <Grid container spacing={2}>
            <Grid item xs={8} sm={8}>
              <Typography variant="subtitle2" component="span">
                金額変更
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              {addPrice > 0
                ? `+¥${HELPER.addCommaToString(addPrice)}`
                : `-¥${HELPER.addCommaToString(addPrice * -1)}`}
            </Grid>
          </Grid>
        )}
        {penalty > 0 && status !== ALL_BOOKING_STATUS.DONE && (
          <Grid container spacing={2}>
            <Grid item xs={8} sm={8}>
              <Typography variant="subtitle2" component="span">
                {CANCEL_BEFORE_TEXT[cancelBefore]}
              </Typography>
            </Grid>
            <Grid item xs={4} sm={4}>
              {data.penalty * 100}%
            </Grid>
          </Grid>
        )}
      </div>
      <div className="total-container">
        {!(isCancelledByCustomer && penalty > 0) && (
          <Grid container spacing={2}>
            <Grid item xs={1} sm={5} className="label-container"></Grid>
            <Grid item xs={8} sm={4}>
              <Typography
                className="spend-time"
                variant="body1"
                component="span"
              >
                計{_get(data, "spendTime")}分
              </Typography>
              合計
            </Grid>
            <Grid item xs={3} sm={3}>
              ¥{HELPER.addCommaToString(totalPrice)}
            </Grid>
          </Grid>
        )}
        {hasChangeByAdmin && isChangePrice && (
          <Grid container spacing={2}>
            <Grid item xs={1} sm={6} className="label-container"></Grid>
            <Grid item xs={8} sm={3}>
              変更後価格・合計
            </Grid>
            <Grid item xs={3} sm={3}>
              ¥{HELPER.addCommaToString(totalPrice)}
            </Grid>
          </Grid>
        )}
        {useCoupon && (
          <Grid container spacing={2} className="use-coupon">
            <Grid item xs={1} sm={6} className="label-container"></Grid>
            <Grid item xs={8} sm={3}>
              <Typography className="title" variant="body1" component="span">
                クーポンコード割引
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
              <Typography className="values" variant="body1" component="span">
                -¥{HELPER.addCommaToString(_get(data, "coupon.value"))}
              </Typography>
            </Grid>
          </Grid>
        )}
        {usePoint && (
          <Grid container spacing={2} className="use-point">
            <Grid item xs={1} sm={6} className="label-container"></Grid>
            <Grid item xs={8} sm={3}>
              <Typography className="title" variant="body1" component="span">
                ポイント利用
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
              <Typography className="values" variant="body1" component="span">
                -
                {HELPER.addCommaToString(
                  _get(data, "bookingPointInfo.usePoint", 0)
                )}
                P
              </Typography>
            </Grid>
          </Grid>
        )}
        {isCancelledByCustomer && penalty > 0 && (
          <div className="cancel-detail-container">
            <div className="cancel-fee">
              <Grid container spacing={4}>
                <Grid item xs={2} sm={6} />
                <Grid item xs={7} sm={3} className="error-text">
                  キャンセル料
                </Grid>
                <Grid item xs={3} sm={3} className="error-text">
                  ¥{HELPER.addCommaToString(totalPrice)}
                </Grid>
              </Grid>
            </div>
          </div>
        )}
        {(useCoupon ||
          usePoint ||
          isCancelledByNailist ||
          isCancelledByCustomer ||
          _isEqual(ALL_BOOKING_STATUS.NAILIE_CANCELED, data.status)) && (
          <Grid
            container
            spacing={2}
            className={clsx("payment-amount", {
              "has-fee": penalty && penalty === 0.5,
            })}
          >
            <Grid item xs={1} sm={6} className="label-container"></Grid>
            <Grid item xs={8} sm={3}>
              <Typography className="title" variant="body1" component="span">
                お客様お支払額
              </Typography>
            </Grid>
            <Grid item xs={3} sm={3}>
              <Typography className="values" variant="body1" component="span">
                ¥{HELPER.addCommaToString(totalPayment)}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid container spacing={2}>
          <Grid item xs={2} sm={6} className="label-container"></Grid>
          <Grid item xs={7} sm={3} className="point-text">
            獲得予定ポイント
          </Grid>
          <Grid item xs={3} sm={3} className="point-text">
            {earnPoint >= 0
              ? HELPER.addCommaToString(
                  Math.floor(
                    totalPayment *
                      _get(data, "bookingPointInfo.pointBonusRate", 1) *
                      _get(data, "bookingPointInfo.earnPointRate", 1)
                  )
                )
              : 0}
            P
          </Grid>
          {[
            ALL_BOOKING_STATUS.CONFIRMED,
            ALL_BOOKING_STATUS.REQUESTED,
            ALL_BOOKING_STATUS.DONE,
          ].includes(status) && (
            <Grid item className="app-point-text underline-pri-text">
              {isMobile ? (
                <a
                  href={process.env.DOWNLOAD_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="point-text"
                >
                  ※ポイントはアプリでご利用いただけます
                </a>
              ) : (
                <InstallationPopupWrapper>
                  <a className="point-text pointer">
                    ※ポイントはアプリでご利用いただけます
                  </a>
                </InstallationPopupWrapper>
              )}
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default BookingInfo;
