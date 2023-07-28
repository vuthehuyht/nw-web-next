import Box from "@material-ui/core/Box";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    imageStyle: {
      maxWidth: 600,
      width: "100%",
    },
    linkButton: {
      position: "absolute",
      width: "40%",
      height: "43%",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      "-ms-transform": "translate(-50%, -50%)",
    },
  })
);

const BHappyCampaignPage = () => {
  const classes = useStyles();

  return (
    <div>
      <Box
        bgcolor="#fce6e8"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          className={classes.imageStyle}
          alt="bhappy"
          src="https://d1qyhbwogwcazp.cloudfront.net/d77a416d0d11c2efb5f1f5dfec058ab5_20211216_Bhappy_merumagaB__01.jpg"
        />
        <Box position="relative">
          <img
            className={classes.imageStyle}
            alt="bhappy"
            src="https://d1qyhbwogwcazp.cloudfront.net/355f27614f2cf1bf5eb2f9eade596412_20211216_Bhappy_merumagaB__02.jpg"
          />
          <a
            className={classes.linkButton}
            href="https://mtg-pro.co.jp/bhappy/lp_nail/?utm_source=nailie_app_page&utm_medium=app&utm_campaign=nail&utm_term=a"
            target="_blank"
            rel="noreferrer"
          />
        </Box>
        <img
          className={classes.imageStyle}
          alt="bhappy"
          src="https://d1qyhbwogwcazp.cloudfront.net/dd82daaf0c7da74eaec23daff35cd327_20211216_Bhappy_merumagaB__03.jpg"
        />
        <Box position="relative">
          <img
            className={classes.imageStyle}
            alt="bhappy"
            src="https://d1qyhbwogwcazp.cloudfront.net/a374b4bfe50f3d27a1d275a1c1d69142_20211216_Bhappy_merumagaB__04.jpg"
          />
          <a
            className={classes.linkButton}
            href="https://mtg-pro.co.jp/bhappy/lp_nail/?utm_source=nailie_app_page&utm_medium=app&utm_campaign=nail&utm_term=b"
            target="_blank"
            rel="noreferrer"
          />
        </Box>
        <img
          className={classes.imageStyle}
          alt="bhappy"
          src="https://d1qyhbwogwcazp.cloudfront.net/e84a4e98c917794c989183cd7ff128bd_20211216_Bhappy_merumagaB__05.jpg"
        />
        <img
          className={classes.imageStyle}
          alt="bhappy"
          src="https://d1qyhbwogwcazp.cloudfront.net/56f16fcdc76955886172bbb1d8237f3d_20211216_Bhappy_merumagaB__06.jpg"
        />
        <Box position="relative">
          <img
            className={classes.imageStyle}
            alt="bhappy"
            src="https://d1qyhbwogwcazp.cloudfront.net/e0a7efdcbfb62bcb73cb1ed04e922c25_20211216_Bhappy_merumagaB__07.jpg"
          />
          <a
            className={classes.linkButton}
            href="https://mtg-pro.co.jp/bhappy/lp_nail/?utm_source=nailie_app_page&utm_medium=app&utm_campaign=nail&utm_term=c"
            target="_blank"
            rel="noreferrer"
          />
        </Box>
        <img
          className={classes.imageStyle}
          alt="bhappy"
          src="https://d1qyhbwogwcazp.cloudfront.net/f9d9110f6f075c4f67a6d49edc9aa2cd_20211216_Bhappy_merumagaB__08.jpg"
        />
      </Box>
    </div>
  );
};

export default BHappyCampaignPage;
