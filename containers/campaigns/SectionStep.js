import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";
import _get from "lodash/get";

class SectionStep extends React.PureComponent {
  render() {
    const { data, type } = this.props;

    return (
      <div className={`section-step section-step--${type}`}>
        {data &&
          data.length > 0 &&
          data.map((block) => (
            <>
              {block.text && renderHTML(block.text)}
              {!block.text && block.steps && (
                <div className="row">
                  {_get(block, "steps.content").map((item) => (
                    <div
                      className={`step-wrapper col col-lg-${
                        12 / _get(block, "steps.step")
                      }`}
                      key={`step-${item.order}`}
                    >
                      <div className="step-heading">
                        <div className="step-heading-inner">
                          {renderHTML(item.title)}
                        </div>
                      </div>
                      <div className="step-inner">
                        <div className="step-content">
                          {renderHTML(item.text)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}
      </div>
    );
  }
}

SectionStep.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default SectionStep;
