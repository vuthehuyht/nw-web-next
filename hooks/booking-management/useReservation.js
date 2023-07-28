import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getBookingList } from "providers/BookingProvider/actions";
import {
  bookingSelectors,
  setBookingList,
} from "providers/BookingProvider/slice";
import { LIMIT } from "@utils/constants";

const useReservation = () => {
  const dispatch = useDispatch();
  const bookingEntities = useSelector(bookingSelectors.selectEntities);
  const bookingIds = useSelector(bookingSelectors.selectIds);
  const hasMore = useSelector((state) => state.booking.hasMore);
  const list = useSelector((state) => state.booking.list);
  const dataPassed = useSelector((state) => state.booking.dataPassed);
  const dataFuture = useSelector((state) => state.booking.dataFuture);
  const currentPage = useSelector((state) => state.booking.page);
  const { query, replace } = useRouter();
  const { page: queryPage } = query;
  const [loading, setLoading] = useState(false);

  const handleGetBookingList = (payload) => {
    replace(
      {
        pathname: `/booking-management`,
        query: {
          page: payload.page,
        },
      },
      null,
      { scroll: false }
    );
    setLoading(true);
    getBookingList(payload)
      .then((result) => {
        dispatch(setBookingList({ ...result, ...payload }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (Number(queryPage) !== currentPage) {
      handleGetBookingList({ page: 1, limit: LIMIT });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMoreData = () => {
    if (hasMore) {
      handleGetBookingList({ page: currentPage + 1, limit: LIMIT });
    }
  };

  return {
    handleGetBookingList,
    loading,
    bookingEntities,
    bookingIds,
    hasMore,
    getMoreData,
    currentPage,
    queryPage,
    list,
    dataFuture,
    dataPassed,
  };
};

export default useReservation;
