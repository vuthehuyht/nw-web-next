import axios from "axios";
import _get from "lodash/get";

const Stripe = {
  createStripeToken: async (params) => {
    const paramsForm = new URLSearchParams();
    paramsForm.append("card[number]", params.cardNumber);
    paramsForm.append("card[exp_month]", _get(params, "cc-exp-month"));
    paramsForm.append("card[exp_year]", _get(params, "cc-exp-year"));
    paramsForm.append("card[cvc]", _get(params, "cc-csc"));
    paramsForm.append("key", process.env.STRIPE_PUBLIC_KEY);
    const result = await axios({
      method: "post",
      url: `${process.env.STRIPE_BASE_URL}/v1/tokens`,
      data: paramsForm,
    });
    return result.data;
  },
};

export default Stripe;
