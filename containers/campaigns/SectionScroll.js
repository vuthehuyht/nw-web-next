import React from "react";
import PropTypes from "prop-types";
import renderHTML from "react-render-html";

class SectionScroll extends React.PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className="section-scroll">
        <div className="inner scrollbar">
          {data &&
            data.map((item) => (
              <div className="content-row" key={item.order}>
                <div className="title">{item.title}</div>
                <div className="content">{renderHTML(item.text)}</div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

SectionScroll.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SectionScroll;
