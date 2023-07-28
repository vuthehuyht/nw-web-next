import PropTypes from "prop-types";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MainVisualBlur = ({ className, alt, srcImg, maxWidth = "lg" }) => (
  <div className={clsx("main-visual-blur", { [className]: className })}>
    <Container maxWidth={maxWidth}>
      <div
        className="blur-img"
        style={{ backgroundImage: `url("${srcImg}"` }}
      />
      <div className="photo-frame">
        <LazyLoadImage
          alt={alt}
          className="gallery-img"
          height="100%"
          placeholderSrc={srcImg}
          src={srcImg}
          wrapperClassName="gallery-img-wrapper"
          effect="blur"
        />
      </div>
    </Container>
  </div>
);

MainVisualBlur.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  srcImg: PropTypes.string,
  maxWidth: PropTypes.oneOf(["lg", "md"]),
};

export default MainVisualBlur;
