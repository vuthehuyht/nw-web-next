import _get from "lodash/get";
import _forEach from "lodash/forEach";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";
import _omit from "lodash/omit";
import moment from "moment";
import ct from "countries-and-timezones";
import cookie, { serialize } from "cookie";
import { toast } from "react-toastify";
import {
  TYPE_AREAS_FILED,
  TYPE_STATIONS_FILED,
  REGEX,
  FIREBASE_ERROR,
  ALL_FIELD,
  PRICE_FILED,
  LOCATION_URL,
  SYMBOL_CONCAT_URL,
} from "@utils/constants";
import { ERROR_MESSAGE } from "./errors";
import "moment/locale/ja";

moment.locale("ja");

export default {
  renderLocationUrl(params) {
    const locationParam = {};
    if (params.region) {
      // region param
      locationParam.region =
        params.region.id || params.region.objectId || params.region;
    }

    if (params.prefecture) {
      // prefecture param
      locationParam.prefecture =
        params.prefecture.id || params.prefecture.objectId || params.prefecture;
    }

    if (params.area && params.type.id === TYPE_AREAS_FILED.id) {
      // area params
      if (params.area.length === 1) {
        // 1 param
        locationParam.wards =
          params.area[0].id || params.area[0].objectId || params.area[0];
      } else {
        // many param
        let areaUrl = "";
        for (let i = 0; i < params.area.length; i += 1) {
          areaUrl +=
            params.area[i].id || params.area[i].objectId || params.area[i];
          if (i !== params.area.length - 1) {
            areaUrl += SYMBOL_CONCAT_URL;
          }
        }
        locationParam.wards = areaUrl;
      }
    }

    if (params.station && params.type.id === TYPE_STATIONS_FILED.id) {
      let lineText = [];
      const stationText = [];
      const paramLine = params.lines || params.line;

      // add line's objectId to params from popup
      if (_isEmpty(_get(paramLine, "0.objectId"))) {
        paramLine.map((item) => lineText.push(item));
      }

      if (_isArray(params.station)) {
        // case: click back from browers
        params.station.map((item) => stationText.push(item));
        if (!_isEmpty(_get(paramLine, "0.objectId"))) {
          lineText = [];
          paramLine.map((item) => lineText.push(_get(item, "objectId")));
        }
      } else {
        _forEach(params.station, (value, key) => {
          lineText.push(key);
          value.map((item) => stationText.push(item));
        });
      }
      locationParam.line = lineText.join(SYMBOL_CONCAT_URL);
      locationParam.stations = stationText.join(SYMBOL_CONCAT_URL);
    }
    return locationParam;
  },
  convertSearchUrlNew(params) {
    const newURL = { pathname: "/", query: params };
    const locationParam = [];

    if (params.prefecture) {
      // prefecture param
      locationParam.push(LOCATION_URL.PREFECTURE);
      locationParam.push(
        params.prefecture.id || params.prefecture.objectId || params.prefecture
      );
      newURL.query = _omit(newURL.query, ["prefecture"]);
    }

    if (params.wards) {
      // area params
      locationParam.push(LOCATION_URL.WARDS);
      locationParam.push(params.wards);
      newURL.query = _omit(newURL.query, ["wards"]);
    }

    if (params.stations) {
      locationParam.push(LOCATION_URL.STATIONS);
      locationParam.push(params.stations);
      newURL.query = _omit(newURL.query, ["stations"]);
    }

    if (locationParam.length < 1) {
      locationParam.push("/search");
    }

    newURL.pathname = locationParam.join("/");
    return newURL;
  },
  convertSearchUrl(params) {
    let locationParam = "";
    if (params.region) {
      // region param
      locationParam += `region=${
        params.region.id || params.region.objectId || params.region
      }`;
    }

    if (params.prefecture) {
      // prefecture param
      locationParam += `&prefecture=${
        params.prefecture.id || params.prefecture.objectId || params.prefecture
      }`;
    }

    if (params.wards) {
      // area params
      locationParam += `&wards=${params.wards}`;
    }
    if (params.stations) {
      locationParam += `&line=${params.line}`;
      locationParam += `&stations=${params.stations}`;
    }
    if (params.sortBy) {
      locationParam += `&sortBy=${params.sortBy}`;
    }
    if (params.menuCategory) {
      locationParam += `&menuCategory=${params.menuCategory}`;
    }
    if (params.minPrice) {
      locationParam += `&minPrice=${params.minPrice}`;
    }
    if (params.maxPrice) {
      locationParam += `&maxPrice=${params.maxPrice}`;
    }
    if (params.salonTypes) {
      locationParam += `&salonTypes=${params.salonTypes}`;
    }
    if (params.page) {
      locationParam += `&page=${params.page}`;
    }
    return locationParam;
  },
  getISOCountryCode: () => {
    const timezone = ct.getTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    return _get(timezone, "countries[0]", "JP");
  },
  validateEmail: (value) => {
    if (typeof value !== "string") {
      return false;
    }
    return /^[a-z0-9](\.?[a-z0-9]){0,}@([\w-]+(?:\.[\w-]+)+)$/.test(value);
  },
  getDomainFromEmail: (email) => {
    if (typeof email !== "string") {
      return "#";
    }
    const splitEmail = email.split("@");
    return `https://${splitEmail[1]}`;
  },
  validateEmailAndPhone: (value) => {
    if (!value) {
      return false;
    }
    if (REGEX.PHONE.test(value)) {
      return "phone";
    }
    if (REGEX.EMAIL.test(value)) {
      return "email";
    }
    return false;
  },
  formatDate: (date, formatString) => moment(date).format(formatString),
  getMonthValues: () => {
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    return months.map((month) => ({
      value: month,
      name: month,
    }));
  },
  getYearValues: (from, to) => {
    const values = [];
    for (let i = from; i <= to; i += 1) {
      values.push({
        value: String(i),
        name: i,
      });
    }
    return values;
  },
  addCommaToString: (value) => {
    if (["number", "string"].indexOf(typeof value) < 0) {
      return "";
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  formatTime: (values, formatString) =>
    moment(values, "Hmm").format(formatString),
  getRequestCookie: (req) => {
    let headerCookie = req.headers.cookie;
    if (typeof headerCookie !== "string") {
      headerCookie = "";
    }
    const parsedCookie = cookie.parse(headerCookie);
    return parsedCookie;
  },
  setCookie: (res, name, value, options) => {
    // https://nextjs.org/docs/api-routes/api-middlewares
    const otp = { ...options };
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if ("maxAge" in otp) {
      otp.expires = new Date(Date.now() + options.maxAge);
      otp.maxAge /= 1000;
    }

    res.setHeader("Set-Cookie", serialize(name, stringValue, otp));
  },
  getErrorMessage: (e) => {
    const errorCode = _get(e, "error.code") || _get(e, "code");
    const errorMsg = _get(e, "error.error");
    return FIREBASE_ERROR[errorCode] || ERROR_MESSAGE[errorCode] || errorMsg;
  },
  toastError: (e) => {
    const errorCode = _get(e, "error.code") || _get(e, "code");
    const errorMsg = _get(e, "error.error");
    toast.info(
      FIREBASE_ERROR[errorCode] || ERROR_MESSAGE[errorCode] || errorMsg
    );
  },
  getCardNumberText: (data = {}) => {
    if (data.card_number) {
      return data.card_number
        .replace(/(.{4}).{2}/, "$1**")
        .replace(/(.{4})/g, "$1 ");
    }
    if (data.last4) {
      return `**** **** **** ${data.last4}`;
    }
    return "";
  },
  formatParams: (params) => {
    if (typeof params !== "object") {
      return params;
    }
    const formattedParams = {};
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === "string") {
        formattedParams[key] = params[key].trim();
      } else {
        formattedParams[key] = params[key];
      }
    });
    return formattedParams;
  },
  canGoBack: () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (_get(window, "history.state.idx") > 0) {
      return true;
    }
    return false;
  },
  splitParamsFromRouter: (query) => {
    const {
      region = "all",
      prefecture,
      wards,
      line,
      stations,
      sortBy = "RECOMMEND",
      menuCategory,
      minPrice,
      maxPrice,
      salonTypes,
      page,
    } = query;
    const salons = salonTypes ? salonTypes.split(SYMBOL_CONCAT_URL) : null;
    const menus = menuCategory ? [menuCategory] : [];
    const minP = Number(minPrice) || PRICE_FILED[0].VALUE;
    const maxP = Number(maxPrice) || PRICE_FILED[1].VALUE;
    const price = { min: minP, max: maxP };
    const queryPage = Number(page) || 1;
    let results = {
      sortBy,
      price,
      salonTypes: salons,
      menuCategory: menus,
      minPrice: minP,
      maxPrice: maxP,
      page: queryPage,
    };

    if (maxP === PRICE_FILED[1].VALUE) {
      results = _omit(results, "maxPrice"); // remove maxPrice key
    }

    let locations = { region };
    if (!_isEmpty(region) && region !== ALL_FIELD.objectId) {
      results = { ...results, areaIds: [region] };
    }
    if (!_isEmpty(prefecture)) {
      locations.prefecture = prefecture;
      results = { ...results, areaIds: [prefecture] };
    }
    if (!_isEmpty(wards)) {
      locations.type = TYPE_AREAS_FILED;
      locations.area = wards.split(SYMBOL_CONCAT_URL);
      results = { ...results, areaIds: wards.split(SYMBOL_CONCAT_URL) };
    }
    if (!_isEmpty(line)) {
      locations.type = TYPE_STATIONS_FILED;
      locations = {
        ...locations,
        lines: line.split(SYMBOL_CONCAT_URL),
        line: line.split(SYMBOL_CONCAT_URL),
      };
      results = { ...results, lineList: line.split(SYMBOL_CONCAT_URL) };
    }
    if (!_isEmpty(stations)) {
      locations.station = stations.split(SYMBOL_CONCAT_URL);
      results = _omit(
        { ...results, stationList: stations.split(SYMBOL_CONCAT_URL) },
        "lineList"
      ); // remove lineList key
      results = _omit(results, "areaIds"); // remove areaIds key
    }
    results = { ...results, locations };
    return results;
  },
  convertArrayToObject: (array) =>
    array.reduce(
      (acc, cur, index) => ({
        ...acc,
        [cur.objectId]: { ...cur, sortVal: index },
      }),
      {}
    ),
  convertArrayToObjectWithCustomKey: (array, symbol = SYMBOL_CONCAT_URL) =>
    array.reduce(
      (acc, cur, index) => ({
        ...acc,
        [`${index}${symbol}${cur.objectId}`]: cur,
      }),
      {}
    ),
  convertArrayToEntities: (array) => {
    const ids = [];
    const entities = (array || []).reduce((acc, cur) => {
      ids.push(cur.objectId);
      return { ...acc, [cur.objectId]: cur };
    }, {});
    return {
      ids,
      entities,
    };
  },
};
