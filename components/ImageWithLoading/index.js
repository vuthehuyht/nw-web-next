import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ImageWithLoading = (props) => {
  const { alt, image, height } = props;
  return (
    <div className="image-with-loading">
      <LazyLoadImage
        alt={alt}
        className="gallery-img"
        height={height}
        placeholderSrc={image.thumbnail}
        src={image.src}
        wrapperClassName="gallery-img-wrapper"
        effect="blur"
      />
    </div>
  );
};

ImageWithLoading.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
export default ImageWithLoading;
