import QRCode from "qrcode.react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import Title from "@components/Title";

const Request = () => {
  const { push } = useRouter();
  return (
    <div className="request-complete box-complete">
      <Title
        title="Request completed!"
        japanese="リクエスト完了"
        positionClass="center"
        className="title"
      />
      <div className="inner-wrapper">
        <Typography variant="h5" className="first-heading">
          予約リクエストが送信されました！
        </Typography>
        <Typography className="second-heading" color="secondary">
          予約はまだ確定していません
        </Typography>
        <Box display="flex" justifyContent="center" className="image-box">
          <img src="/assets/images/request-complete@2x.png" alt="" />
        </Box>
        <Typography
          variant="body1"
          className="first-pink-text note-text"
          color="secondary"
        >
          <strong>このネイリストは予約リクエスト制です</strong>
        </Typography>
        <Typography variant="h5" className="first-note note-text">
          ネイリストがリクエストを承認すると予約が確定します。
          <br />
          ネイリストからの返答やメッセージが届いた際は、
          <br />
          ご登録のアドレス宛にメールにてお知らせいたします。
          <br />
        </Typography>
        <Box marginTop="8px">
          <Typography color="secondary" className="note-text">
            <strong>
              メッセージのやりとりはアプリより行っていただけます。
            </strong>
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            type="link"
            target="_blank"
            rel="noopener noreferrer"
            href={process.env.DOWNLOAD_APP_URL}
            variant="contained"
            color="secondary"
          >
            アプリを開く
          </Button>
        </Box>
        <div className="qr-code">
          <QRCode value={process.env.DOWNLOAD_APP_URL} size={143} />
        </div>
        <Typography variant="body2" className="normal-text">
          ※インストール後、ログインでご利用いただけます
        </Typography>
      </div>
      <Box paddingTop="24px">
        <Typography
          className="underline-pri-text pointer"
          color="primary"
          onClick={() => push("/")}
        >
          <strong>TOPに戻る</strong>
        </Typography>
      </Box>
    </div>
  );
};

export default Request;
