import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import moment from "moment";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import Typography from "@material-ui/core/Typography";
import renderHTML from "react-render-html";

const ReviewInfo = ({ className, data, dataClient, dataNailist }) => (
  <div className={clsx("review-information", { [className]: className })}>
    <Box className="avarage-rating">
      <Typography component="h3">総合評価</Typography>
      <i className="icon-star" />
      <span>{data.averageRating}</span>
    </Box>
    <Box className="point-rating">
      <Box display="flex" alignItems="center">
        <Typography className="point-title" component="p">
          技術
        </Typography>
        <span className="point">{data.skillsRating}</span>
        <span>点</span>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography className="point-title" component="p">
          接客
        </Typography>
        <span className="point">{data.serviceRating}</span>
        <span>点</span>
      </Box>
      <Box display="flex" alignItems="center">
        <Typography className="point-title" component="p">
          価格
        </Typography>
        <span className="point">{data.priceRating}</span>
        <span>点</span>
      </Box>
    </Box>
    <Box className="dark-box">
      <Box className="client-info">
        <Box display="flex" alignItems="center">
          {_isEqual(_get(dataClient, "status"), "INACTIVE") ? (
            <Avatar className="user-avatar" src="" alt="退会済みユーザー" />
          ) : (
            <Avatar
              className="user-avatar"
              src={dataClient.avatar}
              alt={dataClient.fullName}
            />
          )}
          <Typography className="user-name" component="h3">
            {dataClient.username}
          </Typography>
          <Typography className="create-date" component="p">
            {moment(_get(data, "createdAt.iso")).format("YYYY/MM/DD")}
          </Typography>
        </Box>
        <Typography className="comment-info" component="p">
          {renderHTML(data.comment)}
        </Typography>
      </Box>
      {_get(data, "nailistComment") && (
        <Box className="nailist-info">
          <Box display="flex" alignItems="center">
            {_isEqual(_get(dataNailist, "status"), "INACTIVE") ? (
              <Avatar className="user-avatar" src="" alt="退会済みユーザー" />
            ) : (
              <Avatar
                className="user-avatar"
                src={dataNailist.avatar}
                alt={dataNailist.fullName || dataNailist.username}
              />
            )}
            <Typography className="user-name" component="h3">
              {dataNailist.username}
            </Typography>
            <Typography className="create-date" component="p">
              {moment(_get(data, "nailistCommentAt.iso")).format("YYYY/MM/DD")}
            </Typography>
          </Box>
          <Typography className="comment-info" component="p">
            {renderHTML(data.nailistComment)}
          </Typography>
        </Box>
      )}
    </Box>
  </div>
);

export default ReviewInfo;
