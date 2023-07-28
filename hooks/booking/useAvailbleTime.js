import { useEffect, useState } from "react";
import _get from "lodash/get";
import moment from "moment-timezone";
import _isEmpty from "lodash/isEmpty";
import { usePrevious } from "hooks";
import {
  getDateNotAvailableTime,
  getAvailableTimesByDay,
} from "providers/BookingProvider/actions";

function getOpenAndCloseTime(data = {}) {
  const results = {
    open: _get(data, `${Object.keys(data)[0]}.openTime`),
    close: _get(data, `${Object.keys(data)[0]}.closeTime`),
  };
  // eslint-disable-next-line array-callback-return
  Object.keys(data).map((itemDay, index) => {
    if (index > 0) {
      if (Number(data[itemDay].openTime) < Number(results.open)) {
        results.open = data[itemDay].openTime;
      }
      if (Number(data[itemDay].closeTime) > Number(results.close)) {
        results.close = data[itemDay].closeTime;
      }
    }
  });
  // Actual closing time before closing time 30 min
  return { openTime: results.open, closeTime: Number(results.close) - 30 };
}

const useAvailbleTime = ({ userId, menuBookings, step }) => {
  const [loading, setLoading] = useState(false);
  const [notAvailableDate, setNotAvailableDate] = useState([]);
  const [openCloseTime, setOpenCloseTime] = useState({});
  const [availableTimeByDay, setAvailableTimeByDay] = useState([]);
  const [maxBookingDay, setMaxBookingDay] = useState(0);
  const prevStep = usePrevious(step);

  useEffect(() => {
    if (
      (!prevStep && step === "date") ||
      (prevStep === "confirmation" &&
        step === "date" &&
        _isEmpty(notAvailableDate))
    ) {
      setLoading(true);
      getDateNotAvailableTime({
        userId,
        menuBookings,
        // Using timezone here because VN time and JP time is 2 hours diff
        // When get data from 22h to 24h VN, we must convert to JP timezone
        startDate: moment().tz("Asia/Tokyo").format("YYYY-MM-DD").toString(),
      })
        .then(async (results) => {
          const dataAvailableTimes = await getAvailableTimesByDay({
            userId,
            menuBookings,
            numberOfDays: _get(results, "maxBookingDay"),
          });
          setNotAvailableDate(_get(results, "notAvailableDays"));
          setOpenCloseTime(getOpenAndCloseTime(_get(results, "weekdays")));
          setMaxBookingDay(_get(results, "maxBookingDay"));
          setAvailableTimeByDay(dataAvailableTimes);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuBookings, prevStep, userId, step, maxBookingDay]);

  const handleGetAvailableTime = () => {
    setLoading(true);
    getDateNotAvailableTime({
      userId,
      menuBookings,
    })
      .then(async (results) => {
        const dataAvailableTimes = await getAvailableTimesByDay({
          userId,
          menuBookings,
          numberOfDays: _get(results, "maxBookingDay"),
        });
        setNotAvailableDate(_get(results, "notAvailableDays"));
        setMaxBookingDay(_get(results, "maxBookingDay"));
        setAvailableTimeByDay(dataAvailableTimes);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return {
    loading,
    notAvailableDate,
    openCloseTime,
    availableTimeByDay,
    maxBookingDay,
    handleGetAvailableTime,
  };
};

export default useAvailbleTime;
