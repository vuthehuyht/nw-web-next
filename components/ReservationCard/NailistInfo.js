import Link from "next/link";
import moment from "moment";
import clsx from "clsx";
import renderHTML from "react-render-html";
import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import { Avatar, Box } from "@material-ui/core";
import Helper from "utils/helper";
import { WEEKDAY_JAPAN } from "utils/constants";
import { ALL_BOOKING_STATUS } from "@utils/bookingConstants";

const { REQUESTED, EXPIRED, DECLINED_REQUEST, CANCELED_REQUEST } =
  ALL_BOOKING_STATUS;
const NailistInformation = ({
  className,
  nailist,
  bookingTime,
  salon,
  bookingStatus,
  isPaymentError,
}) => {
  const bookingDay = moment(_get(bookingTime, "bookingDate.iso"));
  const isPrivateNailist = _get(nailist, "isPrivate");

  const renderAddress = (address) => (
    <Box display="flex" alignItems="center">
      <i className="icon-location-line" />
      <span>{renderHTML(address)}</span>
    </Box>
  );

  return (
    <div className={clsx("nailist-information", { [className]: className })}>
      {_isEqual(_get(nailist, "status"), "INACTIVE") ? (
        <Avatar className="nailist-avatar" src="" alt="退会済みユーザー" />
      ) : (
        <Link href={`/nailist/${_get(nailist, "objectId")}`}>
          <a href={`/nailist/${_get(nailist, "objectId")}`}>
            <Avatar
              className="nailist-avatar"
              src={_get(nailist, "avatar")}
              alt={_get(nailist, "fullName") || _get(nailist, "username")}
            />
          </a>
        </Link>
      )}
      <div className="booking-time">
        {_get(bookingTime, "bookingDate.iso") && (
          <h3 className="date-time-booking">
            {bookingDay.format("YYYY年MM月DD日")} (
            {bookingDay.format("ddd").toString().length > 2
              ? WEEKDAY_JAPAN[bookingDay.format("ddd")].replace(
                  /(?:\r\n|\r|\n|\t)/g,
                  ""
                )
              : bookingDay.format("ddd")}
            )&nbsp;
            {Helper.formatTime(
              _get(bookingTime, "slot").toString().padStart(4, "0"),
              "HH:mm"
            )}
            ~
            {Helper.formatTime(
              _get(bookingTime, "expectedEndTime").toString().padStart(4, "0"),
              "HH:mm"
            )}
          </h3>
        )}
        {_isEqual(_get(nailist, "status"), "INACTIVE") ? (
          <h3>退会済みユーザー</h3>
        ) : (
          <>
            <h3 className="nailist-name">{_get(nailist, "username")}</h3>
            <h3 className="salon-name">{_get(salon, "salonName")}</h3>
            {_get(salon, "salonAddress") && !isPaymentError && (
              <div className="location">
                {isPrivateNailist &&
                [
                  REQUESTED,
                  EXPIRED,
                  DECLINED_REQUEST,
                  CANCELED_REQUEST,
                ].includes(bookingStatus) ? (
                  renderAddress(_get(salon, "salonAddress", ""))
                ) : (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`http://maps.google.co.jp/maps?q=${_get(
                      salon,
                      "latitude"
                    )},${_get(salon, "longitude")}`}
                  >
                    {renderAddress(_get(salon, "salonAddress", ""))}
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NailistInformation;
