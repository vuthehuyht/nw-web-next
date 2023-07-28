import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

class SectionCaution extends React.PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="section-scroll caution-section">
        <div className="inner scrollbar">
          {data &&
            data.map((item) => (
              <div key={item.order}>{renderHTML(item.text)}</div>
            ))}
        </div>
      </div>
    );
  }
}

SectionCaution.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SectionCaution;
