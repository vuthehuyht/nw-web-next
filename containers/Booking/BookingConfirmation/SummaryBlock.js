import { memo } from "react";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core//Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import _get from "lodash/get";
import moment from "moment";
import NailistTag from "components/Booking/NailistTag";
import MenuTag from "components/Booking/BookingMenus/MenuTag";
import helper from "@utils/helper";
import BookingUtil from "@utils/bookingUtil";

const SummaryBlock = ({
  nailistAvatar,
  nailistUsername,
  allNailistMenus = {},
  menuBookings = [],
  bookingCalculation = {},
  bookingDate,
  bookingSlot,
  coupon,
}) => {
  const {
    totalPrice,
    earnPointRate,
    spendTime,
    bonusPointRate = 1,
  } = bookingCalculation;
  const { totalPayment } = BookingUtil.getPaymentPrice({
    coupon,
    price: totalPrice,
  });
  const formatBookingSlot = `000${bookingSlot}`.slice(
    `000${bookingSlot}`.length - 4
  );
  const flatMenuBookings = [].concat(
    ...menuBookings.map((menu) => Object.values(menu))
  );
  return (
    <div className="summary-container">
      <div className="nailist-detail-container">
        <div className="avatar-container">
          <Avatar src={nailistAvatar} />
          {bonusPointRate === 10 && <NailistTag />}
        </div>
        <Typography variant="h5">{nailistUsername}</Typography>
      </div>
      <div className="booking-information-container">
        <div className="booking-menus-detail">
          {bookingDate && (
            <Box display="flex" className="booking-date-container">
              <i className="icon-calendar" />
              <Typography variant="body2">
                {`${moment(
                  `${bookingDate} ${formatBookingSlot}`,
                  "YYYY-MM-DD HHmm"
                ).format("YYYY/MM/DD HH:mm")} ~ ${moment(
                  formatBookingSlot,
                  "HHmm"
                )
                  .add(spendTime, "m")
                  .format("HH:mm")}`}
              </Typography>
            </Box>
          )}
          {flatMenuBookings.map((menuId, index) => {
            const bookingMenu = allNailistMenus[menuId];
            return (
              <Grid container spacing={2} key={index}>
                <Grid item xs={6} sm={6}>
                  {_get(bookingMenu, "repeatType") && (
                    <MenuTag type={_get(bookingMenu, "repeatType")} />
                  )}

                  <Typography variant="subtitle2" component="span">
                    {_get(bookingMenu, "title")}
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                  <div>{`${_get(bookingMenu, "time")}`} 分</div>
                </Grid>
                <Grid item xs={3} sm={3}>
                  ¥{`${helper.addCommaToString(_get(bookingMenu, "price"))}`}
                </Grid>
              </Grid>
            );
          })}
        </div>
        <div className="booking-price-container">
          <Grid container spacing={2}>
            <Grid item xs={2} sm={6} className="label-container"></Grid>
            <Grid item xs={7} sm={3}>
              <Typography
                className="spend-time"
                variant="body1"
                component="span"
              >
                計{spendTime}分
              </Typography>
              合計
            </Grid>
            <Grid item xs={3} sm={3}>
              ¥{helper.addCommaToString(totalPrice)}
            </Grid>
          </Grid>
          {coupon && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={1} sm={6}></Grid>
                <Grid item xs={8} sm={3}>
                  <Typography
                    className="point-text"
                    variant="body1"
                    component="span"
                  >
                    <strong>クーポンコード割引</strong>
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                  <Typography
                    className="point-text"
                    variant="body1"
                    component="span"
                  >
                    <strong>
                      -¥{helper.addCommaToString(_get(coupon, "value"))}
                    </strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} className="payment-amount">
                <Grid item xs={1} sm={6}></Grid>
                <Grid item xs={8} sm={3}>
                  <Typography
                    className="point-text"
                    variant="body1"
                    component="span"
                  >
                    <strong>お客様お支払額</strong>
                  </Typography>
                </Grid>
                <Grid item xs={3} sm={3}>
                  <Typography
                    className="point-text"
                    variant="body1"
                    component="span"
                  >
                    <strong>¥{helper.addCommaToString(totalPayment)}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
          <Grid container spacing={2}>
            <Grid item xs={2} sm={6} className="label-container"></Grid>
            <Grid item xs={7} sm={3} className="point-text">
              獲得予定ポイント
            </Grid>
            <Grid item xs={3} sm={3} className="point-text">
              {Math.floor(totalPayment * bonusPointRate * earnPointRate)}P
            </Grid>
            <Grid item className="point-text app-point-text">
              ※ポイントはアプリでご利用いただけます
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default memo(SummaryBlock);
