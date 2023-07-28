import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";
import _get from "lodash/get";
import _filter from "lodash/filter";
import _isEmpty from "lodash/isEmpty";
import _union from "lodash/union";
import { toast } from "react-toastify";
import BookingMenu from "containers/Booking/BookingMenus";
import BookingConfirmation from "containers/Booking/BookingConfirmation";
import Layout from "components/Layout";
import {
  useMenusBookingByUser,
  useAvailbleTime,
  useConfirmationStep,
  useWebCookie,
  useSpecificPageViewEvent,
} from "hooks";
import ArrowStepper from "components/Booking/ArrowStepper";
import Calendar from "@components/Booking/CustomCalendar";
import Timetable from "components/Timetable";
import { NUMBER_OF_DAY, NO_OFF, PAYMENT_METHOD } from "utils/constants";
import {
  requestBooking,
  getCouponDetail,
  getStatusDirectBookingForNailist,
} from "providers/BookingProvider/actions";
import {
  switchBackdropVisible,
  switchConfirmModal,
} from "providers/GeneralProvider/slice";
import ComfirmComplete from "components/ConfirmComplete";
import BookingUtil from "@utils/bookingUtil";
import helper from "@utils/helper";

const bookingCookieName = "booking-data";

const START_DATE = "2021-09-15";

