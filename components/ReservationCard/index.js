import { forwardRef } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import {
  Card,
  CardActions,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import Badge from "@material-ui/core/Badge";

import _get from "lodash/get";
import _isEqual from "lodash/isEqual";
import { BOOKING_STATUS, ALL_BOOKING_STATUS } from "utils/bookingConstants";
import MenuTag from "@components/Booking/BookingMenus/MenuTag";
import { InstallationPopupWrapper } from "@components/InstallationPopup";
import NailistInformation from "./NailistInfo";

const MyLink = forwardRef(({ className, href, hrefAs, children }, ref) => (
  <Link innerRef={ref} href={href} as={hrefAs}>
    <a className={className}>{children}</a>
  </Link>
));

export default function ReservationCard({
  data,
  isFuture = false,
  isPaymentError = false,
}) {
  const currentPath = `/booking-management/${data.objectId}`;
  const messageCount = _get(data, "messageCount");
  const isChangeCardBooking =
    isPaymentError && _get(data, "status") === ALL_BOOKING_STATUS.CONFIRMED;
  return (
    <Card className="reservation-card">
      <CardActionArea
        onClick={(e) => {
          e.stopPropagation();
        }}
        component={MyLink}
        href={currentPath}
        disableRipple
      >
        <>
          <CardContent className="card-content">
            <div className="heading">
              <div className="info">
                <NailistInformation
                  nailist={_get(data, "nailist")}
                  isPaymentError={isPaymentError}
                  bookingTime={{
                    bookingDate: _get(data, "bookingDate"),
                    slot: _get(data, "slot"),
                    expectedEndTime: _get(data, "expectedEndTime"),
                  }}
                  bookingStatus={_get(data, "status")}
                  salon={_get(data, "salon")}
                />
              </div>
              <div className="status-wrapper">
                {isChangeCardBooking && (
                  <div
                    className={`status ${_get(
                      BOOKING_STATUS[ALL_BOOKING_STATUS.PAYMENT_ERROR],
                      "class",
                      ""
                    )}
                  `}
                  >
                    {_get(
                      BOOKING_STATUS[ALL_BOOKING_STATUS.PAYMENT_ERROR],
                      "text",
                      ""
                    )}
                  </div>
                )}
                <>
                  {!isChangeCardBooking && (
                    <div
                      className={`status ${_get(
                        BOOKING_STATUS[_get(data, "status")],
                        "class",
                        ""
                      )}`}
                    >
                      {_get(BOOKING_STATUS[_get(data, "status")], "text", "")}
                    </div>
                  )}
                  <div className="pin-location">
                    {!isPaymentError &&
                      (_isEqual(
                        _get(data, "status"),
                        ALL_BOOKING_STATUS.CONFIRMED
                      ) ||
                        _isEqual(
                          _get(data, "status"),
                          ALL_BOOKING_STATUS.WAITING_DONE
                        )) && (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={`http://maps.google.co.jp/maps?q=${_get(
                            data,
                            "salon.latitude"
                          )},${_get(data, "salon.longitude")}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window
                              .open(
                                `http://maps.google.co.jp/maps?q=${_get(
                                  data,
                                  "salon.latitude"
                                )},${_get(data, "salon.longitude")}`,
                                "_blank"
                              )
                              .focus();
                          }}
                        >
                          <i className="icon-outline-location" />
                        </a>
                      )}
                    <InstallationPopupWrapper
                      title={`メッセージ機能は\nアプリにてご利用いただけます`}
                      footer={`アプリをインストール＞ログインして\nネイリストとメッセージのやりとりをしましょう！`}
                    >
                      <Badge
                        badgeContent={messageCount}
                        color="secondary"
                        style={{ verticalAlign: "unset" }}
                      >
                        <i className="icon-message" />
                      </Badge>
                    </InstallationPopupWrapper>
                  </div>
                </>
              </div>
            </div>
            <div className="menus-wrapper">
              {data.menuBookings.map((itemMenu, index) => (
                <div className="item-menu" key={itemMenu.title + index}>
                  {_get(itemMenu, "categoryJA") && (
                    <span className="category">
                      {_get(itemMenu, "categoryJA")}
                    </span>
                  )}
                  {_get(itemMenu, "repeatType") && (
                    <MenuTag
                      className="type"
                      type={_get(itemMenu, "repeatType")}
                    />
                  )}
                  <span className="title">
                    {_get(itemMenu, "time")}分 {_get(itemMenu, "title")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          {isFuture && (
            <CardActions className="reservation-actions">
              <div className="MuiButtonBase-root MuiButton-root MuiButton-text button contained-secondary">
                予約内容を確認する
              </div>
            </CardActions>
          )}
          {!isFuture && _get(data, "nailist.availableBooking") && (
            <CardActions className="reservation-actions">
              {_get(data, "nailist.availableBooking") && (
                <MyLink
                  href={`/booking/${_get(data.nailist, "objectId")}`}
                  className="MuiButtonBase-root MuiButton-root MuiButton-text button outlined-secondary"
                >
                  <span>もう一度予約する</span>
                </MyLink>
              )}
            </CardActions>
          )}
        </>
      </CardActionArea>
    </Card>
  );
}

ReservationCard.propTypes = {
  data: PropTypes.object,
  isFuture: PropTypes.bool,
};
