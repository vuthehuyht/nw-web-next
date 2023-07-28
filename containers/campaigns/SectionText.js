import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import renderHTML from "react-render-html";

class SectionText extends React.PureComponent {
  render() {
    const { data, type, className } = this.props;

    // const copyCode = () => {
    //   /* Get the text field */
    //   const copyText = document.getElementById("code");

    //   /* Select the text field */
    //   copyText.select();
    //   copyText.setSelectionRange(0, 99999); /* For mobile devices */

    //   /* Copy the text inside the text field */
    //   document.execCommand("copy");

    //   /* Alert the copied text */
    //   alert("Copied the text: " + copyText.value);
    // }

    return (
      <div
        className={clsx(`section-text section-text--${type}`, {
          [className]: className,
        })}
      >
        {type !== "col-3" &&
          type !== "action-code" &&
          data &&
          data.length > 0 &&
          data.map((block) => (
            <div key={block.text}>{renderHTML(block.text)}</div>
          ))}
        {type === "col-3" &&
          type !== "action-code" &&
          data &&
          data.length > 0 &&
          data.map((block) => (
            <div key={block.order} className="paragraph">
              {block.columns.map((item) => (
                <div
                  key={item.order}
                  className={`content-col col-${item.order}`}
                >
                  {renderHTML(item.text)}
                </div>
              ))}
            </div>
          ))}
        {type === "action-code" &&
          data &&
          data.length > 0 &&
          data.map((block) => (
            <div
              key={block.text}
              dangerouslySetInnerHTML={{ __html: block.text }}
            />
          ))}
      </div>
    );
  }
}

SectionText.propTypes = {
  data: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
};

export default SectionText;
