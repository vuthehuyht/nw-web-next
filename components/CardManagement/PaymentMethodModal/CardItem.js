import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Image from "next/image";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CARD_IMAGES } from "@utils/constants";
import helper from "@utils/helper";

const CardItem = ({
  data,
  selectedCard,
  onDeleteCard,
  showDeleteBtn = true,
}) => (
  <Box className="card-item-container">
    <FormControlLabel
      value={data.id}
      label={
        <Box
          className={`card-info ${
            selectedCard !== data.id ? "unchecked-card" : ""
          }`}
        >
          <Image
            width="46px"
            height="27px"
            alt=""
            src={CARD_IMAGES[data.brand] || "/assets/images/cards/other.svg"}
          />
          <div className="card-number-date-container">
            <Typography variant="body2" className="card-number">
              {helper.getCardNumberText(data)}
            </Typography>
            <Typography variant="body2" className="card-expire-date">
              {moment(new Date(data.exp_year, data.exp_month - 1)).format(
                "MM/YY"
              )}
            </Typography>
          </div>
        </Box>
      }
      control={
        <Radio icon={<div />} checkedIcon={<i className="icon-check" />} />
      }
    />
    {showDeleteBtn && (
      <IconButton className="delete-btn" onClick={onDeleteCard}>
        <i className="icon-trash" />
      </IconButton>
    )}
  </Box>
);

CardItem.propTypes = {
  onDeleteCard: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  selectedCard: PropTypes.string,
  showDeleteBtn: PropTypes.bool,
};

export default CardItem;
