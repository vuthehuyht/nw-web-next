import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";
import Skeleton from "@material-ui/lab/Skeleton";

const LazyImage = ({ src, alt, className, height }) => {
  const refPlaceholder = React.useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
  };

  return (
    <div
      className={`image-wrapper ${className || ""}`}
      style={{ height: `${height}px` }}
    >
      <Skeleton
        animation="wave"
        className="image-placeholder"
        ref={refPlaceholder}
      />
      <LazyLoad>
        <img
          className="image-item"
          onLoad={removePlaceholder}
          onError={removePlaceholder}
          src={src}
          alt={alt}
        />
      </LazyLoad>
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
};

export default LazyImage;
