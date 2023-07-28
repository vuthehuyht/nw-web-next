import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";

import Title from "components/Title";
import helper from "utils/helper";

const Reservation = ({ nailistAvatar, bookingDate, bookingSlot }) => {
  const { push } = useRouter();

  return (
    <div className="reservation-complete box-complete">
      <Title
        title="Reservation is confirmed!"
        japanese="予約完了"
        positionClass="center"
        className="title"
      />
      <div className="inner-wrapper">
        <div className="content">
          <Typography className="second-heading" color="secondary">
            予約が完了しました！
          </Typography>
          <Avatar alt="avatar" src={nailistAvatar} className="avatar" />
          <Typography variant="body2" className="note">
            ご予約日時
          </Typography>
          <Typography variant="h5" className="first-note">
            {`${helper.formatDate(
              bookingDate,
              "MM/DD（ddd）"
            )}${helper.formatTime(
              `000${bookingSlot}`.slice(`000${bookingSlot}`.length - 4),
              "HH:mm"
            )}〜`}
          </Typography>
          <Typography className="note-text">
            <strong>
              ネイリストからメッセージが届いた際は、
              <br />
              ご登録のアドレス宛にメールにてお知らせいたします。
            </strong>
          </Typography>
          <Box marginTop="8px">
            <Typography className="pc-note" variant="h5" color="secondary">
              メッセージのやりとりはアプリより行っていただけます。
              <br />
              アプリインストールはこちら↓
            </Typography>
            <Typography
              className="mobile-note"
              variant="body2"
              color="secondary"
            >
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
          <Typography variant="body2" align="center" className="normal-text">
            ※インストール後、ログインでご利用いただけます
          </Typography>
        </div>
      </div>
      <Box padding="24px 0px" display="flex" justifyContent="center">
        <Typography
          component="span"
          className="underline-pri-text pointer"
          color="primary"
          variant="body2"
          onClick={() => push("/")}
        >
          <strong>TOPに戻る</strong>
        </Typography>
      </Box>
    </div>
  );
};

export default Reservation;
