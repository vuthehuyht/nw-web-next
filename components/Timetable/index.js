/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line array-callback-return */
import { useEffect, useState } from "react";
import moment from "moment";
import clsx from "clsx";
import SwipeableViews from "react-swipeable-views";
import _get from "lodash/get";
import _find from "lodash/find";
import _indexOf from "lodash/indexOf";
import _keys from "lodash/keys";
import Button from "@material-ui/core/Button";
import Helper from "utils/helper";

const DEFAULT_ITEM_PER_PAGE = 7;

const ModuleDay = ({ rangeSlots = {}, title, dataSlots, handleClick }) => (
  <div className="module-day">
    <div
      className={clsx("module-day__title", {
        blue: moment(title).format("ddd") === "Sat",
        pink: moment(title).format("ddd") === "Sun",
      })}
    >
      {`${title.slice(-2)}
        ${moment(title).format("ddd")}`}
    </div>
    <div className="module-day__slots">
      {Object.keys(rangeSlots).length > 0 &&
        Object.keys(rangeSlots).map((key) =>
          _get(dataSlots, `${key}`, true) ? (
            <div key={key} className="module-hour not-available">
              <i className="icon-close" />
            </div>
          ) : (
            <div key={key} className="module-hour available">
              <Button
                onClick={() =>
                  handleClick({
                    slot: key,
                    bookingDatetime: title,
                  })
                }
              >
                <i className="icon-active-booking" />
              </Button>
            </div>
          )
        )}
    </div>
  </div>
);

function getDefaultRangeSlotTimes(startTime, endTime) {
  const slotResults = {};
  for (
    let start = Math.ceil(Number(startTime) / 100);
    start <= Number(endTime) / 100;
    start += 1
  ) {
    slotResults[start * 100] = false;
    if (start * 100 + 30 <= Number(endTime)) {
      slotResults[start * 100 + 30] = false;
    }
  }
  if (Number(startTime) / 100 < Math.ceil(Number(startTime) / 100)) {
    slotResults[Number(startTime)] = false;
  }
  return slotResults;
}

function getRangeSlotTimes(data = []) {
  let results = _get(data, "0.slots", {});
  for (let index = 1; index < data.length; index += 1) {
    if (Object.keys(data[index].slots).length > 0) {
      results = { ...results, ...data[index].slots };
    }
  }
  return results;
}

