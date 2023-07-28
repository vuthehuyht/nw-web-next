/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import NumberFormat from "react-number-format";
import IconButton from "@material-ui/core/IconButton";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Highlighter from "react-highlight-words";
import { useCookies } from "react-cookie";
import Carousel from "react-multi-carousel";
import {
  getDetailPost,
  getMyPageSideCustomer,
  getDeepLinkToShare,
} from "@providers/nailist-actions";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import ErrorPage from "pages/_error";
import BookWrapper from "containers/nailist/BookButton";
import Helper from "@utils/helper";

const DetailPost = ({ data, user, salon }) => {
  if (
    _get(data, "status") === "error" ||
    !_isEqual(_get(data, "createdBy.objectId"), _get(user, "objectId"))
  ) {
    return <ErrorPage />;
  }
  const [linkData, setLinkData] = useState();
  const [hashTagList, setHashTagList] = useState([]);
  const { push, query, back } = useRouter();
  const [, setCookie, removeCookie] = useCookies(["booking-data"]);
  const isAvailableBooking = _get(user, "availableBooking");
  const nailistId = _get(user, "objectId");
  const hasMultipleImages = _get(data, "nailImages") || [];

  useEffect(() => {
    getDeepLinkToShare({ objectId: _get(data, "createdBy.objectId") })
      .then((result) => {
        if (result.status && result.status === "error") {
          return;
        }
        setLinkData(result);
      })
      .catch((e) => {
        console.log("error: ", e);
      });
    if (_get(data, "hashtag")) {
      const tags = [];
      _get(data, "hashtag").map((item) => tags.push(`#${item}`));
      setHashTagList(tags);
    }
  }, []);

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
      text: _get(salon, "salonAreaDetail.region.text") || "REGION",
      href: `/search?region=${_get(
        salon,
        "salonAreaDetail.region.id"
      )}&sortBy=RECOMMEND`,
    },
    {
      text: _get(salon, "salonAreaDetail.prefecture.text") || "PREFECTURE",
      href: `/search?region=${_get(
        salon,
        "salonAreaDetail.region.id"
      )}&prefecture=${_get(
        salon,
        "salonAreaDetail.prefecture.id"
      )}&sortBy=RECOMMEND`,
    },
    {
      text: _get(salon, "salonAreaDetail.wards.text") || "WARDS",
      href: `/search?region=${_get(
        salon,
        "salonAreaDetail.region.id"
      )}&prefecture=${_get(
        salon,
        "salonAreaDetail.prefecture.id"
      )}&wards=${_get(salon, "salonAreaDetail.wards.id")}&sortBy=RECOMMEND`,
    },
    {
      text: _get(user, "username") || "NO NAME",
      href: `/nailist/${_get(user, "objectId")}`,
    },
    {
      text: "デザイン一覧",
      href: `/nailist/${_get(user, "objectId")}/posts`,
    },
    {
      text: _get(data, "objectId"),
    },
  ];

  return (
    <Layout hiddenFooter hiddenHeader>
      <div className="manicurist-detail-post">
        <Breadcrumbs data={breadcrumbs} className="detail-post-br" />
        <div className="manicurist-detail-post--heading">
          <div className="control-btn">
            <IconButton
              className="back-btn"
              onClick={() => {
                if (Helper.canGoBack()) {
                  back();
                } else {
                  push(`/nailist/${_get(data, "createdBy.objectId")}/posts`);
                }
              }}
              aria-label="back"
              scroll
            >
              <i className="icon-angle-left" />
            </IconButton>
          </div>
          <div className="heading">
            <img src="/assets/images/logo_black.svg" alt="Nailie" />
          </div>
        </div>
        <div className="manicurist-detail-post__inner">
          {hasMultipleImages?.length > 1 ? (
            <Carousel
              className="detail-post-banner-list"
              arrows
              keyBoardControl
              showDots
              centerMode={false}
              itemClass="news-item"
              draggable={false}
              infinite
              responsive={{
                desktop: {
                  breakpoint: {
                    max: 3000,
                    min: 1024,
                  },
                  items: 1,
                },
                mobile: {
                  breakpoint: {
                    max: 464,
                    min: 0,
                  },
                  items: 1,
                },
                tablet: {
                  breakpoint: {
                    max: 1024,
                    min: 464,
                  },
                  items: 1,
                },
              }}
              slidesToSlide={1}
            >
              {hasMultipleImages.map((index) => (
                <div className={`detail-post-banner ${index}`} key={index}>
                  <div
                    className="blur-img"
                    style={{
                      backgroundImage: `url("${index}")`,
                    }}
                  />
                  {/* <div className="blur-img">
                    <img src={index} alt={_get(data, "createdBy.name")} />
                  </div> */}
                  <div className="thumbnail-banner">
                    <img
                      src={index}
                      alt={_get(data, "createdBy.name")}
                      className="img"
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="detail-single-post-banner">
              <div className="blur-single-img">
                <img
                  src={_get(data, "nailImage")}
                  alt={_get(data, "createdBy.name")}
                />
              </div>
              <div className="thumbnail-single-banner">
                <img
                  src={_get(data, "nailImage")}
                  alt={_get(data, "createdBy.name")}
                  className="img"
                />
              </div>
            </div>
          )}
          <div className="detail-post-content">
            <div className="count">
              <i className="icon-like" />
              <div className="count__inner">
                <span>{_get(data, "bookmarkCount")}</span>
                <span>いいね！</span>
              </div>
            </div>
            <div className="info">
              <div className="info__user">
                <div className="user">
                  <div className="img-banner user__avatar">
                    <div className="img-banner__inner">
                      <Link href={`/nailist/${nailistId}`}>
                        <a>
                          <img
                            src={_get(data, "createdBy.avatar")}
                            alt={_get(data, "createdBy.name")}
                            className="img"
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div className="user__content">
                    <Link href={`/nailist/${nailistId}`}>
                      <a>
                        <h2 className="username">
                          {_get(data, "createdBy.name")}
                        </h2>
                      </a>
                    </Link>
                    <h3 className="salonname">{_get(data, "salon.name")}</h3>
                    <div className="rating-info">
                      <span className="rating">
                        {_get(data, "createdBy.totalAverage")}
                      </span>
                      <Rating
                        readOnly
                        precision={0.5}
                        value={_get(data, "createdBy.totalAverage") || 0}
                        icon={<i className="icon-star" />}
                        size="small"
                      />
                      <span className="inner-info">
                        ({_get(data, "createdBy.countReview")}件)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="info__salon">
                <div className="salon">
                  <i className="icon-location" />
                  <span className="salon__inner">
                    {_get(data, "salon.salonArea")}
                  </span>
                </div>
              </div>
            </div>

            {_get(data, "caption") && (
              <Highlighter
                highlightClassName="highlight-txt"
                searchWords={hashTagList}
                autoEscape
                textToHighlight={_get(data, "caption")}
              />
            )}
            <Typography className="create-date" component="p">
              {moment(_get(data, "createdAt.iso")).format("YYYY/MM/DD")}
            </Typography>
            {_get(data, "taggedMenu") &&
              _get(data, "taggedMenu.state") === "ACTIVE" &&
              isAvailableBooking && (
                <BookWrapper
                  className="manicurist-price-box"
                  linkData={linkData}
                  onReserve={() => handleReserve(_get(data, "taggedMenu"))}
                >
                  <>
                    <div className="left-book-wrapper">
                      <span className="title">
                        {_get(data, "taggedMenu.title")}
                      </span>
                      <NumberFormat
                        value={_get(data, "taggedMenu.price")}
                        displayType={"text"}
                        prefix={"¥"}
                        thousandSeparator
                        renderText={(value) => (
                          <span className="price">{value}</span>
                        )}
                      />
                    </div>
                    <div className="right-book-wrapper">予約に進む</div>
                  </>
                </BookWrapper>
              )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

DetailPost.getInitialProps = async ({ query }) => {
  const snapshot = await getDetailPost({ objectId: query.postId });
  const generalUser = await getMyPageSideCustomer({ objectId: query.nailieId });
  return { data: snapshot, user: generalUser.user, salon: generalUser.salon };
};

export default DetailPost;
