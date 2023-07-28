import PropTypes from "prop-types";
import Slider from "react-slick";

const SlideShow = ({ className, children, settings }) => {
  const defaultSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "8px",
  };
  return (
    <Slider className={className || ""} {...defaultSettings} {...settings}>
      {children}
    </Slider>
  );
};

SlideShow.propTypes = {
  className: PropTypes.string,
  settings: PropTypes.object,
  children: PropTypes.any,
};

export default SlideShow;
