import PropTypes from "prop-types";
import _get from "lodash/get";
import { Grid } from "@material-ui/core";
import EmptyBlock from "@components/EmptyBlock";
import LinkButton from "@components/LinkButton";
import ReviewItem from "./ReviewItem";
import GeneralReviewBox from "./GeneralReviewBox";

const ReviewBlock = ({ data, user }) => (
  <div className="review-block">
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <GeneralReviewBox data={_get(data, "statistics")} />
      </Grid>
      <Grid item xs={12} md={8}>
        {_get(data, "reviews") && _get(data, "reviews").length > 0 ? (
          <div className="list-reviewer">
            {_get(data, "reviews")
              .slice(0, 5)
              .map((item) => (
                <ReviewItem
                  key={`${item.customer.objectId}-${item.createdAt.iso}`}
                  data={item}
                  user={user}
                />
              ))}
            {_get(data, "reviews").length > 5 && (
              <div className="item-reivewer">
                <LinkButton
                  className="show-more-btn"
                  variant="outlined"
                  color="primary"
                  endIcon={<i className="icon-angle-right" />}
                  href={`/nailist/${_get(user, "objectId")}/reviews`}
                  scroll
                >
                  レビューをさらに表示
                </LinkButton>
              </div>
            )}
          </div>
        ) : (
          <EmptyBlock className="review" type="REVIEW" />
        )}
      </Grid>
    </Grid>
  </div>
);

ReviewBlock.propTypes = {
  data: PropTypes.object,
  user: PropTypes.object,
};

export default ReviewBlock;
