import { useState } from "react";
import PropTypes from "prop-types";
import _get from "lodash/get";
import { Link } from "react-scroll";
import Avatar from "@material-ui/core/Avatar";
import Rating from "@material-ui/lab/Rating";
import { Link as HrefLink } from "@material-ui/core";
import Modal from "@components/Modal";
import BookWrapper from "./BookButton";

function GeneralUser({
  user,
  salon,
  linkData,
  reviews,
  fullIntroduction,
  handleChange,
  onReserve,
}) {
  const isDirectBooking = _get(user, "isDirectBooking");
  const isAvailableBooking = _get(user, "availableBooking");
  return (
    <div className="detail-user">
      <Avatar className="avatar">
        <img src={_get(user, "avatar")} alt={_get(user, "username")} />
      </Avatar>
      <div className="inner-detail-user">
        <h2 className="user-name">
          <span>{_get(user, "username")}</span>
          {_get(user, "isMark") && (
            <img src="/assets/images/verified.svg" alt="mark" />
          )}
        </h2>
        <div className="salon-info">
          <p className="salon-name">
            <span className="title-info">サロン名</span>
            <span className="inner-info">
              <Link
                className="tab-menu-item"
                to="salon"
                spy
                smooth
                duration={150}
                offset={-140}
              >
                {_get(salon, "salonName")}
              </Link>
            </span>
          </p>
          <p className="location-info">
            <i className="icon-location-line" />
            <span className="inner-info">{_get(salon, "salonArea")}</span>
          </p>
        </div>
        <p className="rating-info">
          <span className="rating">
            {_get(reviews, "statistics.totalAverage")}
          </span>
          <Rating
            readOnly
            precision={0.5}
            value={_get(reviews, "statistics.totalAverage") || 0}
            icon={<i className="icon-star" />}
            size="small"
          />
          <span className="inner-info">
            {_get(reviews, "statistics.countReview") ? (
              <HrefLink
                className="tab-menu-item"
                href={`/nailist/${_get(user, "objectId")}/reviews`}
              >
                ({_get(reviews, "statistics.countReview")}件)
              </HrefLink>
            ) : (
              <>({_get(reviews, "statistics.countReview")}件)</>
            )}
          </span>
        </p>
        <div className="user-introducion">
          <p className={fullIntroduction ? "" : "max-2-lines"}>
            {_get(user, "introduction")}
          </p>
          {!fullIntroduction &&
            _get(user, "introduction") &&
            _get(user, "introduction").length > 80 && (
              <button
                className="more-txt-btn"
                type="button"
                onClick={() => handleChange(true)}
              >
                もっと読む
              </button>
            )}
        </div>
        <BookWrapper
          linkData={linkData}
          onReserve={onReserve}
          isDirectBooking={isDirectBooking}
          isAvailableBooking={isAvailableBooking}
        />
      </div>
    </div>
  );
}

const DetailUser = ({ data, linkData, onReserve }) => {
  const [showFullIntroduction, setShowFullIntroduction] = useState(false);

  return (
    <div className="general-user">
      <GeneralUser
        user={_get(data, "user")}
        salon={_get(data, "salon")}
        linkData={linkData}
        reviews={_get(data, "reviews")}
        fullIntroduction={false}
        handleChange={setShowFullIntroduction}
        onReserve={onReserve}
      />

      <Modal
        className="detail-user-dialog"
        open={showFullIntroduction}
        handleClose={setShowFullIntroduction}
      >
        <GeneralUser
          user={_get(data, "user")}
          salon={_get(data, "salon")}
          linkData={linkData}
          reviews={_get(data, "reviews")}
          fullIntroduction
          onReserve={onReserve}
        />
      </Modal>
    </div>
  );
};

DetailUser.propTypes = {
  data: PropTypes.object,
  linkData: PropTypes.any,
};

export default DetailUser;
