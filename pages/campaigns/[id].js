/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Head from "next/head";
import clsx from "clsx";
import _get from "lodash/get";
import { isMobile } from "react-device-detect";
import { NextSeo } from "next-seo";
import Container from "@material-ui/core/Container";
import renderHTML from "react-render-html";
import Router from "next/router";
import { getDetailCampaign } from "@providers/campaign-actions";
import Layout from "components/Layout";
import MainVisual from "@components/MainVisual";
import SectionAccordion from "containers/campaigns/SectionAccordion";
import SectionText from "containers/campaigns/SectionText";
import SectionScroll from "containers/campaigns/SectionScroll";
import SectionStep from "containers/campaigns/SectionStep";
import VideoSection from "containers/campaigns/VideoSection";
import SectionPractice from "containers/campaigns/SectionPractice";
import SectionMeasures from "containers/campaigns/SectionMeasures";
import SectionCaution from "containers/campaigns/SectionCaution";

const DetailCampaignPage = (props) => {
  const dataCampaign = props;
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const classBanner = _get(dataCampaign, "details.banner.classBanner");

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  useEffect(() => {
    if (props.status === "error") {
      Router.push("/");
    }
  }, []);

  return (
    <Layout hiddenHeader>
      <Head>
        <meta
          name="twitter:image"
          content={
            _get(dataCampaign, "details.meta.images", []).length > 0
              ? _get(dataCampaign, "details.meta.images", [])[0]?.url
              : `${process.env.DOMAIN_NAME}/assets/images/banner-home-pc.webp`
          }
        />
        <meta
          name="twitter:title"
          content={_get(dataCampaign, "details.meta.title")}
        />
      </Head>
      <NextSeo
        title={_get(dataCampaign, "details.meta.title")}
        canonical={`${process.env.DOMAIN_NAME}/campaigns/${_get(
          dataCampaign,
          "objectId"
        )}`}
        openGraph={{
          type: "article",
          url: `${process.env.DOMAIN_NAME}/campaigns/${_get(
            dataCampaign,
            "objectId"
          )}`,
          title: _get(dataCampaign, "details.meta.title"),
          images: _get(dataCampaign, "details.meta.images", []).map((item) => {
            const img = {
              url: item?.url,
              width: 600,
              height: 315,
              alt: "ネイリー（Nailie）",
            };
            return img;
          }),
          site_name: "ネイリー（Nailie）",
        }}
        twitter={{
          site: "@nailiejp",
          cardType: "summary_large_image",
        }}
      />
      <div
        className={`detail-promotion-section ${
          isMobileLayout ? "banner-sp" : "banner-pc"
        }`}
      >
        <MainVisual
          className={clsx("banner-home", {
            [classBanner]: classBanner,
          })}
          desktopSize={_get(dataCampaign, "details.banner.desktopSize")}
          mobileSize={_get(dataCampaign, "details.banner.mobileSize")}
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
              className={`promotion-block ${block.background} promotion-block--${block.type} ${block.backgroundClass}`}
            >
              <Container className="container" maxWidth="lg">
                {block.type &&
                  block.title &&
                  block.type !== "sec6" &&
                  block.type !== "sec7" && (
                    <div
                      className={clsx("promotion-title", {
                        [block.classTitle]: block.classTitle,
                      })}
                    >
                      <h2>
                        {block.classTitle === "secondary-slanted" ? (
                          <span>{block.title}</span>
                        ) : (
                          block.title
                        )}
                      </h2>
                      {block.subTitle && <h3>{renderHTML(block.subTitle)}</h3>}
                    </div>
                  )}
                {block.type &&
                  (block.type === "sec6" || block.type === "sec7") && (
                    <div className="promotion-title promotion-title--pink">
                      <h2>{block.title}</h2>
                      {block.subTitle && <h3>{block.subTitle}</h3>}
                    </div>
                  )}
                {block.type && block.type === "sec1" && (
                  <SectionText data={block.content} type="col-3" />
                )}
                {block.type && block.type === "sec2" && (
                  <SectionText data={block.content} type="col-1" />
                )}
                {block.type && block.type === "sec3" && (
                  <SectionText data={block.content} type="col-2" />
                )}
                {block.type && block.type === "sec4" && (
                  <SectionAccordion data={block.content} />
                )}
                {block.type && block.type === "sec5" && (
                  <SectionScroll data={block.content} />
                )}
                {block.type && block.type === "sec6" && (
                  <SectionStep data={block.content} type="type-1" />
                )}
                {block.type && block.type === "sec7" && (
                  <SectionStep data={block.content} type="type-2" />
                )}
                {block.type && block.type === "sec21" && (
                  <SectionMeasures data={block.content} />
                )}
                {block.type && block.type === "sec22" && (
                  <VideoSection
                    data={block.content}
                    className={block.classContent}
                  />
                )}
                {block.type && block.type === "sec23" && (
                  <SectionPractice data={block.content} type="action-code" />
                )}
                {block.type && block.type === "sec24" && (
                  <SectionText
                    data={block.content}
                    type="action-code"
                    className={block.classContent}
                  />
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

DetailCampaignPage.getInitialProps = async ({ query }) => {
  const snapshot = await getDetailCampaign({ objectId: query.id });
  return snapshot;
};

export default DetailCampaignPage;
