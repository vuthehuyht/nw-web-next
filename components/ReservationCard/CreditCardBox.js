import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import { CARD_IMAGES } from "@utils/constants";

const CreditCardBox = ({ defaultCard }) => (
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
            CARD_IMAGES[defaultCard.brand] || "/assets/images/cards/other.svg"
          }
        />
        <div className="card-number-date-container">
          <Typography variant="body2" className="card-number">
            **** **** **** {defaultCard.last4}
          </Typography>
          <Typography variant="body2" className="card-expire-date">
            {moment(
              new Date(defaultCard.exp_year, defaultCard.exp_month - 1)
            ).format("MM/YY")}
          </Typography>
        </div>
      </Box>
    </div>
  </div>
);

export default CreditCardBox;
