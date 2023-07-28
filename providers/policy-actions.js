import request from "lib/request";
import api from "lib/api";

const config = {
  baseURL: process.env.DOMAIN_NAME,
};

export const getFaqList = () =>
  request("functions/webGetFaqList")
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));

export const postQuestionSupportTicket = (payload) =>
  api.post(
    "/api/functions/webPostQuestionSupportTicket",
    { ...payload, types: ["WEB"] },
    config
  );

export const postQuestionSupportSalonTicket = (payload) =>
  api.post(
    "/api/functions/webPostQuestionSupportTicket",
    { ...payload, types: ["SALON_CONTACT"] },
    config
  );
