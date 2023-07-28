import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { PAYMENT_PROVIDER } from "@utils/constants";
import BankTransferContent from "@components/ReservationCard/BankTransferContent";

const BankTransfer = ({ provider, onChangeProvider }) => (
  <Box className="payment-method-container bank-transfer-container">
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className="title"
    >
      <FormControlLabel
        label={<Typography variant="body2">銀行振込</Typography>}
        value={provider}
        control={
          <Checkbox
            icon={<i className="icon-uncheck" style={{ fontSize: 32 }} />}
            checkedIcon={<i className="icon-round-checked" />}
            onChange={onChangeProvider}
            checked={provider === PAYMENT_PROVIDER.BANK_TRANSFER}
            color="default"
          />
        }
      />
    </Box>
    {provider === PAYMENT_PROVIDER.BANK_TRANSFER && <BankTransferContent />}
  </Box>
);

export default BankTransfer;
