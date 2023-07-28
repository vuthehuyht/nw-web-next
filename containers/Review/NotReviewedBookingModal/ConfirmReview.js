import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import _isEmpty from "lodash/isEmpty";
import _invoke from "lodash/invoke";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles(() => ({
  contentWrapper: {
    maxWidth: 346,
    margin: "0 auto",
  },
  nailistInfo: {
    "@media (max-width: 600px)": {
      display: "block",
      marginTop: 24,
    },
  },
  username: {
    "@media (max-width: 600px)": {
      marginTop: 8,
    },
  },
  avatar: {
    width: 48,
    height: 48,
  },
  rating: {
    marginLeft: 8,
    "& .MuiRating-decimal": {
      marginLeft: 2,
      "& label": {
        "& i": {
          fontSize: 16,
          color: "#ffbd00",
        },
      },
    },
  },
}));

const ConfirmReviewModal = ({
  avatar,
  username,
  commentDate,
  comment,
  averageRating,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.contentWrapper}>
      <Typography variant="subtitle2">
        こちらの内容でレビューを投稿しますか？
      </Typography>
      <Box display="flex" marginTop="32px" className={classes.nailistInfo}>
        <Box display="flex" alignItems="center" marginRight="16px">
          <Avatar
            alt="avatar"
            src={
              _isEmpty(avatar) ? "/assets/images/default_avatar.svg" : avatar
            }
            className={classes.avatar}
          />
          <Rating
            className={classes.rating}
            disabled
            value={averageRating}
            icon={<i className="icon-big-star" />}
            emptyIcon={<i className="icon-outline-star" />}
            max={5}
            precision={0.1}
          />
        </Box>
        <Box display="flex" alignItems="center" className={classes.username}>
          <Typography variant="subtitle2">
            {username} - {commentDate}
          </Typography>
        </Box>
      </Box>
      {_invoke(comment, "trim") && (
        <Box display="flex" marginTop="32px">
          <Typography variant="subtitle2" align="left">
            {comment}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ConfirmReviewModal;
