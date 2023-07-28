import axios from "axios";

import {
  API_APP_ID,
  API_REST_API_KEY,
  API_SERVER_URL,
  API_JAVASCRIPT_KEY,
} from "./config";

const getAxiosInstance = () => {
  const headers = {
    "X-Parse-Application-Id": API_APP_ID,
    "X-Parse-REST-API-Key": API_REST_API_KEY,
    "X-Parse-Javascript-Key": API_JAVASCRIPT_KEY,
  };

  const axiosInstance = axios.create({
    baseURL: API_SERVER_URL,
    headers,
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      if ([200, 201].includes(response.status)) {
        const result = response.data;
        result.statusCode = response.status;
        return response.data;
      }
      return Promise.reject(response);
    },
    (error) => {
      const { code } = error.response.data;

      if (code) {
        // // Authorize error
        // if (code === 209) {
        //   localStorage.removeItem('token');
        //   window.location.replace('/');
        // }

        return Promise.reject(error.response.data);
      }
      return Promise.reject(error.response.statusText);
    }
  );

  return axiosInstance;
};

const request = (url, data = {}) => {
  try {
    const API = getAxiosInstance();
    return API.post(url, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default request;
