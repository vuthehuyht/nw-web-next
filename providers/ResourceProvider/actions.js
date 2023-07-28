import _get from "lodash/get";
import { SALON_TYPES_X10, LIMIT } from "@utils/constants";
import api from "lib/api";

const config = {
  baseURL: process.env.DOMAIN_NAME,
};

export const getAreasList = async (_, callServer) => {
  const result = await api.post(
    callServer
      ? "/functions/webGetListOfAllAreas"
      : "/api/functions/webGetListOfAllAreas",
    { hasNailist: 1 },
    callServer ? {} : config
  );
  return _get(result, callServer ? "result.areas" : "areas", []);
};

export const getNormalMenuCategories = async (_, callServer) => {
  const result = await api.post(
    callServer
      ? "/functions/getNormalMenuCategories"
      : "/api/functions/getNormalMenuCategories",
    {},
    callServer ? {} : config
  );
  return callServer ? _get(result, "result", []) : result;
};

export const getSalonTypes = async (_, callServer) => {
  const result = await api.post(
    callServer ? "/functions/getSalonTypes" : "/api/functions/getSalonTypes",
    {},
    callServer ? {} : config
  );
  const data = callServer ? _get(result, "result", []) : result;
  return data.concat([SALON_TYPES_X10]);
};

export const getStationList = () =>
  api.post("/api/functions/getStationsList", { getAll: true }, config);

export const getStationListByLine = (payload) =>
  api.post(
    "/api/functions/getStationsList",
    { ...payload, getAll: true },
    config
  );

export const getLineList = async (payload, callServer) => {
  const result = await api.post(
    callServer ? "/functions/getLinesList" : "/api/functions/getLinesList",
    { ...payload, getAll: true },
    callServer ? {} : config
  );
  return callServer ? _get(result, "result", []) : result;
};

export const getPromotionList = async (payload, callServer) => {
  const result = await api.post(
    callServer
      ? "/functions/webGetPromotionList"
      : "/api/functions/webGetPromotionList",
    payload,
    callServer ? {} : config
  );
  return callServer ? _get(result, "result", []) : result;
};

export const searchNailist = async (payload, callServer) => {
  const { page } = payload;
  const params = {
    page: page || 1,
    limit: payload.limit ? payload.limit : LIMIT,
    ...payload,
  };
  const result = await api.post(
    callServer
      ? "/functions/webAdvancedSearchNailist"
      : "/api/functions/webAdvancedSearchNailist",
    params,
    callServer ? {} : config
  );
  return callServer ? _get(result, "result", {}) : result;
};

export const uploadImage = (payload) => {
  const { file, uploadType, userId } = payload;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("uploadType", uploadType);
  formData.append("userId", userId);

  return api.post("/api/uploadImage", formData, {
    baseURL: process.env.DOMAIN_NAME,
    heades: {
      "Content-Type": "multipart/form-data",
    },
  });
};
