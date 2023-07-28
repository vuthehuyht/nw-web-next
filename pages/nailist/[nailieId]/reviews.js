/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import _get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { LIMIT } from "@utils/constants";
import { getReviews, getMyPageSideCustomer } from "@providers/nailist-actions";
import HeaderPage from "@components/HeaderWidthBackButton";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import ReviewItem from "containers/nailist/ReviewItem";
import GeneralReviewBox from "containers/nailist/GeneralReviewBox";
import BookingLayout from "containers/nailist/BookingLayout";

const ReviewList = ({ data, statistics, dataUser, salon }) => {
  const [listItems, setListItems] = useState(data || []);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!(data.length < LIMIT));
  const user = data[0]?.nailist;
  const observer = useRef();
  const [, , removeCookie] = useCookies(["booking-data"]);
  const { push, query } = useRouter();

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setPageNumber((page) => page + 1);
        }
      },
      { root: null, rootMargin: "20px", threshold: 1.0 }
    );
  }, []);
  const [element, setElement] = React.useState(null);

  useEffect(() => {
    if (pageNumber > 1) {
      setLoading(true);
      getReviews({ page: pageNumber, objectId: user.objectId })
        .then((result) => {
          setLoading(false);
          if (result.status && result.status === "error") {
            return;
          }
          setListItems([...listItems, ...result]);
          setHasMore(!(result.length < LIMIT));
        })
        .catch((e) => {
          console.log("error: ", e);
        });
    }
  }, [pageNumber]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  const handleReserve = () => {
    removeCookie("booking-data", { path: "/" });
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
      text: _get(dataUser, "username") || "NO NAME",
      href: `/nailist/${_get(dataUser, "objectId")}`,
    },
    {
      text: "レビュー一覧",
    },
  ];

  return (
    <Layout hiddenFooter>
      <Breadcrumbs data={breadcrumbs} className="my-nailist-bc" />
      <BookingLayout user={dataUser} onReserve={handleReserve}>
        <div className="review-block review-page">
          <Container>
            <HeaderPage
              title="レビュー"
              nameIconTitle="icon-star"
              handleBack={`/nailist/${user?.objectId}`}
              userData={user}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <GeneralReviewBox data={statistics} />
              </Grid>
              <Grid item xs={12} md={8}>
                <div className="list-reviewer">
                  {listItems.map((item) => (
                    <ReviewItem
                      key={item.objectId}
                      data={item}
                      user={item.nailist}
                    />
                  ))}
                  {!loading && hasMore && (
                    <div
                      ref={setElement}
                      style={{ background: "transparent" }}
                    ></div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>
      </BookingLayout>
    </Layout>
  );
};

ReviewList.getInitialProps = async ({ query }) => {
  const snapshot = await getReviews({ objectId: query.nailieId });
  const generalReview = await getMyPageSideCustomer({
    objectId: query.nailieId,
  });
  return {
    data: snapshot,
    statistics: generalReview.reviews.statistics,
    salon: generalReview.salon,
    dataUser: generalReview.user,
  };
};

export default ReviewList;
