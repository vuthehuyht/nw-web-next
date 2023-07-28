import api from "lib/api";
import { limiter } from "@utils/rateLimit";
import helper from "utils/helper";

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  try {
    await limiter.check(res, 60, "CACHE_TOKEN"); // 60 requests per minute
    const functionName = req.query.functionName || "";
    const parsedCookie = helper.getRequestCookie(req);
    const webCookie = parsedCookie["nw-cookie"];
    const parsedWebCookie = webCookie ? JSON.parse(webCookie) : null;
    const formatParams = helper.formatParams(req.body);

    try {
      const data = await api.post(
        `functions/${functionName}`,
        { ...formatParams, version: process.env.API_VERSION },
        {
          headers: {
            ...(parsedWebCookie
              ? { "X-Parse-Session-Token": parsedWebCookie.sessionToken }
              : {}),
          },
        }
      );
      res.status(200).json(data.result);
    } catch (err) {
      res.status(500).json({ error: err, status: "error" });
    }
  } catch {
    res.status(429).json({ error: "Rate limit exceeded" });
  }
}
