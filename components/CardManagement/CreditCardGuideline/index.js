import PropTypes from "prop-types";
import Image from "next/image";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Modal from "@components/Modal";

const CreditCardGuideline = ({ open, onClose }) => (
  <Modal
    className="credit-card-guideline-modal"
    title="クレジットカードをお持ちでない方"
    open={open}
    handleClose={onClose}
    maxWidth="md"
  >
    <Box className="subtitle-container">
      <Typography variant="body1" align="center" className="subtitle">
        クレジットカード以外のカードも使えます
      </Typography>
    </Box>
    <Grid container justifyContent="center" className="guide-content">
      <Grid item xs={12} sm={6} lg={6} className="left-guide-content">
        <div className="image-guide-content">
          <Typography variant="body1" align="center">
            クレジットカード以外でも
          </Typography>
          <Grid container>
            <Grid item xs={6} sm={6} lg={6}>
              <img
                width="80px"
                height="80px"
                src="/assets/images/cards/non-card-1.svg"
              />
              <Typography variant="body1" align="center">
                デビットカード
              </Typography>
            </Grid>
            <Grid item xs={6} sm={6} lg={6}>
              <img
                width="80px"
                height="80px"
                src="/assets/images/cards/non-card-2.svg"
              />
              <Typography variant="body1" align="center">
                プリペードカード?
              </Typography>
            </Grid>
          </Grid>
          <Box marginTop="40px">
            <Typography variant="body1" align="center" className="subtitle">
              がご利用いただけます
            </Typography>
          </Box>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} lg={6} className="right-guide-content">
        <Box className="guide-content-item" display="flex">
          <Image
            width="40px"
            height="40px"
            layout="fixed"
            src="/assets/images/cards/non-card-1.svg"
          />
          <Box className="guide-text">
            <Typography variant="body1" className="question-guide">
              デビットカードとは？
            </Typography>
            <Typography variant="body2">
              銀行口座にひもづいたカードで、お買いものなどで支払いをした際に銀行口座からすぐに引き落としされることが特長のカードです。学生の方でもご利用いただけるカードです。
            </Typography>
            <Typography variant="body2" className="highlight-guide">
              ※15歳以上の方がご利用いただけます。
            </Typography>
          </Box>
        </Box>
        <Box className="guide-content-item" display="flex">
          <Image
            width="40px"
            height="40px"
            layout="fixed"
            src="/assets/images/cards/non-card-2.svg"
          />
          <Box className="guide-text">
            <Typography variant="body1" className="question-guide">
              プリペイドカードとは？
            </Typography>
            <Typography variant="body2">
              あらかじめカードに現金をチャージしておいて、その範囲内でクレジットカードと同じようにお支払い時に利用できるカードです。
            </Typography>
            <Typography variant="body2" className="highlight-guide">
              年齢制限はなく学生の方でもご利用いただけるカードです。
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
    <Box
      display="flex"
      justifyContent="center"
      marginTop="32px"
      className="btn-container"
    >
      <Button variant="contained" color="secondary" onClick={onClose}>
        OK
      </Button>
    </Box>
  </Modal>
);

CreditCardGuideline.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default CreditCardGuideline;
