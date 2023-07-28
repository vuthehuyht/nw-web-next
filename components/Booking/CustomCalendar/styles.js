import styled from "styled-components";

export const CalendarContainer = styled.div`
  font-size: 5px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  overflow: hidden;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  border-bottom: solid 1px #dddddd;
  background-color: #f9f9f9;
  & i {
    font-size: 16px;
    color: #484848;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template: repeat(7, auto) / repeat(7, auto);
  border-top: unset;
  padding: 12px;
`;

export const CalendarMonth = styled.div`
  font-size: 16px;
  color: #484848;
  text-align: center;
  padding: 7px 16px 9px;
  word-spacing: 5px;
  user-select: none;
`;

export const CalendarCell = styled.div`
  text-align: center;
  align-self: center;
  letter-spacing: normal;
  padding: 7px;
  position: relative;
  user-select: none;
  grid-column: ${(props) => (props.index % 7) + 1} / span 1;
`;

export const CalendarDay = styled(CalendarCell)`
  font-weight: bold;
  font-size: 14px;
`;

export const CalendarDate = styled(CalendarCell)`
  font-size: 14px;
  cursor: ${(props) => (props.inRange ? "pointer" : "default")};
  color: ${(props) => {
    const inMonthColor = props.inMonth ? "#333" : "#aaaaaa";
    return props.inRange ? inMonthColor : "#aaaaaa";
  }};
  background: transparent;
  grid-row: ${(props) => Math.floor(props.index / 7) + 2} / span 1;
  transition: all 0.4s ease-out;
  > span {
    padding: 2px 5px 4px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: normal;
    margin: 0 auto;
    width: 26px;
    height: 26px;
    display: block;
  }
`;

export const HighlightedCalendarDate = styled(CalendarDate)`
  ${(props) =>
    props.inRange &&
    `
		> span {
			background-color: #e5004e;
			color: #fff;
			border-radius: 50%;
		}
  `}
`;

export const TodayCalendarDate = styled(HighlightedCalendarDate)`
  ${(props) =>
    props.inRange &&
    `
		> span {
			color: #484848;
			border: solid 1px #fd004a;
			background-color: rgba(229, 0, 78, 0.1);
		}
  `}
`;
