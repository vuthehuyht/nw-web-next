import { useState } from "react";
import PropTypes from "prop-types";
import dynamic from "next/dynamic";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import _isEmpty from "lodash/isEmpty";
import RadioGroup from "@material-ui/core/RadioGroup";
import { CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { PAYMENT_PROVIDER } from "@utils/constants";
import CardItem from "./CardItem";

const CreditCardGuide = dynamic(() => import("../CreditCardGuideline"));

const CardList = ({
  onDeleteCard,
  onShowAddCard,
  list = [],
  selectedCard,
  onChange,
  loading,
  provider,
  onChangeProvider,
  showDeleteBtn = true,
  showNoteText = true,
}) => {
  const [openCardGuide, setOpenCardGuide] = useState(false);

  const handleCloseCardGuide = () => {
    setOpenCardGuide(false);
  };
  return (
    <Box className="card-list-container payment-method-container">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        className="title"
      >
        <FormControlLabel
          label={
            <Typography variant="body2">クレジットカード支払い</Typography>
          }
          value={PAYMENT_PROVIDER.CREDIT_CARD}
          control={
            <Checkbox
              icon={<i className="icon-uncheck" style={{ fontSize: 32 }} />}
              checkedIcon={<i className="icon-round-checked" />}
              onChange={onChangeProvider}
              checked={provider === PAYMENT_PROVIDER.CREDIT_CARD}
              color="default"
            />
          }
        />
        <IconButton onClick={() => setOpenCardGuide(true)}>
          <i className="icon-question" />
        </IconButton>
      </Box>
      {provider === PAYMENT_PROVIDER.CREDIT_CARD && (
        <>
          <RadioGroup
            aria-label="card-provider"
            name="provider"
            value={selectedCard}
            onChange={onChange}
          >
            {loading && _isEmpty(list) && (
              <div className="loading-container">
                <CircularProgress size={40} />
              </div>
            )}
            {list.map((item) => (
              <CardItem
                key={item.id}
                data={item}
                selectedCard={selectedCard}
                showDeleteBtn={showDeleteBtn}
                onDeleteCard={() => onDeleteCard(item)}
              />
            ))}
          </RadioGroup>

          <Box className="add-card-text-container" onClick={onShowAddCard}>
            <i className="icon-outline-add" />
            <Typography variant="body2" color="primary">
              新しいクレジットカードを登録
            </Typography>
          </Box>
        </>
      )}
      {showNoteText && (
        <Typography
          align="center"
          variant="body2"
          color="secondary"
          className="note-text"
        >
          ＊ご予約時に与信枠（お支払い枠）を確保し、
          <br />
          施術後に決済が行われます。
          <br />
          ※当日の金額変更も可能です。
        </Typography>
      )}
      {openCardGuide && (
        <CreditCardGuide open={openCardGuide} onClose={handleCloseCardGuide} />
      )}
    </Box>
  );
};

CardList.propTypes = {
  onDeleteCard: PropTypes.func,
  list: PropTypes.array.isRequired,
  showDeleteBtn: PropTypes.bool,
  onShowAddCard: PropTypes.func,
  selectedCard: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  loading: PropTypes.func,
  provider: PropTypes.string,
  onChangeProvider: PropTypes.func,
};

export default CardList;
