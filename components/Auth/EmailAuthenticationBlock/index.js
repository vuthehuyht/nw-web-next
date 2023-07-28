import { useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useSpecificPageViewEvent } from "hooks";

const EmailAuhthenticationBlock = (props) => {
  const {
    email,
    onResend,
    onConfirm,
    onEdit,
    editText = "メールアドレスを編集する",
  } = props;
  const { trackEvent } = useSpecificPageViewEvent();

  useEffect(() => {
    trackEvent({ event: "signup_email_input" });
  }, []);
  return (
    <div className="register--email-authentication">
      <div className="helper-text">
        <Typography
          variant="body2"
          color="textPrimary"
          align="center"
          className="helper-text"
        >
          {`${email} にメールを送信しました。 メールを開いて認証を完了させてください\n
          ※メールが届かない場合は、メールアドレスが正しいことを 確認し、 迷惑フォルダ内もご確認ください。 それでも確認できない場合はメールを再送し再度お試しく ださい。`}
        </Typography>
      </div>
      <Box
        display="flex"
        justifyContent="center"
        marginTop="32px"
        className="ghost-btn-container"
      >
        <Button className="ghost-secondary-btn" onClick={onResend}>
          メールを再送信
        </Button>
        <Button className="ghost-secondary-btn" onClick={onEdit}>
          {editText}
        </Button>
      </Box>
      <Typography
        className="confirm-text"
        variant="body2"
        color="primary"
        align="center"
        onClick={onConfirm}
      >
        認証を確認する
      </Typography>
    </div>
  );
};

EmailAuhthenticationBlock.propTypes = {
  email: PropTypes.string.isRequired,
  onResend: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  editText: PropTypes.string,
};

export default EmailAuhthenticationBlock;
