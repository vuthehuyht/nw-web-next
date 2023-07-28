/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable consistent-return */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { NextSeo } from "next-seo";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { isMobile } from "react-device-detect";
import { Link } from "react-scroll";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { useCookies } from "react-cookie";
import Router, { useRouter } from "next/router";
import { checkNailistCanBookV3 } from "providers/BookingProvider/actions";
import { switchBackdropVisible } from "@providers/GeneralProvider/slice";
import { AMOUNT_MANICURIST } from "@utils/constants";
import {
  searchNailist,
  getMyPageSideCustomer,
  getDeepLinkToShare,
} from "@providers/nailist-actions";
import ErrorPage from "pages/_error";

import Breadcrumbs from "@components/Breadcrumbs";
import MainVisualBlur from "@components/MainVisualBlur";
import Layout from "@components/Layout";
import EmptyBlock from "@components/EmptyBlock";

import BookingLayout from "containers/nailist/BookingLayout";
import ReviewBlock from "containers/nailist/ReviewBlock";
import SalonBlock from "containers/nailist/SalonBlock";
import MenuItem from "containers/nailist/MenuItem";
import PostThumbnail from "containers/nailist/PostThumbnail";
import DetailUser from "containers/nailist/DetailUser";
import BookWrapper from "containers/nailist/BookButton";
import LinkButton from "@components/LinkButton";
import { useSpecificPageViewEvent } from "hooks";

const CONTENT_STICKY_HEIGHT = 600;

