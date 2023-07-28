import { Button, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import moment from "moment";
import Box from "@material-ui/core/Box";

import OtpInput from "components/OtpInput";

const OtpBlock = ({
  onVerifyOtp,
  onResendOtp,
  timeLeft,
  otp,
  onEditPhoneNumber,
}) => (
  <div className="sms-auth--otp">
    <Typography
      variant="body2"
      color="textPrimary"
      align="center"
      className="helper-text"
    >
      {`SMSで届いた認証番号を入力してください。\n
          ※認証が確認できない場合は、番号が正しいことを確認し、コードの再送をお試しください。`}
    </Typography>
    <Box display="flex" justifyContent="center" marginTop="32px">
      <OtpInput
        isInputNum
        containerStyle="otp-input-container"
        className="otp-input"
        value={otp}
        onChange={onVerifyOtp}
        numInputs={6}
      />
    </Box>
    <Box
      display="flex"
      justifyContent="center"
      marginTop="28px"
      className="ghost-btn-container"
      flexWrap="wrap"
    >
      <Button className="ghost-secondary-btn" onClick={onResendOtp}>
        {timeLeft === 0
          ? "コードを再送信"
          : moment.utc(timeLeft).format("mm:ss")}
      </Button>
      <Button className="ghost-secondary-btn" onClick={onEditPhoneNumber}>
        電話番号を編集
      </Button>
    </Box>
  </div>
);

OtpBlock.propTypes = {
  onVerifyOtp: PropTypes.func.isRequired,
  onResendOtp: PropTypes.func.isRequired,
  timeLeft: PropTypes.number.isRequired,
  otp: PropTypes.string.isRequired,
  onEditPhoneNumber: PropTypes.func.isRequired,
};

export default OtpBlock;
