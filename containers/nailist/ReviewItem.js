import PropTypes from "prop-types";
import _get from "lodash/get";
import moment from "moment";
import Rating from "@material-ui/lab/Rating";

function ReviewItem({ data, user, className }) {
  return (
    <div className={`item-reivewer ${className || ""}`}>
      <div className="image">
        {_get(data, "customer.avatar") && (
          <img
            src={_get(data, "customer.avatar")}
            alt={_get(data, "customer.username")}
          />
        )}
      </div>
      <div className="inner-reviewer">
        <div className="heading">
          {!_get(data, "isAutoReview") && (
            <p className="point">
              <Rating
                readOnly
                precision={0.5}
                value={_get(data, "averageRating")}
                size="small"
              />
            </p>
          )}
          <p className="name">{_get(data, "customer.username")}</p>
          <p className="date">
            {moment(_get(data, "createdAt.iso")).format("YYYY/MM/DD")}
          </p>
        </div>
        {_get(data, "comment") && (
          <p className="comment">{_get(data, "comment")}</p>
        )}
        {_get(data, "nailistComment") && (
          <div className="item-reivewer item-reivewer--reply">
            <div className="image">
              {_get(user, "avatar") && (
                <img src={_get(user, "avatar")} alt={_get(user, "username")} />
              )}
            </div>
            <div className="inner-reviewer">
              <div className="heading">
                <p className="name">{_get(user, "username")}</p>
                <p className="date">
                  {moment(_get(data, "nailistCommentAt.iso")).format(
                    "YYYY/MM/DD"
                  )}
                </p>
              </div>
              {_get(data, "nailistComment") && (
                <p className="comment">{_get(data, "nailistComment")}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReviewItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  user: PropTypes.object,
};

export default ReviewItem;
