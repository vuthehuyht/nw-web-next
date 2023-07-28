import { Fragment, useEffect } from "react";
import Head from "next/head";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import Script from "next/script";
import { CookiesProvider } from "react-cookie";
import { ToastContainer } from "react-toastify";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@material-ui/styles";
import { QueryClient, QueryClientProvider } from "react-query";
import { isMobileSafari } from "react-device-detect";
import SEO from "next-seo.config";
import "react-multi-carousel/lib/styles.css";
import "../styles/root.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { wrapper } from "store";
import {
  useFetchUser,
  useWebCookie,
  useCountBookingCardError,
  useFetchNotReviewedBookings,
  usePageViewEvent,
} from "hooks";
import ConfirmModal from "components/ConfirmModal";
import NotReviewedBookingModal from "containers/Review/NotReviewedBookingModal";
import AutoCancelBookingModal from "containers/Booking/AutoCancelBookingModal";
import CompleteProfileModal from "containers/Auth/CompleteProfileModal";
import Backdrop from "components/Backdrop";
import webPageUrl from "lib/webPageUrl";
import theme from "../styles/theme";

const queryClient = new QueryClient();

const CouponModal = dynamic(() =>
  import("containers/Booking/BookingConfirmation/CouponModal")
);

function MyApp({ Component, pageProps, router }) {
  // Loading resources
  const { currentUserId } = useFetchUser();
  useCountBookingCardError();
  useFetchNotReviewedBookings();
  usePageViewEvent();

  const { asPath } = useRouter();

  return (
    <Fragment>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
        ></link>
        <title>ネイリー（Nailie）</title>
        <meta
          name="keywords"
          content="ネイルサロン,ネイリスト,ネイル,ネイルデザイン,予約,ネイリー,Nailie"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `function tempAlert(msg,duration){
                var el = document.getElementById("text-copy");
                el.setAttribute("style","opacity:1;overflow:hidden;");
                el.innerHTML = msg;
                setTimeout(function(){
                  el.removeAttribute("style");
                },duration);
              };`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `function copyCode(e) {
                if (e) {
                  e.preventDefault();
                }
                var aux = document.getElementById("codeTxt");
                aux.setAttribute("value", document.getElementById("code").innerHTML);
                aux.select();
                document.execCommand("copy");
                console.log("コピー RESULT:",document.execCommand('copy'));
                tempAlert("[" + aux.value + "]をコピーしました", 3000);
                return false;
              };`,
          }}
        />
      </Head>
      {isMobileSafari && (
        <Script
          id="hideBannerOnSafari"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `setTimeout(window.scrollBy(0, 40), 300);`,
          }}
        />
      )}
      <DefaultSeo {...SEO} />
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            {Component.auth ? (
              <Auth privateRoute={Component.auth.private}>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} key={router.route} />
            )}
            <Backdrop />
            <ConfirmModal />
            <NotReviewedBookingModal />
            <AutoCancelBookingModal />
            <CompleteProfileModal />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar
              pauseOnHover
              closeButton={false}
            />
            {/* Global popup but dynamic import based on some conditions */}
            {asPath === webPageUrl.COUPON_LIST.source && currentUserId && (
              <CouponModal open />
            )}
          </ThemeProvider>
        </QueryClientProvider>
      </CookiesProvider>
    </Fragment>
  );
}

const Auth = ({ children, privateRoute }) => {
  const { webCookie } = useWebCookie();
  const { replace, query, pathname } = useRouter();
  const { redirect, ...otherQuery } = query;
  const isUser = !!webCookie;

  useEffect(() => {
    // The user hasn't logged in and the route requires login
    if (!isUser && privateRoute) {
      replace({
        pathname: "/login",
        query: { ...otherQuery, redirect: pathname },
      });
    }
    // The user logged in, and the current path is only public (login, register)
    if (isUser && !privateRoute) {
      replace({ pathname: redirect || "/", query: otherQuery });
    }
  }, [isUser, privateRoute, redirect, replace, otherQuery, pathname]);

  if ((isUser && privateRoute) || (!isUser && !privateRoute)) {
    return children;
  }

  return <div />;
};

export default wrapper.withRedux(MyApp);