const BookingPage = () => {
  const dispatch = useDispatch();
  const updateUserFormRef = useRef(null);
  const { webCookie } = useWebCookie();
  const [cookies, setCookie, removeCookie] = useCookies([bookingCookieName]);
  const { query, push, asPath, replace } = useRouter();
  const [bookingResult, setBookingResult] = useState();
  const [selectedCoupon, setSelectedConpon] = useState();
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const { step, nailistId } = query;
  const { trackEvent } = useSpecificPageViewEvent();
  const bookingCookie = useMemo(
    () => cookies[bookingCookieName] || {},
    [cookies]
  );
  const { menus: menuBookings, bookingDate } = bookingCookie;
  // Fetch data for step 1
  const { menus, loading, handleGetMenusBookingByUser } = useMenusBookingByUser(
    { userId: nailistId }
  );
  // Fetch data for step 2
  const {
    loading: availableTimeLoading,
    notAvailableDate,
    openCloseTime,
    availableTimeByDay,
    maxBookingDay,
    handleGetAvailableTime,
  } = useAvailbleTime({ userId: nailistId, menuBookings, step });

  // Fetch data for step 3
  const {
    loading: confirmationLoading,
    cancelPolicy,
    bookingCalculation,
    cardList,
    defaultCard,
    hasBooking,
    phonetic,
    fullName,
    phone,
    nailistUsername,
    nailistAvatar,
    isDirectBooking,
    handleUpdateUserInformation,
    // eslint-disable-next-line prettier/prettier
  } = useConfirmationStep({
    step,
    menuBookings,
    nailistId,
    bookingDate,
    bookingResult,
  });
  const isLoadingUser = useSelector((state) => state.auth.isLoading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const couponList = _get(currentUser, "couponList", []);

  useEffect(() => {
    setSelectedConpon();
    setBookingResult();
  }, [step]);

  // Submit step 1
  const handleSubmitMenu = (value) => {
    trackEvent({ event: "ChoseMenuBooking", nailist_id: nailistId });
    const formattedMenus = value.map((menu) => {
      const formatMenu = { ...menu };
      delete formatMenu.recommend;
      if (formatMenu.optionId === NO_OFF.objectId) {
        delete formatMenu.optionId;
      }
      return formatMenu;
    });
    setCookie(
      bookingCookieName,
      {
        ...bookingCookie,
        nailistId,
        menus: formattedMenus,
      },
      { path: "/" }
    );
    push({
      pathname: asPath,
      query: { step: "date" },
    });
  };

  const resetInitialData = (value) => {
    if (value === "menu") {
      setCalendarDate(_get(availableTimeByDay, "[0].date"));
    }
  };

  const getDateHaveNotSlots = () => {
    const results = [];
    const arrDateHaveNotSlots = _filter(availableTimeByDay, (item) =>
      _isEmpty(item.slots)
    );
    arrDateHaveNotSlots.map((itemDate) => results.push(itemDate.date));
    return results;
  };
  // Submit step 2
  const handleSelectDateTime = ({ slot, bookingDatetime }) => {
    setCookie(
      bookingCookieName,
      {
        ...bookingCookie,
        slot,
        bookingDate: bookingDatetime,
      },
      { path: "/" }
    );
    if (webCookie) {
      trackEvent({ event: "ChoseTimeBooking", nailist_id: nailistId });
      push({
        pathname: `/booking/${nailistId}`,
        query: { step: "confirmation" },
      });
    } else {
      push({
        pathname: "/register",
        query: { redirect: `/booking/${nailistId}`, step: "confirmation" },
      });
    }
  };

  const handleRequestBooking = useCallback(
    async (updateUserData) => {
      try {
        dispatch(switchBackdropVisible(true));
        if (!hasBooking) {
          handleUpdateUserInformation(updateUserData);
        }
        const result = await requestBooking({
          ...bookingCookie,
          cancelPolicy: cancelPolicy.name,
          cardId: defaultCard,
          paymentMethod: PAYMENT_METHOD.ONLINE,
          phonetic: _get(updateUserData, "furigana", phonetic),
          fullName: _get(updateUserData, "fullName", fullName),
          phone,
          menuBookings: bookingCookie.menus,
          latestMenuChangeMoment: BookingUtil.getLatestMenuChangeMoment(
            menus,
            _union(...bookingCookie.menus.map((menu) => Object.values(menu)))
          ),
          couponId: _get(selectedCoupon, "objectId"),
        });
        dispatch(switchBackdropVisible(false));
        const statusBooking = await getStatusDirectBookingForNailist({
          userId: nailistId,
        });
        trackEvent({
          event: "af_purchase",
          booking_id: result.objectId,
          nailist_id: nailistId,
          total_price: _get(bookingCalculation, "totalPrice"),
          type: statusBooking ? "auto_confirmed" : "standard",
        });
        setBookingResult(result);
        removeCookie(bookingCookieName, { path: "/" });
      } catch (error) {
        dispatch(switchBackdropVisible(false));
        const errorCode = _get(error, "error.code");
        if ([9006, 137, 152].includes(errorCode)) {
          handleGetAvailableTime();
          replace({
            pathname: `/booking/${nailistId}`,
            query: { step: "date" },
          });
        } else if (errorCode === 9023) {
          handleGetMenusBookingByUser(nailistId);
          replace({
            pathname: `/booking/${nailistId}`,
          });
        }
        helper.toastError(error);
      }
      // eslint-disable-next-line prettier/prettier
    },
    [
      dispatch,
      hasBooking,
      bookingCookie,
      cancelPolicy?.name,
      defaultCard,
      phonetic,
      fullName,
      phone,
      menus,
      selectedCoupon,
      trackEvent,
      nailistId,
      removeCookie,
      handleUpdateUserInformation,
      handleGetAvailableTime,
      replace,
      handleGetMenusBookingByUser,
    ]
  );

  // Submit step 3
  const handleSubmitConfirmation = (updateUserData) => {
    dispatch(
      switchConfirmModal({
        visible: true,
        data: {
          title: "予約を確定",
          message: isDirectBooking
            ? "こちらの内容で予約を確定します。よろしいですか？"
            : "予約リクエストを送信しますか？",
          cancelText: "いいえ",
          confirmText: "はい",
          onConfirm: () => handleRequestBooking(updateUserData),
        },
      })
    );
  };

  const handleBookingComplete = () => {
    replace("/booking-management");
  };

  const handleSelectCoupon = useCallback(
    async (coupon) => {
      dispatch(switchBackdropVisible(true));
      try {
        const result = await getCouponDetail({
          ...bookingCookie,
          code: coupon.realCouponCode || coupon.code,
          priceBooking: bookingCalculation.totalPrice,
        });
        if (result.isAvailable) {
          setSelectedConpon(coupon);
          setOpenCouponModal(false);
        } else {
          toast.info(
            BookingUtil.handleCouponError({
              ...result,
              startTime: moment(_get(result, "startTime.iso"), "M月d日"),
              endTime: moment(_get(result, "endTime.iso"), "M月d日"),
            })
          );
        }
      } catch (error) {
        helper.toastError(error);
      }
      dispatch(switchBackdropVisible(false));
    },
    [bookingCalculation?.totalPrice, bookingCookie, dispatch]
  );

  const steps = [
    {
      objectId: "menu",
      order: 0,
      label: "メニュー選択",
      link: `/booking/${nailistId}`,
    },
    {
      objectId: "date",
      order: 1,
      label: "日時選択",
      link: `/booking/${nailistId}?step=date`,
    },
    {
      objectId: "confirmation",
      order: 2,
      label: "予約内容確認",
      link: `/booking/${nailistId}?step=confirmation`,
    },
  ];

  const renderStep = () => {
    if (step === "date") {
      if (availableTimeLoading) {
        return (
          <Box
            display="flex"
            justifyContent="center"
            className="datetime-choose-container loading"
          >
            <CircularProgress size={40} />
          </Box>
        );
      }
      return (
        <Box className="datetime-choose-container">
          <div className="schedule-container">
            <div className="text-noted">
              このネイリストは
              <span>{maxBookingDay || NUMBER_OF_DAY}日先まで</span>
              <br />
              の予約を受け付けています
            </div>

            <Calendar
              label="Birthday"
              min={new Date()}
              max={moment()
                .add(maxBookingDay - 1, "d")
                .toDate()}
              date={calendarDate}
              onDateChanged={(value) => setCalendarDate(value)}
              renderDateCell={(date, isCurrent) => {
                if (
                  !isCurrent &&
                  (notAvailableDate.includes(
                    moment(date).format("YYYY-MM-DD")
                  ) ||
                    getDateHaveNotSlots().includes(
                      moment(date).format("YYYY-MM-DD")
                    ))
                ) {
                  return (
                    <span className="full-booking-date">
                      <span className="date-cell">{date.getDate()}</span>
                      <i className="icon-close" />
                    </span>
                  );
                }
                return null;
              }}
            />
          </div>
          <div className="timetable-container">
            <Timetable
              dataAvailable={availableTimeByDay}
              startDate={_get(availableTimeByDay, "[0].date") || START_DATE}
              maxDay={maxBookingDay}
              initialDate={calendarDate}
              changeDate={(value) => setCalendarDate(value)}
              selectDatetimeBooking={handleSelectDateTime}
              openCloseTime={openCloseTime}
            />
          </div>
        </Box>
      );
    }
    if (step === "confirmation") {
      return (
        <BookingConfirmation
          nailistId={nailistId}
          bookingDate={bookingCookie.bookingDate}
          bookingSlot={bookingCookie.slot}
          menuBookings={menuBookings}
          menus={menus}
          nailistAvatar={nailistAvatar}
          nailistUsername={nailistUsername}
          isDirectBooking={isDirectBooking}
          cancelPolicy={cancelPolicy}
          bookingCalculation={bookingCalculation}
          cardList={cardList}
          defaultCard={defaultCard}
          hasBooking={hasBooking}
          phonetic={phonetic}
          fullName={fullName}
          phone={phone}
          loading={confirmationLoading || isLoadingUser || loading}
          onSubmit={handleSubmitConfirmation}
          updateUserInfo={handleUpdateUserInformation}
          ref={updateUserFormRef}
          // For coupon block and coupon modal
          couponList={couponList}
          onSelectCoupon={handleSelectCoupon}
          selectedCoupon={selectedCoupon}
          onDeselectCoupon={() => setSelectedConpon()}
          openCouponModal={openCouponModal}
          onCloseCouponModal={() => setOpenCouponModal(false)}
          onOpenCouponModal={() => setOpenCouponModal(true)}
        />
      );
    }
    return (
      <BookingMenu
        bookingMenus={menus}
        loading={loading}
        defaultValue={bookingCookie.menus}
        onSubmit={(value) => handleSubmitMenu(value)}
      />
    );
  };

  return (
    <Layout hiddenFooter hiddenHeaderMenu>
      <div className="booking-page-container">
        {bookingResult ? (
          <ComfirmComplete
            type={_get(bookingResult, "status")}
            bookingDate={_get(bookingResult, "bookingDate.iso")}
            bookingSlot={_get(bookingResult, "slot")}
            nailistAvatar={nailistAvatar}
            onComplete={handleBookingComplete}
          />
        ) : (
          <>
            <ArrowStepper
              steps={steps}
              activeStep={step || "menu"}
              chooseStep={resetInitialData}
            />
            {renderStep()}
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async ({ req, query, res }) => {
  const parsedCookie = helper.getRequestCookie(req);
  const bookingCookie = parsedCookie[bookingCookieName];
  const webCookie = parsedCookie["nw-cookie"];
  const parsedBookingCookie = bookingCookie ? JSON.parse(bookingCookie) : {};
  if (bookingCookie && parsedBookingCookie.nailistId !== query.nailistId) {
    const options = {};
    res.setHeader("Set-Cookie", [`booking-data=""; path=/;`]);
    if (query.step) {
      options.redirect = {
        destination: `/booking/${query.nailistId}`,
      };
    }
    return options;
  }
  // Redirect to 1st step if
  // 1. Not finish step 1, go to other step
  // 2. Not login and go to confirmation step
  // 3. Not finish date time selecton step, Go to confirmation step
  if (
    (!webCookie && query.step === "confirmation") ||
    (query.step === "date" && !_get(parsedBookingCookie, "menus"))
  ) {
    return {
      redirect: {
        destination: `/booking/${query.nailistId}`,
      },
    };
  }
  if (
    query.step === "confirmation" &&
    !_get(parsedBookingCookie, "bookingDate")
  ) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
};
export default BookingPage;
