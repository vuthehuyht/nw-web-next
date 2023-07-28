/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import _get from "lodash/get";
import { getDeepLinkToShare } from "@providers/nailist-actions";
import BookWrapper from "./BookButton";

const BookingLayout = ({
  children,
  user,
  positionTop = 0,
  isHome = false,
  onReserve,
}) => {
  const isDirectBooking = _get(user, "isDirectBooking");
  const isAvailableBooking = _get(user, "availableBooking");
  const bookRef = useRef();
  const [showBookButton, setShowBookButton] = useState(false);
  const [linkData, setLinkData] = useState();

  const checkShowBookButton = () => {
    if (!showBookButton && window.pageYOffset >= positionTop) {
      setShowBookButton(true);
    } else if (showBookButton && window.pageYOffset < positionTop) {
      setShowBookButton(false);
    }
  };

  useEffect(() => {
    getDeepLinkToShare({ objectId: _get(user, "objectId") })
      .then((result) => {
        if (result.status && result.status === "error") {
          return;
        }
        setLinkData(result);
      })
      .catch((e) => {
        console.error("error: ", e);
      });
  }, []);

  useEffect(() => {
    if (window !== "underfind") {
      window.addEventListener("scroll", checkShowBookButton);
    }
    return () => {
      window.removeEventListener("scroll", checkShowBookButton);
    };
  });

  return (
    <>
      {children}
      {isHome ? (
        <div
          className={`book-sticky ${showBookButton ? "show" : "hide"}`}
          ref={bookRef}
        >
          <BookWrapper
            linkData={linkData}
            onReserve={onReserve}
            isDirectBooking={isDirectBooking}
            isAvailableBooking={isAvailableBooking}
          />
        </div>
      ) : (
        <div className="book-sticky" ref={bookRef}>
          <BookWrapper
            linkData={linkData}
            onReserve={onReserve}
            isDirectBooking={isDirectBooking}
            isAvailableBooking={isAvailableBooking}
          />
        </div>
      )}
    </>
  );
};

export default BookingLayout;
