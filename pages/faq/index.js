import { useEffect, useState, useRef } from "react";
import renderHTML from "react-render-html";
import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import Router, { useRouter } from "next/router";
import _get from "lodash/get";
import _find from "lodash/find";
import { getFaqList } from "providers/policy-actions";
import Layout from "components/Layout";
import Title from "@components/Title";

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 230;

const FaqPage = ({ data }) => {
  const { asPath, route } = useRouter();
  const currentId = asPath.replace(`${route}#`, "");
  const [expandQuestion, setExpandQuestion] = useState(currentId);
  const [expanded, setExpand] = useState(
    _get(
      _find(data, (o) => _find(o.faqs, ["objectId", currentId])),
      "objectId"
    )
  );
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const curentEle = document.getElementById(`question-${expandQuestion}`);
    if (curentEle) {
      const y = curentEle.getBoundingClientRect().top + window.scrollY;
      window.scroll({
        top: y,
        behavior: "smooth",
      });
    } else if (expanded) {
      window.scroll({
        top:
          document
            .getElementById(`panel-header-${expanded}`)
            .getBoundingClientRect().top +
          window.scrollY -
          100,
        behavior: "smooth",
      });
    }
  });

  useEffect(() => {
    let innerHeight = ref.current.clientHeight + HEADER_HEIGHT + FOOTER_HEIGHT;
    // console.log(window.innerHeight);
    if (innerHeight < window.innerHeight) {
      innerHeight = window.innerHeight - FOOTER_HEIGHT;
      setHeight(innerHeight);
    }
  }, [height]);

  const handleChangeQuestion = (question) => (event, isExpanded) => {
    setExpandQuestion(question);
    if (isExpanded) {
      Router.push(`/faq/${question}`);
      window.scroll({
        top:
          document
            .getElementById(`question-${question}`)
            .getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  };

  const handleChangeTopic = (id) => (event, isExpanded) => {
    if (isExpanded) {
      setExpand(id);
      setExpandQuestion(null);
    }
  };

  return (
    <Layout>
      <Container
        ref={ref}
        className="faq-wrapper static-page"
        maxWidth="md"
        style={{ minHeight: `${height}px` }}
      >
        <Title
          title="Guide"
          japanese="ガイド"
          className="static-title"
          positionClass="center"
        />
        <div className="accordion-qa">
          {data &&
            data.length > 0 &&
            data.map((item) => (
              <ExpansionPanel
                key={item.objectId}
                square
                expanded={expanded === item.objectId}
                onChange={handleChangeTopic(item.objectId)}
              >
                <ExpansionPanelSummary
                  expandIcon={<i className="icon-angle-right" />}
                  aria-controls={`panel-content-${item.objectId}`}
                  id={`panel-header-${item.objectId}`}
                >
                  <Typography>{item.name}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="faq-list">
                    {item.faqs.map((faq) => (
                      <ExpansionPanel
                        key={faq.objectId}
                        square
                        expanded={expandQuestion === faq.objectId}
                        onChange={handleChangeQuestion(faq.objectId)}
                      >
                        <ExpansionPanelSummary
                          aria-controls={`panel-content-${faq.objectId}`}
                          id={`question-${faq.objectId}`}
                        >
                          <div className="faq-question">
                            <span>Q.</span>
                            <div className="inner-question">
                              {renderHTML(faq.question)}
                            </div>
                          </div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <div className="faq-answer">
                            <span>A.</span>
                            <div className="inner-answer">
                              {renderHTML(faq.answer)}
                            </div>
                          </div>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    ))}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
        </div>
      </Container>
    </Layout>
  );
};

FaqPage.getInitialProps = async () => {
  const snapshot = await getFaqList();
  return { data: snapshot };
};

export default FaqPage;
