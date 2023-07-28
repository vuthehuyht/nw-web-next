import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import _get from "lodash/get";
import asyncComponent from "@utils/asyncComponent";
import { AMOUNT_MANICURIST, SORT_BY } from "@utils/constants";

import {
  getPromotionList,
  getAreasList,
  searchNailist,
  getLineList,
  getNormalMenuCategories,
  getSalonTypes,
} from "providers/ResourceProvider/actions";

import Layout from "components/Layout";
import Title from "components/Title";
import BannerDownloadApp from "components/BannerDownloadApp";
import MainVisual from "components/MainVisual";
import CampaignsSection from "components/HomePage/CampaignsContent";
import {
  setDataAreas,
  setDataLines,
  setDataSalonTypes,
  setDataMenus,
} from "@providers/ResourceProvider/slice";
import { wrapper } from "store";
import Helper from "@utils/helper";

const ManicuirstSkeleton = asyncComponent(
  () => import("@components/Skeleton/ManicuirstSkeleton"),
  null,
  true
);
const RecommendSection = asyncComponent(
  () => import("@components/HomePage/RecommendContent"),
  <ManicuirstSkeleton />,
  true
);
const LocationsSection = asyncComponent(
  () => import("@components/HomePage/LocationsContent"),
  null,
  false
);

const useStyles = makeStyles({
  toolbarTitle: {
    flex: 1,
  },
  content: {
    paddingTop: 32,
  },
  bgGray: {
    backgroundColor: "#f4f4f4",
  },
  bgWhite: {
    backgroundColor: "#fff",
  },
});

const HomePage = ({
  dataCampaigns = [],
  dataManicruist = {},
  dataAreas = [],
}) => {
  const classes = useStyles();
  return (
    <Layout>
      <div className="home-wrapper">
        {/* <LazyLoadComponent threshold={850}> */}
        <MainVisual
          className="banner-home"
          imgPC="/assets/images/banner-home-pc.webp"
          imgSP="/assets/images/banner-home-sp.webp"
          alt="nailie"
          mobileSize={96 / 75}
        />
        {/* </LazyLoadComponent> */}
        <div className="block location-block">
          <LocationsSection data={dataAreas} />
        </div>
        <div className="block recommend-block">
          <Container>
            <Title
              className={classes.toolbarTitle}
              title="Recommend"
              japanese="おすすめのネイリスト"
            />
            <div className={classes.content}>
              <RecommendSection data={dataManicruist.users} />
            </div>
          </Container>
        </div>
        <div className="block campaigns-block">
          <Container>
            <Title
              className={classes.toolbarTitle}
              title="Campaigns"
              japanese="キャンペーン"
            />
            <div className={classes.content}>
              <CampaignsSection data={dataCampaigns} />
            </div>
          </Container>
        </div>
        <div className="block block--full">
          <BannerDownloadApp />
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  const data = await Promise.all([
    getAreasList({}, true),
    getPromotionList({}, true),
    searchNailist(
      {
        limit: AMOUNT_MANICURIST.HOME,
        sortBy: SORT_BY[0].value,
      },
      true
    ),
    getNormalMenuCategories({}, true),
    getSalonTypes({}, true),
  ]);
  const dataAreaList = _get(data, "[0]", []);
  store.dispatch(setDataAreas(dataAreaList));
  const promises = [];
  const prefectureData = {};
  dataAreaList.forEach((area) => {
    area.prefectures.forEach((prefecture) => {
      promises.push(
        getLineList(
          { getAll: true, prefectureCodes: prefecture.prefectureCode },
          true
        ).then((result) => {
          prefectureData[prefecture.prefectureCode] =
            Helper.convertArrayToObject(result);
        })
      );
    });
  });
  await Promise.all(promises);
  store.dispatch(setDataLines(prefectureData));
  store.dispatch(setDataMenus(data[3]));
  store.dispatch(setDataSalonTypes(data[4]));

  return {
    props: {
      dataAreas: data[0] || [],
      dataCampaigns: data[1] || [],
      dataManicruist: data[2] || {},
    },
    revalidate: 1,
  };
});

export default HomePage;
