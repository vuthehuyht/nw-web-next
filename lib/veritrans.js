import axios from "axios";

const Veritrans = {
  get4GTokenCard: async (cardInfo) => {
    const data = JSON.stringify({
      ...cardInfo,
      token_api_key: process.env.VERITRANS_API_KEY,
    });
    const config = {
      method: "post",
      url: `${process.env.VERITRANS_API_URL}/4gtoken`,
      headers: {
        "Content-Type": "application/json",
      },
      data,
    };
    const result = await axios(config);
    return result.data;
  },
};

export default Veritrans;
