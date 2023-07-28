import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

class SectionMeasures extends React.PureComponent {
  render() {
    const { data } = this.props;

    return (
      <div className="measures-section">
        {data &&
          data.length > 0 &&
          data.map((block) => (
            <div key={block.order}>{renderHTML(block.text)}</div>
          ))}
      </div>
    );
  }
}

SectionMeasures.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SectionMeasures;
