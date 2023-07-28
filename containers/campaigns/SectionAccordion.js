import React from "react";
import PropTypes from "prop-types";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import renderHTML from "react-render-html";

class SectionAccordion extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: "",
    };
  }

  handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      this.setState({ expanded: panel });
    } else {
      this.setState({ expanded: false });
    }
  };

  render() {
    const { data } = this.props;
    const { expanded } = this.state;

    return (
      <div className="section-accordion accordion-qa">
        {data &&
          data.map((item) => (
            <ExpansionPanel
              key={item.objectId}
              square
              expanded={expanded === item.objectId}
              onChange={this.handleChange(item.objectId)}
            >
              <ExpansionPanelSummary
                expandIcon={<i className="icon-angle-right" />}
                aria-controls={`panel-content-${item.objectId}`}
                id={`panel-header-${item.objectId}`}
              >
                <Typography>{item.question}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <div className="answer-block">
                  <span>A. </span>
                  <div className="inner-question">
                    {renderHTML(item.answer)}
                  </div>
                </div>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
      </div>
    );
  }
}

SectionAccordion.propTypes = {
  data: PropTypes.array.isRequired,
};

export default SectionAccordion;
