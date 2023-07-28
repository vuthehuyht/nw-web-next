import { DefaultSeo } from "next-seo";
import Carousel from "react-multi-carousel";
import Container from "@material-ui/core/Container";
import SEO from "next-seo.config";
import { getCampaignList } from "@providers/campaign-actions";
import Banner from "@components/BannerPage";
import Title from "@components/Title";
import Layout from "components/Layout";

import CampaignCard from "@components/CampaignCard";
import CampaignCardSkeleton from "@components/Skeleton/CampaignsSkeleton";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
    paritialVisibilityGutter: 0,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 0,
  },
};

const CampaignsPage = ({ data }) => (
  <Layout>
    <DefaultSeo {...SEO} />
    <div className="campaigns-wrapper">
      <section className="block block--heading">
        <div className="heading">
          <Banner
            imgPC="/assets/images/campaigns-pc.jpg"
            imgSP="/assets/images/campaigns-sp.jpg"
            alt="Campaigns"
          />
          <Title
            className="title-campaigns"
            title="Campaigns"
            japanese="キャンペーン"
          />
        </div>
      </section>
      <section className="block">
        <Container className="campaigns-section">
          <Carousel ssr itemClass="campaigns-item" responsive={responsive}>
            {data.length > 0 ? (
              data.map((item) => (
                <CampaignCard data={item} key={item.objectId} />
              ))
            ) : (
              <CampaignCardSkeleton />
            )}
          </Carousel>
        </Container>
      </section>
    </div>
  </Layout>
);

CampaignsPage.getInitialProps = async () => {
  const snapshot = await getCampaignList();
  return { data: snapshot || [] };
};

export default CampaignsPage;
