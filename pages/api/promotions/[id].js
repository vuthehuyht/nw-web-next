import request from "lib/request";
import { limiter } from "@utils/rateLimit";

export default async function handler(req, res) {
  try {
    await limiter.check(res, 60, "CACHE_TOKEN"); // 60 requests per minute

    const id = req.query.id || "";
    await request("functions/webGetPromotionDetail", { bannerId: id })
      .then((data) => {
        res.status(200).json(data.result);
      })
      .catch((err) => {
        res.status(500).json({ error: err, status: "error" });
      });
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
