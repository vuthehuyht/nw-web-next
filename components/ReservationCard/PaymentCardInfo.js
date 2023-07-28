import clsx from "clsx";
import Image from "next/image";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import moment from "moment";
import _get from "lodash/get";
import HELPER from "@utils/helper";
import { CARD_IMAGES } from "@utils/constants";

const METHOD = {
  ONLINE: "クレジットカード支払い",
  ATONE: "atone",
};

const PaymentCardInfo = ({ className, data }) => (
  <div className={clsx("payment-card-information", { [className]: className })}>
    <Grid container spacing={2} className="payment-card-row">
      <Grid item xs={4} sm={5}>
        <Typography variant="body1" component="span">
          支払い方法
        </Typography>
      </Grid>
      <Grid item xs={8} sm={7}>
        <Typography variant="body1" className="payment-type">
          {METHOD[data.paymentMethod] || "クレジットカード支払い"}
        </Typography>
      </Grid>
    </Grid>
    {data.last4 && (
      <Grid container spacing={2} className="payment-card-row">
        <Grid item xs={4} sm={5}>
          <Typography variant="body1" className="type-card">
            <span>お支払い情報</span>
            <Image
              width="46px"
              height="27px"
              alt=""
              src={CARD_IMAGES[data.brand] || "/assets/images/cards/other.svg"}
            />
          </Typography>
        </Grid>
        <Grid item xs={8} sm={7}>
          <Box display="flex" alignItems="center" className="card-info">
            <Image
              className="card-image"
              width="46px"
              height="27px"
              alt=""
              src={CARD_IMAGES[data.brand] || "/assets/images/cards/other.svg"}
            />
            <div className="card-number-date-container">
              <Typography variant="body2" className="card-number">
                {HELPER.getCardNumberText(data)}
              </Typography>
              <Typography variant="body2" className="card-expire-date">
                {moment(new Date(data.exp_year, data.exp_month - 1)).format(
                  "MM/YY"
                )}
              </Typography>
            </div>
          </Box>
        </Grid>
      </Grid>
    )}
    <Grid container spacing={2} className="payment-card-row">
      <Grid item xs={4} sm={5}>
        <Typography variant="body1" component="span">
          予約番号
        </Typography>
      </Grid>
      <Grid item xs={8} sm={7}>
        <Typography variant="body2" className="reservation-number">
          {_get(data, "objectId")}
        </Typography>
      </Grid>
    </Grid>
    {_get(data, "requestedDate.iso") && (
      <Grid container spacing={2} className="payment-card-row">
        <Grid item xs={4} sm={5}>
          <Typography variant="body1" component="span">
            予約リクエスト送信日
          </Typography>
        </Grid>
        <Grid item xs={8} sm={7}>
          <Typography variant="body2" className="request-date">
            {HELPER.formatDate(_get(data, "requestedDate.iso"), "YYYY/MM/DD")}
          </Typography>
        </Grid>
      </Grid>
    )}
    {_get(data, "cancelFree") && (
      <Grid container spacing={2} className="payment-card-row">
        <Grid item xs={4} sm={5}>
          <Typography variant="body1" component="span">
            キャンセル料発生日
          </Typography>
        </Grid>
        <Grid item xs={8} sm={7}>
          <Typography variant="body2" className="cancel-date">
            {_get(data, "cancelFree")}
          </Typography>
        </Grid>
      </Grid>
    )}
  </div>
);

export default PaymentCardInfo;
