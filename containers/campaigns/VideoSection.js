import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";
import clsx from "clsx";

class VideoSection extends React.PureComponent {
  render() {
    const { data, className } = this.props;
    const { video, text } = data[0];

    return (
      <div className={clsx("video-sections", { [className]: className })}>
        <iframe
          src={video.src}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen=""
          title={video.title}
        ></iframe>
        <div className="inner-video-sections">{renderHTML(text)}</div>
      </div>
    );
  }
}

VideoSection.propTypes = {
  data: PropTypes.array.isRequired,
};

export default VideoSection;
