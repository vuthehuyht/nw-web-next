import { useEffect, useState } from "react";
import renderHTML from "react-render-html";
import Router, { useRouter } from "next/router";
import {
  Container,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from "@material-ui/core";
import _get from "lodash/get";
import _find from "lodash/find";
import Title from "@components/Title";
import Layout from "components/Layout";
import { getFaqList } from "providers/policy-actions";

const FaqPage = ({ data }) => {
  const router = useRouter();
  const { faqId } = router.query;
  const [expandQuestion, setExpandQuestion] = useState(faqId);
  const [expanded, setExpand] = useState(
    _get(
      _find(data, (o) => _find(o.faqs, ["objectId", faqId])),
      "objectId"
    )
  );

  useEffect(() => {
    const y =
      document.getElementById(`panel-header-${faqId}`).getBoundingClientRect()
        .top + window.scrollY;
    window.scroll({
      top: y,
      behavior: "smooth",
    });
  }, [faqId]);

  const handleChangeQuestion = (question) => (event, isExpanded) => {
    if (isExpanded) {
      setExpandQuestion(question);
      Router.push(`/faq/${question}`);
    } else {
      setExpandQuestion(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    if (isExpanded) {
      setExpand(panel);
    } else {
      setExpand(false);
    }
  };

  return (
    <Layout>
      <Container className="static-page faq-wrapper" maxWidth="md">
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
                onChange={handleChange(item.objectId)}
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
                          id={`panel-header-${faq.objectId}`}
                        >
                          <div className="faq-question" id={faq.objectId}>
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
