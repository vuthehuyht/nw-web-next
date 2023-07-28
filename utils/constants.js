module.exports = {
  VERSION: "6.1.0",
  LIMIT: 20,
  REACT_WEB: "http://nwa.scrum-dev.com",
  FOOTER_TEXT: "©2020 Nailie inc. All rights reserved.",
  SOCIAL_MEDIA: [
    {
      type: "INSTAGRAM",
      link: "https://www.instagram.com/nailiejp/",
      icon: "icon-social-instagram",
    },
    {
      type: "TWITTER",
      link: "https://twitter.com/nailiejp",
      icon: "icon-twitter",
    },
    {
      type: "FACEBOOK",
      link: "https://www.facebook.com/nailie.jp/",
      icon: "icon-social-facebook",
    },
  ],
  AMOUNT_MANICURIST: {
    HOME: 6,
    RECOMMEND: 10,
    OURMANICURIST: 21,
    POST: 12,
  },
  PREFECTURES_PHOTO: [
    {
      title: "tokyo",
      photo: "/assets/images/brief-location/tokyo.png",
      thumbnail: "/assets/images/brief-location/tokyo-thumbnail.png",
    },
    {
      title: "kanagawa",
      photo: "/assets/images/brief-location/kanagawa.png",
      thumbnail: "/assets/images/brief-location/kanagawa-thumbnail.png",
    },
    {
      title: "aichi",
      photo: "/assets/images/brief-location/aichi.png",
      thumbnail: "/assets/images/brief-location/aichi-thumbnail.png",
    },
    {
      title: "osaka",
      photo: "/assets/images/brief-location/osaka.png",
      thumbnail: "/assets/images/brief-location/osaka-thumbnail.png",
    },
    {
      title: "hyogo",
      photo: "/assets/images/brief-location/kyoto.png",
      thumbnail: "/assets/images/brief-location/kyoto-thumbnail.png",
    },
    {
      title: "fukuoka",
      photo: "/assets/images/brief-location/fukuoka.png",
      thumbnail: "/assets/images/brief-location/fukuoka-thumbnail.png",
    },
  ],
  ALL_FIELD: {
    objectId: "all",
    id: "all",
    name: "すべて",
  },
  PRICE_FILED: [
    {
      LABEL: "¥1000",
      VALUE: 1000,
    },
    {
      LABEL: "Unlimited",
      VALUE: 16000,
    },
  ],
  ROOT_ROUTER: {
    HOME: "/",
    OURMANICURIST: "/our-manicurist",
    CAMPAIGNS: "/campaigns",
    // CONTACT: "/contact",
    OURAPPLICATION: "/our-application",
    BECOMEANAILIST: "/become-a-nailist",
    BOOKING_MANAGEMENT: "/booking-management",
  },
  SORT_BY: [
    {
      value: "RECOMMEND",
      name: "おすすめ順",
    },
    {
      value: "RANKING",
      name: "ランキング順",
    },
    {
      value: "LOWPRICE",
      name: "価格の低い順",
    },
    {
      value: "HIPRICE",
      name: "価格の高い順",
    },
  ],
  SYMBOL_CONCAT: "+",
  FEATURES: [
    {
      title: "design",
      titleJp: "デザインと出会う",
      icon: "/assets/images/design.svg",
      image: "/assets/images/screenshot/screenshot-design.png",
      content:
        "さまざまなトレンドのデザインから、<br/>あなたの好みのネイルを探そう。<br/>検索もしやすく、お気に入りのデザインを保存できます。",
    },
    {
      title: "Follow",
      titleJp: "ネイリストとつながる",
      icon: "/assets/images/follow.svg",
      image: "/assets/images/screenshot/screenshot-follow.png",
      content:
        "見つけたデザインの中から<br/>ネイリストのマイページをチェック。<br/>お気に入りのネイリストをフォローしたり、<br/>投稿にいいね！をしよう。",
    },
    {
      title: "reserve",
      titleJp: "アプリから簡単予約",
      icon: "/assets/images/reserve.svg",
      image: "/assets/images/screenshot/screenshot-reserve.png",
      content:
        "メニュー、日付を選択して簡単予約。<br/>アプリ内のカード決済でラクラク会計。<br/>予約後、直接ネイリストとチャットでやりとりしよう。",
    },
  ],
  API_GOOGLE_MAP_KEY:
    process.env.REACT_APP_GOOGLE_MAP_API_KEY ||
    "AIzaSyC-Cb-oB4O_rsPSWSZ_epXAscAn9fj_F1E",
  SIZE_GOOGLE_MAP: process.env.REACT_APP_GOOGLE_MAP_SIZE || "600x400",
  HOUR_FORMAT: "HH:mm",
  HOUR_DEFAULT: "00:00",
  STATUS: {
    DELETE: "DELETED",
    INACTIVE: "INACTIVE",
    ACTIVE: "ACTIVE",
  },
  POST_TYPE: "USER",
  DOWNLOADS: [
    {
      type: "iOS",
      title: "app store",
      // "href": "https://apps.apple.com/jp/app/id1251330322?ls=1&mt=8",
      href: "https://nailiejp.page.link/open",
      thumb: "/assets/images/ios.svg",
    },
    {
      type: "android",
      title: "google play",
      // "href": "https://play.google.com/store/apps/details?id=jp.nailie.app.android",
      href: "https://nailiejp.page.link/open",
      thumb: "/assets/images/android.svg",
    },
  ],
  NO_CHOOSE: "選択しない",
  SALON_TYPES_X10: {
    objectId: "X10Point",
    name: "ポイント10倍",
    type: "X10_POINT",
    iconUrl: "https://d1qyhbwogwcazp.cloudfront.net/x10point_ic.png",
    roles: ["CUSTOMER", "ANONYMOUS"],
    status: "ACTIVE",
    icons: {
      normal: "https://d1qyhbwogwcazp.cloudfront.net/12-x10-points.svg",
      selected:
        "https://d1qyhbwogwcazp.cloudfront.net/12-x10-points-Selected.svg",
    },
  },
  EMPTY_CONTENT: {
    REVIEW: {
      title: "レビューはまだありません",
      image: "/assets/images/empty/empty-review.svg",
    },
    TOPMENU: {
      title: "おすすめメニューはまだありません",
      image: "/assets/images/empty/empty-top-menu.svg",
    },
    SALON: {
      title: "サロン情報はまだありません",
      image: "/assets/images/empty/empty-salon.svg",
    },
    MENU: {
      title: "メニューはまだありません",
      image: "/assets/images/empty/empty-menu.svg",
    },
    POSTS: {
      title: "デザインはまだありません",
      image: "/assets/images/empty/empty-design.svg",
    },
    RESERVATION: {
      title: "あなたの予約を確認できます",
      image: "/assets/images/empty/empty-reservation.png",
      content:
        "次のネイルはお決まりですか？\nあなたにぴったりのネイリストを見つけましょう！",
    },
  },
  TYPE_STATIONS_FILED: {
    objectId: "stations",
    id: "stations",
    name: "駅から選ぶ",
  },
  TYPE_AREAS_FILED: {
    objectId: "areas",
    id: "areas",
    name: "エリアから選ぶ",
  },
  FIREBASE_ERROR: {
    "auth/invalid-phone-number-login":
      "電話番号またはメールアドレスの形式が間違っています。ご確認の上、再度入力してください。",
    "auth/invalid-phone-number":
      "電話番号が間違ってい ました。 もう⼀度確認して⼊⼒ してください。",
    "auth/invalid-verification-code": "正しい認証コードを⼊ ⼒してください。",
    "auth/too-many-requests":
      "何度もモバイル認証を ⾏ったため、セキュリ ティーの為こちらの番 号はブロックされまし た。４時間後にブロッ ク解除されますので再 度お試しください。",
    "auth/code-expired":
      "The SMS code has expired. Please re-send the verification code to try again.",
  },
  VALIDATION_TEXT: {
    REQUIRED: "必須",
    PHONE_FORMAT:
      "電話番号が間違ってい ました。 もう⼀度確認して⼊⼒ してください。",
    EMAIL_FORMAT: "メールアドレスが正しくありません。 再度ご確認ください。",
    EMAIL_PHONE_FORMAT: (
      <>
        正しいメールアドレス、または
        <br />
        電話番号を入力してください
      </>
    ),
    USERNAME_FORMAT: "半角英数字・アンダーバー・ピリオドで入力してください",
    INVALID_CARD_NUMBER: "カードの番号が無効です。",
    INVALID_EXPIRATION_YEAR: "カードの有効期限として指定した年が無効です。",
    INVALID_CVC: "指定したカードのセキュリティコードが無効です。",
    HIRAGANA_FORMAT: "ひらがなで入力してください",
    INVALID_COUPON: "※こちらのクーポンコードはご利用になれません",
    INVALID_INVITATION_COUPON: "こちらの招待コードはご使用になれません",
    INVALID_COUPON_LENGTH: "招待コードは6文字以上ご入力ください",
    INVALID_PHONE: "正しい電話番号を入力してください",
  },
  AUTH_STEP: {
    LOGIN: "LOGIN",
    EMAIL_AUTH: "EMAIL_AUTH",
    SMS_AUTH: "SMS_AUTH",
    REGISTER: "REGISTER",
  },
  PAGE_TITLE: {
    LOGIN: "メールアドレスでログイン",
    EMAIL_AUTH: "アドレスを認証する",
    SMS_AUTH: "電話番号を入力",
    REGISTER: "メールアドレスを入力",
  },
  PAGE_SUBTITLE: {
    LOGIN: "",
    EMAIL_AUTH: "",
    SMS_AUTH: "",
    REGISTER: "",
  },
  COUNTRY_CODE: {
    VN: "+84",
    JP: "+81",
  },
  REGEX: {
    USERNAME: /^[a-zA-Z0-9_.]*$/,
    EMAIL: /^[A-Za-z0-9]([._%+-]?[A-Za-z0-9]){0,}@([\w-]+(?:\.[\w-]+)+)$/,
    PHONE: /^\+?[0-9]{9,15}$/,
    HIRAGANA: /^[ぁ-ん、。’\s]+$/,
    COUPON: /^ {0,}?[a-zA-Z0-9]{3,32} {0,}?$/,
    INVITATION_COUPON: /^ {0,}?[a-zA-Z0-9]{6,32} {0,}?$/,
  },
  IMAGE_TYPE: {
    AVATAR: "AVATAR",
  },
  SUPPORT_TYPES: {
    WEB: "WEB",
    VERIFY_LOGIN: "VERIFY_LOGIN",
    VERIFY_REGISTER: "VERIFY_REGISTER",
    VERFIY_UPDATE: "VERFIY_UPDATE",
  },
  CARD_IMAGES: {
    "American Express": "/assets/images/cards/express.svg",
    "Diners Club": "/assets/images/cards/diner.svg",
    Discover: "/assets/images/cards/discover.svg",
    JCB: "/assets/images/cards/jcb.svg",
    MasterCard: "/assets/images/cards/master.svg",
    Visa: "/assets/images/cards/visa.svg",
  },
  REPEAT_TYPE_TEXT: {
    NEW: "新規",
    ALL: "全員",
    REPEATER: "再来",
  },
  REPEAT_TYPE: {
    NEW: "NEW",
    ALL: "ALL",
    REPEATER: "REPEATER",
  },
  NO_OFF: {
    objectId: "NO_OFF",
    title: "オフしない",
  },
  NUMBER_OF_DAY: 30,
  WEEKDAY_JAPAN: {
    Mon: "\n月",
    Tue: "\n火",
    Wed: "\n水",
    Thu: "\n木",
    Fri: "\n金",
    Sat: "\n土",
    Sun: "\n日",
  },
  CANCEL_POLICY: {
    HARD: "HARD",
    NORMAL: "NORMAL",
    SOFT: "SOFT",
  },
  PAYMENT_METHOD: {
    ONLINE: "ONLINE",
    ATONE: "ATONE",
  },
  USER_STATUS: {
    ACTIVE: "ACTIVE",
  },
  PAYMENT_PROVIDER: {
    CREDIT_CARD: "CREDIT_CARD",
    BANK_TRANSFER: "BANK_TRANSFER",
  },
  CARD_PROVIDER: {
    STRIPE: "STRIPE",
    VERITRANS: "VERITRANS",
  },
  LOCATION_URL: {
    REGION: "region",
    PREFECTURE: "prefecture",
    WARDS: "wards",
    LINES: "line",
    STATIONS: "stations",
    SORT: "sortBy",
  },
  SYMBOL_CONCAT_URL: ",",
};
