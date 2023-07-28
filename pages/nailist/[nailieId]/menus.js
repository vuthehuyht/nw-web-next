/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import _get from "lodash/get";
import _filter from "lodash/filter";
import Container from "@material-ui/core/Container";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { LIMIT } from "@utils/constants";
import { getMenus, getMyPageSideCustomer } from "@providers/nailist-actions";
import HeaderPage from "@components/HeaderWidthBackButton";
import Layout from "@components/Layout";
import Breadcrumbs from "@components/Breadcrumbs";
import MenuItem from "containers/nailist/MenuItem";
import BookingLayout from "containers/nailist/BookingLayout";

const MenuList = ({ data, user, salon }) => {
  const isAvailableBooking = _get(user, "availableBooking");
  const [listItems, setListItems] = useState(data || []);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!(data.length < LIMIT));
  const observer = useRef();
  const [, setCookie, removeCookie] = useCookies(["booking-data"]);
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
      getMenus({ page: pageNumber, objectId: user.objectId })
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
      text: "メニュー一覧",
    },
  ];

  const normalMenus = (listItems || []).filter(
    (list) => list.type === "NORMAL"
  );

  // pick menu title add to description meta
  const menuTitleDes = [];
  let listSubMenu = [];
  normalMenus.map((i) => listSubMenu.push(...i.menus));
  listSubMenu = _filter(listSubMenu, ["state", "ACTIVE"]);
  const amoutMenu = listSubMenu.length > 3 ? 3 : listSubMenu.length;
  for (let q = 0; q < amoutMenu; q += 1) {
    menuTitleDes.push(listSubMenu[q].title);
  }

  return (
    <Layout hiddenFooter>
      <Breadcrumbs data={breadcrumbs} className="my-nailist-bc" />
      <BookingLayout user={user} onReserve={handleReserve}>
        <div className="menu-page">
          <Container>
            <HeaderPage
              title="メニュー"
              nameIconTitle="icon-menu"
              handleBack={`/nailist/${user.objectId}`}
              userData={user}
            />
            <div className="list-menu">
              {normalMenus.length > 0 &&
                normalMenus.map((item) => (
                  <div className="menu-block" key={item.objectId}>
                    <div className="menu-heading">
                      <h3>{item.title}</h3>
                    </div>
                    <div className="menu-details">
                      {item.menus.map((subMenu) => (
                        <MenuItem
                          className="sub-menu"
                          key={subMenu.objectId}
                          data={subMenu}
                          {...(isAvailableBooking
                            ? { onClick: () => handleReserve(subMenu) }
                            : {})}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              {!loading && hasMore && (
                <div
                  ref={setElement}
                  style={{ background: "transparent" }}
                ></div>
              )}
            </div>
          </Container>
        </div>
      </BookingLayout>
    </Layout>
  );
};

MenuList.getInitialProps = async ({ query }) => {
  const snapshot = await getMenus({ objectId: query.nailieId });
  const generalUser = await getMyPageSideCustomer({ objectId: query.nailieId });
  return { data: snapshot, user: generalUser.user, salon: generalUser.salon };
};

export default MenuList;
