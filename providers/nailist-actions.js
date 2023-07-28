import request from "lib/request";
import { VERSION, LIMIT } from "utils/constants";

export const searchNailist = (payload) => {
  const { page } = payload;
  const params = {
    page: page || 1,
    limit: payload.limit ? payload.limit : LIMIT,
    ...payload,
  };

  return request("functions/webAdvancedSearchNailist", params)
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getMyPageSideCustomer = (payload) => {
  const { objectId } = payload;

  return request("functions/getMyPageSideCustomer", {
    userId: objectId,
    version: VERSION,
  })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getReviews = (payload) => {
  const { objectId, page } = payload;

  return request("functions/getReviews4NailistV2", {
    version: VERSION,
    limit: LIMIT,
    page: page || 1,
    revieweeId: objectId,
  })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getDeepLinkToShare = (payload) => {
  const { objectId } = payload;

  return request("functions/getDeepLinkToShare", { userId: objectId })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getPosts = (payload) => {
  const { objectId, page } = payload;

  return request("functions/getPostsV3", {
    type: "USER",
    version: VERSION,
    uuid: "BX7SfW0D-14Ub-Pxpm-9tsE-TLn2lKMFad9u",
    limit: LIMIT,
    page: page || 1,
    userId: objectId,
  })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getMenus = (payload) => {
  const { objectId } = payload;

  return request("functions/getMenusBookingByUser", { userId: objectId })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};

export const getDetailPost = (payload) => {
  const { objectId } = payload;
  return request("functions/getDetailPostV4", {
    postId: objectId,
    version: VERSION,
  })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};
