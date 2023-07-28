import api from "lib/api";
import Stripe from "lib/stripe";
import Veritrans from "lib/veritrans";

const config = {
  baseURL: process.env.DOMAIN_NAME,
};

export const getCardToken = (payload) => {
  const result = Stripe.createStripeToken(payload);
  return result;
};

export const get4GTokenCard = (payload) => {
  const result = Veritrans.get4GTokenCard(payload);
  return result;
};

export const addCreditCard = (payload) =>
  api.post("/api/functions/addCreditCard", payload, config);

export const getCardList = (payload) =>
  api.post("/api/functions/getCardList", payload, config);

export const deleteCard = (payload) =>
  api.post("/api/functions/deleteCard", payload, config);

export const setDefaultCard = (payload) =>
  api.post("/api/functions/setDefaultCard", payload, config);

export const getCardPaymentProvider = (payload) =>
  api.post("/api/functions/getCardPaymentProvider", payload, config);
