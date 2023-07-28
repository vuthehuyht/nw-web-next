import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Modal from "@components/Modal";

const CancelPolicyModal = ({
  open,
  onClose,
  data = {},
  nailistAvatar,
  nailistUsername,
}) => {
  const { before1Day, onDay } = data;

  const renderPolicyExampleItem = (
    date,
    beforeDays,
    policyDayRate,
    opacityClassName = "",
    showArrow = true
  ) => (
    <Box className="example-item" display="flex" justifyContent="space-between">
      <Typography
        variant="subtitle2"
        className={`example-date ${opacityClassName}`}
      >
        {date}
      </Typography>
      <div className="example-incoming-days">
        <Typography variant="subtitle2" className={opacityClassName}>
          {beforeDays}
        </Typography>
        {showArrow && (
          <Box display="flex" justifyContent="center">
            <i className="icon-fill-arrow-down" />
          </Box>
        )}
      </div>
      <div className={`example-cancel-fee ${opacityClassName}`}>
        <Typography
          variant="subtitle2"
          className={policyDayRate === 1 ? "warning-text" : ""}
        >
          {policyDayRate
            ? `施術料金の${policyDayRate * 100}％`
            : "キャンセル料 0円"}
        </Typography>
      </div>
    </Box>
  );
  return (
    <Modal
      className="cancel-policy-modal"
      title="キャンセルポリシー"
      open={open}
      handleClose={onClose}
      maxWidth="md"
    >
      <Typography variant="subtitle2" align="center" className="note-text">
        予約確定後に、お客様都合でキャンセルする場合は下記の
        キャンセルポリシーに応じてキャンセル料が発生致します
      </Typography>
      <Box display="flex" justifyContent="center" className="nailist-avatar">
        <Avatar src={nailistAvatar} />
      </Box>
      <Typography variant="body1" align="center" className="nailist-name">
        {nailistUsername}さんのキャンセルポリシー
      </Typography>
      <Box className="policy-content">
        <Box
          display="flex"
          justifyContent="space-between"
          className="policy-item"
        >
          <Typography variant="subtitle2" align="center">
            （1）2日前までのキャンセル
          </Typography>
          <Typography variant="body1" align="center">
            0円
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          className="policy-item"
        >
          <Typography variant="subtitle2" align="center">
            （2）前日のキャンセル
          </Typography>
          <Typography
            variant="body1"
            align="center"
            className={before1Day ? "warning-text" : ""}
          >
            {before1Day ? `施術料金の${before1Day * 100}％` : "0円"}
          </Typography>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          className="policy-item"
        >
          <Typography variant="subtitle2" align="center">
            （3）当日のキャンセル
          </Typography>
          <Typography
            variant="body1"
            align="center"
            className={onDay ? "warning-text" : ""}
          >
            {onDay ? `施術料金の${onDay * 100}％` : "0円"}
          </Typography>
        </Box>
      </Box>
      <Box className="policy-example">
        <Typography variant="subtitle2" className="example-booking-date">
          例えば。4月15日の予約の場合
        </Typography>
        {renderPolicyExampleItem("4/13", "2日前", null, "medium-opacity")}
        {renderPolicyExampleItem("4/14", "1日前", before1Day, "light-opacity")}
        {renderPolicyExampleItem("4/15", "当日", onDay, null, false)}
      </Box>
    </Modal>
  );
};

export default CancelPolicyModal;
