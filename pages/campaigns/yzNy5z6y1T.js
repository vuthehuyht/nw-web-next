import { useEffect, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import _get from "lodash/get";
import { isMobile } from "react-device-detect";
import { NextSeo } from "next-seo";
import Container from "@material-ui/core/Container";
import renderHTML from "react-render-html";
import Layout from "components/Layout";
import MainVisual from "@components/MainVisual";
import SectionText from "containers/campaigns/SectionText";
import VideoSection from "containers/campaigns/VideoSection";
import SectionPractice from "containers/campaigns/SectionPractice";
import SectionMeasures from "containers/campaigns/SectionMeasures";
import SectionCaution from "containers/campaigns/SectionCaution";

import { GOTO_CAMPAIGN } from "utils/campaignConstants";

const GoTo500CampaignPage = () => {
  const dataCampaign = GOTO_CAMPAIGN;
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  return (
    <Layout hiddenHeader>
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={_get(dataCampaign, "details.meta.images[0].url")}
        />
        <meta
          name="twitter:title"
          content={_get(dataCampaign, "details.meta.title")}
        />
        {/* <meta name="twitter:description" content={salon?.salonCatchphrase} /> */}
      </Head>
      <NextSeo
        title={_get(dataCampaign, "details.meta.title")}
        openGraph={{
          title: _get(dataCampaign, "details.meta.title"),
          url: `${process.env.DOMAIN_NAME}/campaigns/${_get(
            dataCampaign,
            "objectId"
          )}`,
          images: _get(dataCampaign, "details.meta.images"),
        }}
      />
      <div
        className={clsx("detail-promotion-section gt500-promotion", {
          "banner-sp": isMobileLayout,
          "banner-pc": !isMobileLayout,
        })}
      >
        <MainVisual
          className="banner-home"
          imgPC={_get(dataCampaign, "details.banner.desktop")}
          imgSP={_get(dataCampaign, "details.banner.mobile")}
          alt={_get(dataCampaign, "details.blocks[0].title")}
        />
        {/** Copy code */}
        <div id="text-copy" />
        <input type="text" id="codeTxt" readOnly />
        {_get(dataCampaign, "details.blocks") &&
          _get(dataCampaign, "details.blocks").map((block) => (
            <div
              key={block.key}
              className={`promotion-block ${block.background} promotion-block--${block.type}`}
            >
              <Container className="container" maxWidth="lg">
                {block.type && block.title && (
                  <div
                    className={clsx("promotion-title", {
                      [block.classTitle]: block.classTitle,
                    })}
                  >
                    <h2>
                      <span>{block.title}</span>
                    </h2>
                    {block.subTitle && <h3>{renderHTML(block.subTitle)}</h3>}
                  </div>
                )}
                {block.type && block.type === "sec21" && (
                  <SectionMeasures data={block.content} />
                )}
                {block.type && block.type === "sec22" && (
                  <VideoSection data={block.content} />
                )}
                {block.type && block.type === "sec23" && (
                  <SectionPractice data={block.content} />
                )}
                {block.type && block.type === "sec24" && (
                  <SectionText data={block.content} type="action-code" />
                )}
                {block.type && block.type === "sec25" && (
                  <SectionCaution data={block.content} />
                )}
              </Container>
            </div>
          ))}
      </div>
    </Layout>
  );
};

export default GoTo500CampaignPage;
