/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import _get from "lodash/get";
import Grid from "@material-ui/core/Grid";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import Container from "@material-ui/core/Container";
import { LIMIT } from "@utils/constants";
import { getPosts, getMyPageSideCustomer } from "@providers/nailist-actions";
import HeaderPage from "@components/HeaderWidthBackButton";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import PostThumbnail from "containers/nailist/PostThumbnail";
import BookingLayout from "containers/nailist/BookingLayout";

const PostList = ({ data, user, salon }) => {
  const [listItems, setListItems] = useState(data || []);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!(data.length < LIMIT));
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
      getPosts({ page: pageNumber, objectId: user.objectId })
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
      text: _get(user, "username") || "NO NAME",
      href: `/nailist/${_get(user, "objectId")}`,
    },
    {
      text: "デザイン一覧",
    },
  ];

  return (
    <Layout hiddenFooter>
      <Breadcrumbs data={breadcrumbs} className="my-nailist-bc" />
      <BookingLayout user={user} onReserve={handleReserve}>
        <div className="post-page">
          <Container>
            <HeaderPage
              title="デザイン"
              nameIconTitle="icon-nail"
              handleBack={`/nailist/${user.objectId}`}
              userData={user}
            />
            <div className="list-post">
              <Grid container spacing={1}>
                {listItems.length > 0 &&
                  listItems.map((item) => (
                    <Grid item xs={4} md={3} key={item.objectId}>
                      <PostThumbnail data={item} userId={user.objectId} />
                    </Grid>
                  ))}
                {!loading && hasMore && (
                  <div
                    ref={setElement}
                    style={{ background: "transparent" }}
                  ></div>
                )}
              </Grid>
            </div>
          </Container>
        </div>
      </BookingLayout>
    </Layout>
  );
};

PostList.getInitialProps = async ({ query }) => {
  const snapshot = await getPosts({ objectId: query.nailieId });
  const generalUser = await getMyPageSideCustomer({ objectId: query.nailieId });
  return { data: snapshot, user: generalUser.user, salon: generalUser.salon };
};

export default PostList;
