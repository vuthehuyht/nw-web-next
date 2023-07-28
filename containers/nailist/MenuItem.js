import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import _get from "lodash/get";

const MenuItemContent = ({ data }) => (
  <>
    <div className="image-wrapper">
      <div className="image">
        {_get(data, "image") ? (
          <img src={_get(data, "image")} alt={_get(data, "title")} />
        ) : (
          <img
            className="image-skeleton"
            src="/assets/images/default-photo.png"
            alt={_get(data, "title")}
          />
        )}
      </div>
    </div>
    <div className="detail-wrapper">
      <div className="inner-detail">
        <div className="heading">
          <h3 className="max-2-lines">{_get(data, "title")}</h3>
          <div className="heading-block">
            <p className="schedule">所要時間{_get(data, "time")}分</p>
            <NumberFormat
              value={_get(data, "price")}
              displayType="text"
              prefix="¥"
              thousandSeparator
              renderText={(value) => <p className="price">{value}</p>}
            />
          </div>
        </div>
        <p className="details">{_get(data, "detail")}</p>
      </div>
    </div>
  </>
);

function MenuItem({ className, data, onClick }) {
  return onClick ? (
    <button className={`menu-item ${className || ""}`} onClick={onClick}>
      <MenuItemContent data={data} />
    </button>
  ) : (
    <div className={`menu-item ${className || ""}`}>
      <MenuItemContent data={data} />
    </div>
  );
}

MenuItem.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func,
};

export default MenuItem;
