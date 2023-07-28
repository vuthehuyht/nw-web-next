import PropTypes from "prop-types";
import Image from "next/image";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Modal from "@components/Modal";

const AddCardGuideline = ({ open, onClose }) => (
  <Modal
    className="add-card-guideline-modal"
    title="カード決済は施術が終わった後に行われます"
    open={open}
    handleClose={onClose}
    maxWidth="md"
  >
    <Box display="flex" justifyContent="center">
      <Image
        width="80px"
        height="80px"
        src="/assets/images/cards/guide-card.svg"
      />
    </Box>
    <Typography variant="body1" align="center" className="question-guide">
      カード決済はいつされるのか?
    </Typography>
    <Box className="guide-content">
      <Box className="guide-content-item">
        <Image
          width={56}
          height={56}
          layout="fixed"
          src="/assets/images/cards/request-guide.svg"
        />
        <Box className="guide-text">
          <Typography variant="body1" className="question-guide">
            予約リクエストをするときカード決済はされません
          </Typography>
          <Typography variant="body2" className="answer-guide">
            予約リクエストを送るときは「このクレジットカードが使えるか」のチェックをしています。
            <span className="highlight-guide">
              施術が終わるまでは決済されることはありません。
            </span>
            ご安心ください。
          </Typography>
        </Box>
      </Box>
      <Box className="guide-content-item">
        <Image
          width="56px"
          height="56px"
          layout="fixed"
          src="/assets/images/cards/complete-guide.svg"
        />
        <Box className="guide-text">
          <Typography variant="body1" className="question-guide">
            施術が終わったあとカード決済が行われます
          </Typography>
          <Typography variant="body2" className="answer-guide">
            施術が終わると、ネイリストのアカウントにお会計ボタンが出現します。ネイリストが施術料金を入力して、
            <span className="highlight-guide">
              お会計ボタンを押すとクレジットカードの決済が行われます。
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
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

AddCardGuideline.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default AddCardGuideline;