const Timetable = ({
  maxDay,
  startDate,
  dataAvailable = [],
  initialDate,
  changeDate,
  selectDatetimeBooking,
  openCloseTime,
}) => {
  const [totalPage, setTotalPage] = useState(1);
  const [firstDate, setFirstData] = useState(startDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [rangeDate, setRangeDate] = useState([]);
  const [rangeSwipeViews, setRangeSwipeViews] = useState([]);
  const rangeSlotsAvailable = getRangeSlotTimes(dataAvailable);
  let { openTime, closeTime } = openCloseTime;

  if (_keys(rangeSlotsAvailable).length > 0) {
    openTime =
      Number(openCloseTime.openTime) <= Number(_keys(rangeSlotsAvailable)[0])
        ? openCloseTime.openTime
        : _keys(rangeSlotsAvailable)[0];
    closeTime =
      Number(openCloseTime.closeTime) >=
      Number(_keys(rangeSlotsAvailable)[_keys(rangeSlotsAvailable).length - 1])
        ? openCloseTime.closeTime
        : _keys(rangeSlotsAvailable)[_keys(rangeSlotsAvailable).length - 1];
  }

  const rangeSlots = getDefaultRangeSlotTimes(openTime, closeTime);

  useEffect(() => {
    // Logic for displaying module-day column
    const currentRangeDate = [];
    const currentRangeSwipeViews = [];
    let currentArr = [];
    const currentTotalPage = Math.ceil(maxDay / DEFAULT_ITEM_PER_PAGE);
    for (
      let d = moment(startDate);
      d.isBefore(
        moment(startDate)
          .add(currentTotalPage * DEFAULT_ITEM_PER_PAGE, "days")
          .toString()
      );
      d.add(1, "days")
    ) {
      currentRangeDate.push(Helper.formatDate(d, "YYYY-MM-DD").toString());
      currentArr.push(Helper.formatDate(d, "YYYY-MM-DD").toString());
      if (currentArr.length === DEFAULT_ITEM_PER_PAGE) {
        currentRangeSwipeViews.push(currentArr);
        currentArr = [];
      }
    }

    setTotalPage(currentTotalPage);
    setRangeDate(currentRangeDate);
    setRangeSwipeViews(currentRangeSwipeViews);
  }, [maxDay, startDate, dataAvailable]);

  useEffect(() => {
    const indexDate = _indexOf(
      rangeDate,
      Helper.formatDate(initialDate, "YYYY-MM-DD").toString()
    );
    setCurrentPage(Math.floor(indexDate / DEFAULT_ITEM_PER_PAGE) + 1);
  }, [initialDate, rangeDate]);

  const changeDateMethod = (type = "add") => {
    let chooseDate = moment();
    if (type === "add") {
      const currentItem = moment(dataAvailable[dataAvailable.length - 1].date);
      chooseDate = moment(initialDate).add(7, "days");

      if (currentPage + 1 === totalPage && chooseDate.isAfter(currentItem)) {
        chooseDate = currentItem;
      }
    }
    if (type === "subtract") {
      chooseDate = moment(initialDate).subtract(7, "days");
    }
    changeDate(new Date(chooseDate));
  };

  const nextMethod = () => {
    if (currentPage + 1 <= totalPage) {
      setCurrentPage(currentPage + 1);
      setFirstData(rangeSwipeViews[currentPage][0]);
      changeDateMethod("add");
    }
  };

  const previousMethod = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 2 > 0) {
        setFirstData(rangeSwipeViews[currentPage - 2][0]);
      } else {
        setFirstData(rangeSwipeViews[0][0]);
      }
      changeDateMethod("subtract");
    }
  };

  const handleChangeIndex = (index) => {
    if (index === currentPage) {
      changeDateMethod("add");
    } else {
      changeDateMethod("subtract");
    }
    setCurrentPage(index + 1);
    setFirstData(rangeSwipeViews[index][0]);
  };

  return (
    <div className="calendar-timeline-wrapper">
      <div className="timetable-toolbar">
        <Button
          className="btn-prev"
          disabled={currentPage === 1}
          onClick={previousMethod}
        >
          <i className="icon-angle-left" />
          <span>前の週へ</span>
        </Button>
        <div className="text-month">{Helper.formatDate(firstDate, "M月")}</div>
        <Button
          className="btn-next"
          disabled={currentPage === totalPage}
          onClick={nextMethod}
        >
          <span>次の週へ</span>
          <i className="icon-angle-right" />
        </Button>
      </div>
      <div className="timetable-wrapper">
        <div className="module-day header-root">
          <div className="module-day__title">日時</div>
          <div className="module-day__slots">
            <div className="t-scroll">
              {Object.keys(rangeSlots).length > 0 &&
                Object.keys(rangeSlots).map((key) => (
                  <div key={key} className="module-hour">
                    {Helper.formatTime(
                      key.toString().padStart(4, "0"),
                      "HH:mm"
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="timetable-outer">
          <div className="outer-day">
            {rangeSwipeViews.length > 0 && (
              <SwipeableViews
                index={currentPage - 1 >= 0 ? currentPage - 1 : currentPage}
                enableMouseEvents
                onChangeIndex={handleChangeIndex}
              >
                {rangeSwipeViews.map((swipeItem) => (
                  <div key={swipeItem} className="inner-outer-day">
                    {swipeItem.length > 0 &&
                      swipeItem.map((itemDate) => (
                        <ModuleDay
                          key={itemDate}
                          rangeSlots={rangeSlots}
                          title={itemDate}
                          dataSlots={_get(
                            _find(dataAvailable, ["date", itemDate]),
                            "slots"
                          )}
                          handleClick={selectDatetimeBooking}
                        />
                      ))}
                  </div>
                ))}
              </SwipeableViews>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
