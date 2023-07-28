import Rating from "@material-ui/lab/Rating";
import _get from "lodash/get";

const GeneralReviewBox = ({ data }) => (
  <div className="general-review">
    <h2 className="heading">総合評価</h2>
    <div className="sum-point">
      <span className="average-point">{_get(data, "totalAverage")}</span>
      <Rating
        readOnly
        precision={0.5}
        value={_get(data, "totalAverage", 0)}
        icon={<i className="icon-star" />}
        size="small"
      />
      <span className="count-reviewer">
        {_get(data, "countReview")}件の評価
      </span>
    </div>
    <div className="details-point">
      <div className="r-point">
        <div className="name">
          <i className="icon-technical" />
          <span>技術</span>
        </div>
        <div className="point">
          <Rating
            readOnly
            precision={0.5}
            value={_get(data, "averageServiceRating")}
            size="small"
          />
        </div>
      </div>
      <div className="r-point">
        <div className="name">
          <i className="icon-nail" />
          <span>接客</span>
        </div>
        <div className="point">
          <Rating
            readOnly
            precision={0.5}
            value={_get(data, "averageSkillRating")}
            size="small"
          />
        </div>
      </div>
      <div className="r-point">
        <div className="name">
          <i className="icon-price" />
          <span>価格</span>
        </div>
        <div className="point">
          <Rating
            readOnly
            precision={0.5}
            value={_get(data, "averagePriceRating")}
            size="small"
          />
        </div>
      </div>
    </div>
  </div>
);

export default GeneralReviewBox;
