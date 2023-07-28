import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";

import calendar, {
  isDate,
  dateDiff,
  isBeforeDay,
  isAfterDay,
  isSameDay,
  isSameMonth,
  getDateISO,
  getDateArray,
  getNextMonth,
  getPreviousMonth,
  getMonthDays,
  WEEK_DAYS,
  CALENDAR_MONTHS,
} from "utils/calendar";
import {
  CalendarContainer,
  CalendarHeader,
  CalendarGrid,
  CalendarDay,
  CalendarDate,
  CalendarMonth,
  HighlightedCalendarDate,
  TodayCalendarDate,
} from "./styles";

class Calendar extends React.Component {
  state = { ...this.stateFromProp(), today: new Date() };

  stateFromDate({ date, min, max } = {}) {
    const {
      mindate: stateMinDate,
      maxdate: stateMaxDate,
      current: stateCurrent,
    } = this.state || {};
    const minDate = min || stateMinDate;
    const maxDate = max || stateMaxDate;
    const currentDate = date || stateCurrent;

    const mindate = isAfterDay(minDate, maxDate) ? null : minDate;
    const maxdate = isBeforeDay(maxDate, minDate) ? null : maxDate;
    const current = this.calendarWithinRange(currentDate, { mindate, maxdate })
      ? currentDate
      : null;

    const calendarDate = current || new Date();

    const [year, month] = getDateArray(
      this.calendarWithinRange(calendarDate, { mindate, maxdate })
        ? calendarDate
        : maxdate
    );

    return { current, month, year, mindate, maxdate };
  }

  stateFromProp() {
    return this.stateFromDate(this.props);
  }

  changeHandler = (date) => () => {
    const { onDateChanged } = this.props;
    if (typeof onDateChanged === "function") {
      onDateChanged(date);
    }
  };

  calendarWithinRange(date, { maxdate, mindate } = this.state) {
    if (!isDate(date)) return false;
    const min = new Date(new Date(+mindate).setDate(1)).setHours(0, 0, 0, 0);
    const max = new Date(
      new Date(+maxdate).setDate(getMonthDays(maxdate))
    ).setHours(23, 59, 59, 999);

    return (date >= min || !mindate) && (date <= max || !maxdate);
  }

  getCalendarDates = () => {
    const { current, month, year } = this.state;
    const [currentYear, currentMonth] = current ? getDateArray(current) : [];
    return calendar(
      new Date(year || currentYear, month ? month - 1 : currentMonth - 1)
    );
  };

  gotoDate = (date) => (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    const { current, maxdate, mindate } = this.state;
    const isCurrent = current && isSameDay(date, current);
    const outOfRange = isBeforeDay(date, mindate) || isAfterDay(date, maxdate);

    if (!(isCurrent || outOfRange)) {
      this.setState(this.stateFromDate({ date }), this.changeHandler(date));
    }
  };

  gotoPreviousMonth = () => {
    const { month, year } = this.state;
    const previousMonth = getPreviousMonth(new Date(year, month - 1));
    const previous = new Date(previousMonth.year, previousMonth.month - 1);
    if (this.calendarWithinRange(previous)) {
      this.setState(previousMonth);
    }
  };

  gotoNextMonth = () => {
    const { month, year } = this.state;
    const nextMonth = getNextMonth(new Date(year, month - 1));
    const next = new Date(nextMonth.year, nextMonth.month - 1);
    if (this.calendarWithinRange(next)) {
      this.setState(nextMonth);
    }
  };

  gotoPreviousYear = () => {
    const { month, year } = this.state;
    const previous = new Date(year - 1, month - 1);
    if (this.calendarWithinRange(previous)) {
      this.setState({ year: year - 1 });
    }
  };

  gotoNextYear = () => {
    const { month, year } = this.state;
    const next = new Date(year + 1, month - 1);
    if (this.calendarWithinRange(next)) {
      this.setState({ year: year + 1 });
    }
  };

  handlePressure = (evt) => (fn, fnShift) => {
    if (typeof fn === "function" && typeof fnShift === "function") {
      this.pressureShift = evt.shiftKey;
      if (this.pressureShift) {
        fnShift();
      } else fn();

      this.pressureTimeout = setTimeout(() => {
        this.pressureTimer = setInterval(
          () => (this.pressureShift ? fnShift() : fn()),
          100
        );
      }, 500);

      document.addEventListener("keyup", this.handlePressureKeyup);
      document.addEventListener("keydown", this.handlePressureKeydown);
    }
  };

  handlePressureKeyup = (evt) => {
    evt.preventDefault();
    if (!evt.shiftKey) {
      this.pressureShift = !evt.shiftKey && false;
    }
  };

