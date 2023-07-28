import axios from "axios";
import _get from "lodash/get";
import Cookies from "js-cookie";
import {
  API_APP_ID,
  API_REST_API_KEY,
  API_SERVER_URL,
  API_JAVASCRIPT_KEY,
} from "./config";

const api = axios.create({
  baseURL: API_SERVER_URL,
});

api.interceptors.request.use((config) => {
  const requestConfig = {
    ...config,
  };
  if (config.baseURL === process.env.DOMAIN_NAME) {
    requestConfig.headers = {
      ...config.headers,
      "Content-Type": "application/json;charset=utf-8",
    };
  } else if (config.baseURL === API_SERVER_URL) {
    requestConfig.headers = {
      ...config.headers,
      "X-Parse-Application-Id": API_APP_ID,
      "X-Parse-REST-API-Key": API_REST_API_KEY,
      "X-Parse-Javascript-Key": API_JAVASCRIPT_KEY,
    };
  }
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response.data,
  ({ message, response }) => {
    if (_get(response, "data.error.code") === 209 && process.browser) {
      Cookies.remove("nw-cookie", { path: "" });
      window.location = "/";
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
      error: _get(response, "data.error", message),
      code: _get(response, "data.code", response?.status || -1),
    });
  }
);

export default api;
