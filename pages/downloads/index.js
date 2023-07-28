import { Typography, Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { useRouter } from "next/router";
import QRCode from "qrcode.react";
import Layout from "components/Layout";

const DownloadPage = () => {
  const { push } = useRouter();
  return (
    <Layout>
      <div className="download-page">
        <Box className="download-box">
          <img alt="error" src="/assets/images/empty-state-error.svg" />
          <Box>
            <Typography variant="body2">ページが見つかりません</Typography>
          </Box>
          <Box className="support-text">
            <Typography variant="body2" align="center">
              この機能はまだウェブ上での使用がサポートされていません。サービスを継続して使用できるようにするには、指示に従ってアプリをダウンロードしてください↓
            </Typography>
          </Box>
          <Box className="download-content">
            <Box display="flex">
              <img
                alt="logo"
                className="nailie-logo"
                src="/assets/images/logo-n-black.svg"
              />
              <div>
                <Typography className="download-title">
                  <strong>Nailie (ネイリー) - ネイル予約</strong>
                </Typography>
                <Typography variant="body2">アプリを続行します</Typography>
              </div>
            </Box>
            <Divider />
            <div className="qr-code">
              <QRCode value={process.env.DOWNLOAD_APP_URL} size={143} />
            </div>
          </Box>
          <Box paddingTop="24px">
            <Typography
              className="underline-pri-text pointer"
              color="primary"
              onClick={() => push("/")}
            >
              <strong>TOPに戻る</strong>
            </Typography>
          </Box>
        </Box>
      </div>
    </Layout>
  );
};

export default DownloadPage;
