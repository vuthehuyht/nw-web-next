import api from "lib/api";
import { limiter } from "@utils/rateLimit";
import helper from "utils/helper";

export default async function handler(req, res) {
  try {
    await limiter.check(res, 60, "CACHE_TOKEN"); // 60 requests per minute
    const parsedCookie = helper.getRequestCookie(req);
    const registerCookie = parsedCookie["register-data"];
    const authData = registerCookie ? JSON.parse(registerCookie) : null;

    api
      .post("functions/linkPhoneAuthToAccount", req.body, {
        headers: {
          "X-Parse-Session-Token": authData.sessionToken,
        },
      })
      .then((data) => {
        res.status(200).json(data.result);
      })
      .catch((err) => {
        res.status(500).json({ error: err, status: "error" });
      });
  } catch (error) {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
