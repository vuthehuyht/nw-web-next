import PropTypes from "prop-types";
import queryString from "query-string";
import { API_GOOGLE_MAP_KEY, SIZE_GOOGLE_MAP } from "utils/constants";

const serviceURL = "https://maps.googleapis.com/maps/api/staticmap?";

const StaticMap = (props) => {
  const { lat, long, className } = props;
  const params = {
    center: `${lat},${long}`,
    ...props,
    zoom: 16,
    size: SIZE_GOOGLE_MAP,
    key: API_GOOGLE_MAP_KEY,
    maptype: "roadmap",
    language: "ja",
  };
  const query = queryString.stringify(params);

  return (
    <div className={`static-map-block ${className || ""}`}>
      <div className="inner-map-block">
        <a
          href={`http://maps.google.co.jp/maps?q=${lat},${long}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="map-img"
            style={{ backgroundImage: `url("${serviceURL + query}"` }}
          />
          <div
            className="pin"
            style={{ backgroundImage: "url(/assets/images/pin-location.svg" }}
          />
        </a>
      </div>
    </div>
  );
};

StaticMap.propTypes = {
  className: PropTypes.string,
  lat: PropTypes.number,
  long: PropTypes.number,
};

export default StaticMap;
