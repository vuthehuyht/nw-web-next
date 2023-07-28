import Router from "next/router";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const isProduction = process.env.DEPLOY_ENV === "production";

const FriendInvitePage = ({ role }) => {
  const NailieContent = () => (
    <Box className={`friend-invite-box ${role}`}>
      <Typography align="center" variant="h5" className="friend-invite-title">
        <strong>
          期間中にお客様を招待して
          <br />
          クーポンをプレゼントしよう！
        </strong>
      </Typography>
      <img alt="招待" src="/assets/images/friend-invite@2x.png" />
      <div className="friend-invite-text">
        <Typography variant="subtitle2">
          <strong>
            お客様が<span>初回予約時</span>に<br />
            あなたの招待クーポンを入力すると
            <br />
            <span>2,000円分のクーポン</span>をプレゼント！
          </strong>
        </Typography>
        <Typography variant="caption">
          ※キャンペーン期間: ~2023年5月31日まで
        </Typography>
        <Typography variant="caption">
          ※クーポン割引分の金額はネイリーが負担します
        </Typography>
        <Typography variant="caption">※クーポンは1000円x2枚です</Typography>
      </div>
    </Box>
  );

  const CustomeContent = () => (
    <Box className={`friend-invite-box ${role}`}>
      <Typography align="center" variant="h5" className="friend-invite-title">
        <strong>
          期間中、あなたにも友だちにも
          <br />
          2,000円分の割引をプレゼント！
        </strong>
      </Typography>
      <Typography align="center" className="friend-invite-sub-title">
        ※キャンペーン期間: ~2023年5月31日まで
      </Typography>
      <img alt="招待" src="/assets/images/friend-invite@2x.png" />
      <div className="list-friend-invite-text">
        <div className="friend-invite-text">
          <Box className="mask-number">1</Box>
          <div className="content">
            <Typography variant="subtitle2" className="first-title">
              <strong>友だちに招待クーポンを送る</strong>
            </Typography>
            <Typography variant="subtitle2">
              <strong>
                友だちが<span>初回予約時</span>
                に招待クーポンを発行すると、
                <br />
                友だちに<span>2,000円分のクーポン</span>をプレゼント！
              </strong>
            </Typography>
            <Typography variant="caption">※クーポンは1000円x2枚です</Typography>
          </div>
        </div>
        <div className="friend-invite-text">
          <Box className="mask-number">2</Box>
          <div className="content">
            <Typography variant="subtitle2" className="first-title">
              <strong>2000ポイントをGET</strong>
            </Typography>
            <Typography variant="subtitle2">
              <strong>
                友だちが初回予約<span>（決済まで）</span>を完了すると、
                <br />
                あなたに<span>2000ポイント</span>をプレゼント！
              </strong>
            </Typography>
          </div>
        </div>
      </div>
      <div className="link-wrap">
        <a
          href={
            isProduction
              ? `https://nailie.jp/campaigns/x3WROFU6fg`
              : `https://nwa.scrum-dev.com/campaigns/x3WROFU6fg`
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          友だち招待クーポンの詳細はこちら
          <img src="/assets/images/graphics-link.svg" alt="" />
        </a>
      </div>
    </Box>
  );

  return (
    <>
      {role === "NAILIST" && NailieContent()}
      {role === "CUSTOMER" && CustomeContent()}
    </>
  );
};

FriendInvitePage.getInitialProps = async ({ res, query }) => {
  if (!query.role || !query.invitationCode) {
    // if not has query params, show the same as before
    if (res) {
      res.writeHead(307, { Location: "/downloads" });
      res.end();
    } else {
      Router.replace("/downloads");
    }
  }
  return { ...query };
};

export default FriendInvitePage;
