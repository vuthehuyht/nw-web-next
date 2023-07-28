import { useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { pick } from "lodash";
import { useCookies } from "react-cookie";
import { useWebCookie } from "hooks";

const EVENTS = {
  "/nailist/[nailieId]": {
    event: "nailist_detail",
    params: ["nailist_id"],
  },
  "/search": {
    event: "search_list",
    params: [
      "region",
      "prefecture",
      "wards",
      "menu_id",
      "price_max",
      "price_min",
    ],
  },
  "/nailist/[nailieId]/posts": {
    event: "view_post",
    params: ["nailist_id"],
  },
};

const usePageViewEvent = () => {
  const { events, query, pathname, isReady } = useRouter();
  const [, setCookie] = useCookies(["prevUrl"]);
  const savedUrlRef = useRef();
  const specificSavedUrlRef = useRef();
  const pathnameRef = useRef();
  const queryRef = useRef();

  pathnameRef.current = pathname;
  queryRef.current = query;
  const { webCookie } = useWebCookie();

  const identificationParams = useMemo(
    () => ({
      is_login: !!webCookie,
      user_id: webCookie?.objectId || "",
    }),
    [webCookie]
  );

  const pageview = useCallback(
    (url) => {
      window.dataLayer?.push({
        ...identificationParams,
        event: "pageview",
        page: `${process.env.DOMAIN_NAME}${url}`,
        ...(savedUrlRef.current
          ? {
              original_location: `${process.env.DOMAIN_NAME}${savedUrlRef.current}`,
            }
          : {}),
      });
      setCookie("prevUrl", savedUrlRef.current || "");
      savedUrlRef.current = url;
    },
    [identificationParams, setCookie]
  );

  const specificPageview = useCallback(
    (url) => {
      if (EVENTS[pathnameRef.current] && isReady) {
        const formatQuery = {
          ...queryRef.current,
          nailist_id: queryRef.current.nailieId,
          menu_id: queryRef.current.menuCategory,
          price_min: queryRef.current.minPrice,
          price_max: queryRef.current.maxPrice,
        };

        window.dataLayer?.push({
          event: EVENTS[pathnameRef.current].event,
          page: `${process.env.DOMAIN_NAME}${url}`,
          ...identificationParams,
          ...pick(formatQuery, EVENTS[pathnameRef.current].params),
          ...(specificSavedUrlRef.current
            ? {
                original_location: `${process.env.DOMAIN_NAME}/${specificSavedUrlRef.current}`,
              }
            : {}),
        });
      }
      specificSavedUrlRef.current = url;
    },
    [identificationParams, isReady]
  );

  useEffect(() => {
    events.on("routeChangeComplete", pageview);
    return () => {
      events.off("routeChangeComplete", pageview);
    };
  }, [events, pageview]);

  useEffect(() => {
    events.on("routeChangeComplete", specificPageview);
    return () => {
      events.off("routeChangeComplete", specificPageview);
    };
  }, [events, specificPageview]);
};

export default usePageViewEvent;
