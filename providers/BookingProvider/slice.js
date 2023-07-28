/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import _get from "lodash/get";
import { logOut } from "providers/AuthProvider/slice";

const bookingAdapter = createEntityAdapter({
  selectId: (booking) => booking.objectId,
});

const notReviewedBookingAdapter = createEntityAdapter({
  selectId: (review) => review.objectId,
});

const errorBookingAdapter = createEntityAdapter({
  selectId: (booking) => booking.objectId,
});

const initialState = bookingAdapter.getInitialState({
  menus: {},
  list: [],
  dataFuture: [],
  dataPassed: [],
  page: 0,
  hasMore: true,
  currentBooking: {},
  notReviewedBookings: notReviewedBookingAdapter.getInitialState(),
  errorBooking: errorBookingAdapter.getInitialState({
    page: 0,
  }),
  bookingAutoCancelIds: [],
  bookingCardChangeIds: [],
  bookingPaymentErrorIds: [],
  countBookingAutoCancel: 0,
  countBookingPaymentError: 0,
  countCardChange: 0,
  expiredDateCardChange: null,
  errorVisible: false,
});

export const bookingSelectors = bookingAdapter.getSelectors(
  (state) => state.booking
);

export const notReviewedBookingSelectors =
  notReviewedBookingAdapter.getSelectors(
    (state) => state.booking.notReviewedBookings
  );

export const errorBookingSelector = errorBookingAdapter.getSelectors(
  (state) => state.booking.errorBooking
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: bookingAdapter.getInitialState({
    ...initialState,
  }),
  reducers: {
    setMenus(state, action) {
      const { userId, menus } = action.payload;
      return {
        ...state,
        menus: { ...state.menus, [userId]: menus },
      };
    },
    setBookingList(state, action) {
      const { hasMore, page, bookings } = action.payload;
      if (page === 1) {
        bookingAdapter.setAll(state, bookings);
        state.page = 1;
        state.list = bookings;
        state.dataFuture = bookings
          .filter((booking) => booking.isPresent)
          .map((booking) => booking.objectId);
        state.dataPassed = bookings
          .filter((booking) => !booking.isPresent)
          .map((booking) => booking.objectId);
      } else {
        bookingAdapter.addMany(state, bookings);
        state.page += 1;
        state.list = state.list.concat(bookings);
        state.dataFuture = state.dataFuture.concat(
          bookings
            .filter((booking) => booking.isPresent)
            .map((booking) => booking.objectId)
        );
        state.dataPassed = state.dataPassed.concat(
          bookings
            .filter((booking) => !booking.isPresent)
            .map((booking) => booking.objectId)
        );
      }
      state.hasMore = hasMore;
    },
    setDetailBooking(state, action) {
      const updatedBookingId = _get(action.payload, "bookingDetail.objectId");
      const updatedBooking = state.entities[updatedBookingId];
      const nailistInfo = _get(updatedBooking, "nailist");
      const menuBookings = _get(updatedBooking, "menuBookings");
      // Set detai after canceling
      const isCanceled = _get(action.payload, "isCanceled");
      // Set detai after update error booking
      const isErrorBooking = _get(action.payload, "isErrorBooking");
      if (isCanceled && state.dataFuture.includes(updatedBookingId)) {
        state.dataFuture = state.dataFuture.filter(
          (id) => id !== updatedBookingId
        );
        state.dataPassed.unshift(updatedBookingId);
      }

      if (isErrorBooking || isCanceled) {
        errorBookingAdapter.removeOne(state.errorBooking, [updatedBookingId]);
      }
      bookingAdapter.updateOne(state, {
        id: updatedBookingId,
        changes: {
          ...action.payload.bookingDetail,
          nailist: nailistInfo,
          menuBookings,
        },
      });
      state.currentBooking = action.payload;
    },
    setNotReviewedBooking(state, action) {
      const { bookings } = action.payload;
      notReviewedBookingAdapter.setAll(state.notReviewedBookings, bookings);
    },
    removeNotReviewedBooking(state, action) {
      const { bookingIds } = action.payload;
      notReviewedBookingAdapter.removeOne(
        state.notReviewedBookings,
        bookingIds
      );
    },
    setCountBookingError(state, action) {
      const {
        bookingAutoCancelIds,
        bookingCardChangeIds,
        bookingPaymentErrorIds,
        countBookingAutoCancel = 0,
        countBookingPaymentError = 0,
        countCardChange = 0,
        expiredDateCardChange,
      } = action.payload;
      return {
        ...state,
        bookingAutoCancelIds,
        bookingCardChangeIds,
        bookingPaymentErrorIds,
        countBookingAutoCancel,
        countBookingPaymentError,
        countCardChange,
        expiredDateCardChange: _get(expiredDateCardChange, "iso"),
        errorVisible:
          countBookingAutoCancel > 0 ||
          countBookingPaymentError > 0 ||
          countCardChange > 0,
      };
    },
    setErrorBooking(state, action) {
      state.errorBooking.page = action.payload.page;
      errorBookingAdapter.setAll(state.errorBooking, action.payload.bookings);
    },
    removeAutoBookingCancelId(state, action) {
      return {
        ...state,
        countBookingAutoCancel: state.countBookingAutoCancel - 1,
        bookingAutoCancelIds: state.bookingAutoCancelIds.filter(
          (id) => id !== action.payload
        ),
      };
    },
  },
  extraReducers: {
    [logOut.type]: () => initialState,
  },
});

export const {
  setMenus,
  setBookingList,
  setDetailBooking,
  setNotReviewedBooking,
  removeNotReviewedBooking,
  setCountBookingError,
  setErrorBooking,
  removeAutoBookingCancelId,
} = bookingSlice.actions;

export default bookingSlice.reducer;
