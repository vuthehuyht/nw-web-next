// import request from 'lib/request';

// export const getCampaignList = async () => {
//   return (await fetch(`${process.env.DOMAIN_NAME}/api/promotions`)).json();
// }

// export const getDetailCampaign = async (payload) => {
//   const { objectId } = payload;

//   return (await fetch(`${process.env.DOMAIN_NAME}/api/promotions/${objectId}`)).json();
// }

import request from "lib/request";

export const getCampaignList = () =>
  request("functions/webGetPromotionList")
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));

export const getDetailCampaign = (payload) => {
  const { objectId } = payload;
  return request("functions/webGetPromotionDetail", { bannerId: objectId })
    .then((data) => data.result)
    .catch((err) => ({ err, status: "error" }));
};
