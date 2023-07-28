// Define route for handling web page url
// https://docs.google.com/spreadsheets/d/17FZlYHcV3VVgLZy30J5hsqlcYL5wvTbwa_fqC9vruc8/edit#gid=0

module.exports = {
  COUPON_LIST: { source: "/me/coupons", destination: "/" },
  RANKING: "/me/ranking",
  SEARCH_NEARBY: "/search/nearby-map",
  INSIGHT: "/me/insight",
  INSIGHT_POSTS: "/me/insight/posts",
  REVIEW_LIST: "/me/reviews",
  SHARING_QR: "/me/sharing-qr",
  RESERVATION_SETTING: "/me/reservation-setting/reservation-method",
  ANNOUCEMENT_DETAIL: "/notifications/announcements/:id",
  ANNOUCEMENT_LIST: "/notifications/announcements",
  POST_LIST: "/posts",
  NOTIFICATION_LIST: "/notifications",
  ME: "/me",
  FRIEND_INVITE: {
    source: "/me/friend-invite",
    destination: "/friend-invite",
  },
  CONVERSATION_LIST: "/notifications/messages",
  ROBOTS: { source: "/robots.txt", destination: "/api/robots" },
};
