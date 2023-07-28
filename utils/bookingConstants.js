export const ALL_BOOKING_STATUS = {
  REQUESTED: "REQUESTED",
  CONFIRMED: "CONFIRMED",
  WAITING_DONE: "WAITING_DONE",
  PAYMENT_ERROR: "PAYMENT_ERROR",
  EXPIRED: "EXPIRED",
  DECLINED_REQUEST: "DECLINED_REQUEST",
  CANCELED_REQUEST: "CANCELED_REQUEST",
  CANCELED_RESERVATION: "CANCELED_RESERVATION",
  CARD_ERROR_CANCEL: "CARD_ERROR_CANCEL",
  UNDONE: "UNDONE",
  NOVISIT: "NOVISIT",
  NAILIE_CANCELED: "NAILIE_CANCELED",
  NAILIST_CANCELED: "NAILIST_CANCELED",
  DECLINED_RESERVATION: "DECLINED_RESERVATION",
  DONE: "DONE",
};

export const BOOKING_STATUS = {
  [ALL_BOOKING_STATUS.REQUESTED]: {
    text: "リクエスト中",
    class: "second-pink",
  },
  [ALL_BOOKING_STATUS.CONFIRMED]: {
    text: "確定中",
    class: "primary-pink",
  },
  [ALL_BOOKING_STATUS.WAITING_DONE]: {
    text: "確定中",
    class: "primary-pink",
  },
  [ALL_BOOKING_STATUS.PAYMENT_ERROR]: {
    text: "お支払いエラー",
    class: "second-pink",
  },
  [ALL_BOOKING_STATUS.EXPIRED]: {
    text: "不成立",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.DECLINED_REQUEST]: {
    text: "不成立",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.CANCELED_REQUEST]: {
    text: "リクエスト\nキャンセル",
    class: "primary-grey",
    warningText: "キャンセルが完了しました",
  },
  [ALL_BOOKING_STATUS.CANCELED_RESERVATION]: {
    text: "キャンセル",
    class: "primary-grey",
    warningText: "キャンセルが完了しました",
  },
  [ALL_BOOKING_STATUS.CARD_ERROR_CANCEL]: {
    text: "キャンセル",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.UNDONE]: {
    text: "緊急事態\nキャンセル",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.NOVISIT]: {
    text: "当日\nキャンセル",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.NAILIE_CANCELED]: {
    text: "事務局\nキャンセル",
    class: "primary-grey",
    warningText:
      "ネイリストが期限までにお会計を行わなかった\nため事務局キャンセルとなりました。\n今回の施術料金の支払いは発生しません",
  },
  [ALL_BOOKING_STATUS.NAILIST_CANCELED]: {
    text: "ネイリスト\nキャンセル",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.DECLINED_RESERVATION]: {
    text: "ネイリスト\nキャンセル",
    class: "primary-grey",
  },
  [ALL_BOOKING_STATUS.DONE]: {
    text: "施術完了",
    class: "second-grey",
  },
};

export const STATUS_CANCEL_BY_CUSTOMER = [
  ALL_BOOKING_STATUS.CANCELED_REQUEST,
  ALL_BOOKING_STATUS.CANCELED_RESERVATION,
  ALL_BOOKING_STATUS.CARD_ERROR_CANCEL,
  ALL_BOOKING_STATUS.NOVISIT,
];

export const STATUS_CANCEL_BY_NAILIST = [
  ALL_BOOKING_STATUS.NAILIST_CANCELED,
  ALL_BOOKING_STATUS.DECLINED_RESERVATION,
  ALL_BOOKING_STATUS.DECLINED_REQUEST,
  ALL_BOOKING_STATUS.EXPIRED,
  ALL_BOOKING_STATUS.UNDONE,
];

export const STATUS_EARN_POINT = [
  ALL_BOOKING_STATUS.REQUESTED,
  ALL_BOOKING_STATUS.CONFIRMED,
  ALL_BOOKING_STATUS.DONE,
  ALL_BOOKING_STATUS.WAITING_DONE,
];

export const CANCEL_BEFORE_TEXT = {
  0: "当日キャンセル",
  1: "前日キャンセル",
};