const MyPage = ({ data, shareLink }) => {
  const dispatch = useDispatch();
  const { trackEvent } = useSpecificPageViewEvent();
  const posts = _get(data, "posts");
  const salon = _get(data, "salon");
  const menus = _get(data, "menus");
  const reviews = _get(data, "reviews");
  const recommendMenu = _get(data, "recommendMenu");
  const [isAvailableBooking, setAvailableBooking] = useState(
    _get(data, "user.availableBooking")
  );
  const [isDirectBooking, setDirectBooking] = useState(
    _get(data, "user.isDirectBooking")
  );
  const [sticky, setSticky] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [, setCookie, removeCookie] = useCookies(["booking-data"]);
  const { push, query } = useRouter();
  let dataPost = [];
  let lastPost = posts ? posts.length - 1 : 0;

  const checkStickyHeader = () => {
    if (!sticky && window.pageYOffset > CONTENT_STICKY_HEIGHT) {
      setSticky(true);
    } else if (sticky && window.pageYOffset <= CONTENT_STICKY_HEIGHT) {
      setSticky(false);
    }
  };

  useEffect(() => {
    if (_get(data, "status") === "error" && _get(data, "err.code") === 310) {
      window.location = "/";
    }
    if (
      _get(data, "status") === "error" ||
      _get(shareLink, "status") === "error"
    ) {
      return <ErrorPage />;
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        if (query.nailieId) {
          const result = await checkNailistCanBookV3({
            nailistId: query.nailieId,
          });
          setAvailableBooking(result.isAvailable);
          setDirectBooking(result.isDirectBooking);
        }
      } catch (e) {
        console.error("error: ", e);
      }
    })();
  }, [query.nailieId]);

  useEffect(() => {
    if (window !== "underfind") {
      window.addEventListener("scroll", checkStickyHeader);
      return () => {
        window.removeEventListener("scroll", checkStickyHeader);
      };
    }
    setIsMobileLayout(isMobile);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", checkStickyHeader);
    return () => {
      window.removeEventListener("scroll", checkStickyHeader);
    };
  }, [sticky]);

  if (isMobileLayout) {
    if (posts) {
      dataPost = posts.length > 0 ? posts.slice(0, 9) : [];
      lastPost = posts.length > 8 ? 8 : posts.length - 1;
    }
  } else if (posts) {
    dataPost = posts.length > 0 ? posts : [];
    lastPost = posts.length > 11 ? 11 : posts.length - 1;
  }

  const handleReserve = async (menu) => {
    if (menu) {
      setCookie(
        "booking-data",
        {
          nailistId: query.nailieId,
          menus: [{ menuId: menu.objectId, recommend: true }],
        },
        { path: "/" }
      );
    } else removeCookie("booking-data", { path: "/" });
    push(`/booking/${query.nailieId}`);
  };

  const breadcrumbs = [
    {
      text: _get(data, "salon.salonAreaDetail.region.text") || "REGION",
      href: `/search?region=${_get(
        data,
        "salon.salonAreaDetail.region.id"
      )}&sortBy=RECOMMEND`,
    },
    {
      text: _get(data, "salon.salonAreaDetail.prefecture.text") || "PREFECTURE",
      href: `/search?region=${_get(
        data,
        "salon.salonAreaDetail.region.id"
      )}&prefecture=${_get(
        data,
        "salon.salonAreaDetail.prefecture.id"
      )}&sortBy=RECOMMEND`,
    },
    {
      text: _get(data, "salon.salonAreaDetail.wards.text") || "WARDS",
      href: `/search?region=${_get(
        data,
        "salon.salonAreaDetail.region.id"
      )}&prefecture=${_get(
        data,
        "salon.salonAreaDetail.prefecture.id"
      )}&wards=${_get(
        data,
        "salon.salonAreaDetail.wards.id"
      )}&sortBy=RECOMMEND`,
    },
    { text: _get(data, "user.username") || "NO NAME" },
  ];

  useEffect(() => {
    Router.beforePopState(({ as }) => {
      if (as !== Router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        dispatch(switchBackdropVisible(true));
      }
      return true;
    });

    return () => {
      Router.beforePopState(() => true);
    };
  }, [Router]);

  return (
    <Layout>
      <Head>
        <meta
          name="twitter:image"
          content={_get(data, "user.salonImages[0]")}
        />
        <meta
          name="twitter:title"
          content={`ネイリー（Nailie） - ${_get(data, "user.username")}`}
        />
      </Head>
      <NextSeo
        title={`ネイリー（Nailie） - ${_get(data, "user.username")}`}
        canonical={`${process.env.DOMAIN_NAME}/nailist/${_get(
          data,
          "user.objectId"
        )}`}
        description={`${_get(data, "user.username")} - ${_get(
          salon,
          "salonName"
        )}`}
        openGraph={{
          type: "article",
          url: `${process.env.DOMAIN_NAME}/nailist/${_get(
            data,
            "user.objectId"
          )}`,
          title: `ネイリー（Nailie） - ${_get(data, "user.username")}`,
          description: `${_get(data, "user.username")} - ${_get(
            salon,
            "salonName"
          )}`,
          images: _get(data, "user.salonImages", []).map((item) => {
            const img = {
              url: item,
              width: 600,
              height: 315,
              alt: `ネイリー（Nailie） - ${_get(data, "user.username")}`,
            };
            return img;
          }),
          site_name: "ネイリー（Nailie）",
          article: {
            section: _get(salon, "salonName"),
            authors: _get(data, "user.salonImages"),
            tags: [_get(data, "user.username"), _get(salon, "salonName")],
          },
        }}
      />
      <Breadcrumbs data={breadcrumbs} />
      <BookingLayout
        user={{
          ..._get(data, "user", {}),
          isDirectBooking,
          availableBooking: isAvailableBooking,
        }}
        positionTop={isMobile ? 580 : 500}
        isHome
        onReserve={handleReserve}
      >
        <div className="my-page">
          <MainVisualBlur
            className="banner-manicurist"
            srcImg={_get(data, "user.salonImages[0]")}
            alt="nailie"
          />
          <Container className="inner-my-page">
            {!_isEmpty(data) && (
              <DetailUser
                data={{
                  ...data,
                  user: {
                    ...data?.user,
                    isDirectBooking,
                    availableBooking: isAvailableBooking,
                  },
                }}
                linkData={shareLink}
                onReserve={handleReserve}
              />
            )}
            <div className={sticky ? "tab-menu hide" : "tab-menu desktop"}>
              <Link
                className="tab-menu-item"
                to="recommendMenu"
                spy
                smooth
                duration={150}
                offset={-120}
              >
                ネイリー
              </Link>
              <Link
                className="tab-menu-item"
                to="design"
                spy
                smooth
                duration={150}
                offset={-105}
              >
                デザイン
              </Link>
              <Link
                className="tab-menu-item"
                to="menu"
                spy
                smooth
                duration={150}
                offset={-100}
              >
                メニュー
              </Link>
              <Link
                className="tab-menu-item"
                to="salon"
                spy
                smooth
                duration={150}
                offset={-100}
              >
                サロン
              </Link>
              <Link
                className="tab-menu-item"
                to="review"
                spy
                smooth
                duration={150}
                offset={-100}
              >
                レビュー
              </Link>
            </div>
            <div
              className={sticky ? "tab-menu tab-menu-sticky" : "tab-menu hide"}
            >
              <Container className="inner-tab-menu">
                <Link
                  className="tab-menu-item"
                  to="recommendMenu"
                  spy
                  smooth
                  duration={150}
                  offset={-120}
                >
                  ネイリー
                </Link>
                <Link
                  className="tab-menu-item"
                  to="design"
                  spy
                  smooth
                  duration={150}
                  offset={-105}
                >
                  デザイン
                </Link>
                <Link
                  className="tab-menu-item"
                  to="menu"
                  spy
                  smooth
                  duration={150}
                  offset={-100}
                >
                  メニュー
                </Link>
                <Link
                  className="tab-menu-item"
                  to="salon"
                  spy
                  smooth
                  duration={150}
                  offset={-100}
                >
                  サロン
                </Link>
                <Link
                  className="tab-menu-item"
                  to="review"
                  spy
                  smooth
                  duration={150}
                  offset={-100}
                >
                  レビュー
                </Link>
              </Container>
            </div>

            <div className="detail-my-page">
              <div
                className="manicurist-block manicurist-block--recommend-menu"
                id="recommendMenu"
              >
                <div className="heading-manicurist-block">
                  <i className="icon-check" />
                  <h3>おすすめメニュー</h3>
                </div>
                <div className="inner-manicurist-block">
                  <BookWrapper
                    isAvailableBooking={isAvailableBooking}
                    linkData={shareLink}
                    onReserve={() => handleReserve(recommendMenu)}
                  >
                    <MenuItem
                      className="recommend-menu-item"
                      data={recommendMenu}
                    />
                  </BookWrapper>
                </div>
              </div>

              <div
                className="manicurist-block manicurist-block--design"
                id="design"
              >
                <div className="heading-manicurist-block">
                  <i className="icon-nail" />
                  <h3>デザイン</h3>
                </div>
                <div className="inner-manicurist-block">
                  <div className="list-post">
                    <Grid container spacing={1}>
                      {dataPost.length > 0 ? (
                        dataPost.map((post, index) => (
                          <Grid item xs={4} sm={3} key={post.objectId}>
                            <PostThumbnail
                              data={post}
                              last={index === lastPost}
                              userId={_get(data, "user.objectId")}
                            />
                          </Grid>
                        ))
                      ) : (
                        <EmptyBlock type="POSTS" />
                      )}
                    </Grid>
                  </div>
                </div>
              </div>

              <div
                className="manicurist-block manicurist-block--menu"
                id="menu"
              >
                <div className="heading-manicurist-block">
                  <i className="icon-menu" />
                  <h3>メニュー</h3>
                </div>
                <div className="inner-manicurist-block">
                  {menus && menus.length > 0 ? (
                    menus.slice(0, 3).map((item) => (
                      <MenuItem
                        key={item.objectId}
                        data={item}
                        {...(isAvailableBooking
                          ? {
                              onClick: () => {
                                trackEvent({
                                  event: "start_request",
                                  nailist_id: query.nailieId,
                                });
                                handleReserve(item);
                              },
                            }
                          : {})}
                      />
                    ))
                  ) : (
                    <EmptyBlock type="MENU" />
                  )}
                  {menus && menus.length > 3 && (
                    <div className="control-btn">
                      <LinkButton
                        className="show-more-btn"
                        variant="outlined"
                        color="primary"
                        endIcon={<i className="icon-angle-right" />}
                        onClick={() =>
                          trackEvent({
                            event: "start_request",
                            nailist_id: query.nailieId,
                          })
                        }
                        href={`/nailist/${_get(data, "user.objectId")}/menus`}
                        scroll
                      >
                        メニューをさらに表示
                      </LinkButton>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="manicurist-block manicurist-block--salon"
                id="salon"
              >
                <div className="heading-manicurist-block">
                  <i className="icon-house" />
                  <h3>サロン情報</h3>
                </div>
                <div className="inner-manicurist-block">
                  {_isEmpty(salon) ? (
                    <EmptyBlock type="SALON" />
                  ) : (
                    <SalonBlock data={salon} />
                  )}
                </div>
              </div>

              <div className="manicurist-block" id="review">
                <div className="heading-manicurist-block">
                  <i className="icon-star" />
                  <h3>レビュー</h3>
                </div>
                <div className="inner-manicurist-block">
                  <ReviewBlock data={reviews} user={_get(data, "user")} />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </BookingLayout>
    </Layout>
  );
};

export async function getStaticPaths() {
  const res = await searchNailist({ limit: AMOUNT_MANICURIST.OURMANICURIST });
  const manucurists = _get(res, "users");

  const paths = manucurists
    ? manucurists.map((manucurist) => ({
        params: { nailieId: manucurist.objectId },
      }))
    : null;

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const snapshot = await getMyPageSideCustomer({ objectId: params.nailieId });
  const shareLink = await getDeepLinkToShare({ objectId: params.nailieId });

  return {
    props: { data: snapshot, shareLink },
    revalidate: 1,
  };
}

export default MyPage;
