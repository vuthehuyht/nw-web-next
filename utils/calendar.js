export const WEEK_DAYS = {
  Monday: "月",
  Tuesday: "火",
  Wednesday: "水",
  Thursday: "木",
  Friday: "金",
  Saturday: "土",
  Sunday: "日",
};

export const CALENDAR_MONTHS = {
  January: "1月",
  February: "2月",
  March: "3月",
  April: "4月",
  May: "5月",
  June: "6月",
  July: "7月",
  August: "8月",
  September: "9月",
  October: "10月",
  November: "11月",
  December: "12月",
};

export const CALENDAR_WEEKS = 6;

export const CALENDAR_MONTHS_30 = [4, 6, 9, 11];

export const isDate = (date) => {
  const isDateType = Object.prototype.toString.call(date) === "[object Date]";
  const isValidDate = date && !Number.isNaN(+date);
  return isDateType && isValidDate;
};

export const getDateISO = (date = new Date()) =>
  isDate(date)
    ? [date.getFullYear(), date.getMonth() + 1, date.getDate()]
        .map((v) => String(v).padStart(2, "0"))
        .join("-")
    : null;

export const getDateArray = (date = new Date()) => {
  const [year = null, month = null, day = null] = (getDateISO(date) || "")
    .split("-")
    .map((v) => +v);
  return [year, month, day];
};

export const getMonthDays = (date = new Date()) => {
  const [year, month] = getDateArray(date);
  // eslint-disable-next-line no-nested-ternary
  return month === 2
    ? year % 4 === 0
      ? 29
      : 28
    : CALENDAR_MONTHS_30.includes(month)
    ? 30
    : 31;
};

export const getMonthFirstDay = (date = new Date()) =>
  new Date(new Date(+date).setDate(1)).getDay() + 1;

export const getPreviousMonth = (date = new Date()) => {
  const [year, month] = getDateArray(date);
  return {
    month: month > 1 ? month - 1 : 12,
    year: month > 1 ? year : year - 1,
  };
};

export const getNextMonth = (date = new Date()) => {
  const [year, month] = getDateArray(date);
  return {
    month: month < 12 ? month + 1 : 1,
    year: month < 12 ? year : year + 1,
  };
};

export const dateDiff = (date1, date2 = new Date()) =>
  isDate(date1) && isDate(date2)
    ? new Date(+date1).setHours(0, 0, 0, 0) -
      new Date(+date2).setHours(0, 0, 0, 0)
    : null;

export const isBeforeDay = (date1, date2) => +dateDiff(date1, date2) < 0;

export const isAfterDay = (date1, date2) => +dateDiff(date1, date2) > 0;

export const isSameDay = (date1, date2) => dateDiff(date1, date2) === 0;

export const isSameMonth = (date1, date2) =>
  isDate(date1) && isDate(date2)
    ? new Date(+date1).setDate(1) - new Date(+date2).setDate(1) === 0
    : false;

const calendar = (date = new Date()) => {
  const monthDays = getMonthDays(date);
  const monthFirstDay = getMonthFirstDay(date);
  const [year, month] = getDateArray(date);
  const daysFromPrevMonth = monthFirstDay === 1 ? 6 : monthFirstDay - 2;
  const daysFromNextMonth =
    CALENDAR_WEEKS * 7 - (daysFromPrevMonth + monthDays);

  const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(date);
  const { month: nextMonth, year: nextMonthYear } = getNextMonth(date);

  const prevMonthDays = getMonthDays(new Date(prevMonthYear, prevMonth - 1));
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => [
    prevMonthYear,
    prevMonth,
    index + 1 + (prevMonthDays - daysFromPrevMonth),
  ]);

  const thisMonthDates = [...new Array(monthDays)].map((n, index) => [
    year,
    month,
    index + 1,
  ]);

  const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => [
    nextMonthYear,
    nextMonth,
    index + 1,
  ]);
  return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
};

export default calendar;