  handlePressureKeydown = (evt) => {
    evt.preventDefault();
    if (evt.shiftKey) {
      this.pressureShift = true;
    }
  };

  clearPressureTimer = () => {
    if (this.pressureTimer) {
      clearInterval(this.pressureTimer);
    }

    if (this.pressureTimeout) {
      clearTimeout(this.pressureTimeout);
    }

    this.pressureShift = false;

    document.removeEventListener("keyup", this.handlePressureKeyup);
    document.removeEventListener("keydown", this.handlePressureKeydown);
  };

  clearDayTimeout = () => {
    if (this.dayTimeout) {
      clearTimeout(this.dayTimeout);
    }
  };

  handlePrevious = (evt) => {
    if (evt) {
      evt.preventDefault();
      this.handlePressure(evt)(this.gotoPreviousMonth, this.gotoPreviousYear);
    }
  };

  handleNext = (evt) => {
    if (evt) {
      evt.preventDefault();
      this.handlePressure(evt)(this.gotoNextMonth, this.gotoNextYear);
    }
  };

  renderMonthAndYear = () => {
    const { month, year } = this.state;
    const monthname =
      Object.values(CALENDAR_MONTHS)[Math.max(0, Math.min(month - 1, 11))];
    const props = { onMouseUp: this.clearPressureTimer };

    return (
      <CalendarHeader>
        <IconButton onMouseDown={this.handlePrevious} {...props}>
          <i className="icon-angle-left" />
        </IconButton>
        <CalendarMonth>
          {monthname} {year}
        </CalendarMonth>
        <IconButton onMouseDown={this.handleNext} {...props}>
          <i className="icon-angle-right" />
        </IconButton>
      </CalendarHeader>
    );
  };

  renderDayLabels = (day, index) => {
    const daylabel = WEEK_DAYS[day].toUpperCase();
    return (
      <CalendarDay key={daylabel} index={index}>
        {daylabel}
      </CalendarDay>
    );
  };

  renderCalendarDate = (date, index) => {
    const { current, month, year, today, maxdate, mindate } = this.state;
    const { renderDateCell } = this.props;
    const thisDay = new Date(date[0], date[1] - 1, date[2]);
    const monthFirstDay = new Date(year, month - 1);

    const isToday = !!today && isSameDay(thisDay, today);
    const isCurrent = !!current && isSameDay(thisDay, current);
    const inMonth = !!(month && year) && isSameMonth(thisDay, monthFirstDay);
    const inRange = !(
      isBeforeDay(thisDay, mindate) || isAfterDay(thisDay, maxdate)
    );
    const renderToday = isToday ? TodayCalendarDate : CalendarDate;
    const isNotAvailable = renderDateCell && renderDateCell(thisDay, isCurrent);

    let props = {
      index,
      inMonth,
      inRange,
      title: thisDay.toDateString(),
    };
    props = isNotAvailable
      ? props
      : Object.assign(props, { onClick: this.gotoDate(thisDay) });
    const DateComponent = isCurrent ? HighlightedCalendarDate : renderToday;
    return (
      <DateComponent key={getDateISO(thisDay)} {...props}>
        {isNotAvailable ? (
          renderDateCell(thisDay, isCurrent)
        ) : (
          <span>{thisDay.getDate()}</span>
        )}
      </DateComponent>
    );
  };

  componentDidMount() {
    const tomorrow = new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000;

    this.dayTimeout = setTimeout(() => {
      this.setState({ today: new Date() }, this.clearDayTimeout);
    }, dateDiff(tomorrow));
  }

  componentDidUpdate(prevProps) {
    const { date, min, max } = this.props;
    const { date: prevDate, min: prevMin, max: prevMax } = prevProps;
    const dateMatch = date === prevDate || isSameDay(date, prevDate);
    const minMatch = min === prevMin || isSameDay(min, prevMin);
    const maxMatch = max === prevMax || isSameDay(max, prevMax);

    if (!(dateMatch && minMatch && maxMatch)) {
      this.setState(this.stateFromDate(date), this.gotoDate(date));
    }
  }

  componentWillUnmount() {
    this.clearPressureTimer();
    this.clearDayTimeout();
  }

  render() {
    return (
      <CalendarContainer className="calendar-container">
        {this.renderMonthAndYear()}
        <CalendarGrid>
          <React.Fragment>
            {Object.keys(WEEK_DAYS).map(this.renderDayLabels)}
          </React.Fragment>

          <React.Fragment>
            {this.getCalendarDates().map(this.renderCalendarDate)}
          </React.Fragment>
        </CalendarGrid>
      </CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  min: PropTypes.instanceOf(Date),
  max: PropTypes.instanceOf(Date),
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  onDateChanged: PropTypes.func,
};

export default Calendar;
