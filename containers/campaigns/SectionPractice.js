import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

class SectionPractice extends React.PureComponent {
  render() {
    const { data, type } = this.props;

    return (
      <div className="practice-section">
        {data &&
          data.length > 0 &&
          data.map((block) =>
            type === "action-code" ? (
              <div
                key={block.text}
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            ) : (
              <div key={block.text}>{renderHTML(block.text)}</div>
            )
          )}
      </div>
    );
  }
}

SectionPractice.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string,
};

export default SectionPractice;
