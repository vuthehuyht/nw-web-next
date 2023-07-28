import _isEqual from "lodash/isEqual";

const DISALLOW_ALL = `User-agent: *
Disallow: /`;

const DISALLOW_LIST = `User-agent: *
Disallow: /campaigns/go-to-nail-goto5000
Disallow: /campaigns/cam-sbc002
Disallow: /campaigns/x3WROFU6fg_old
Disallow: /contact`;

export default function handler(req, res) {
  if (_isEqual(req.headers.host, "nailie.jp")) {
    res.send(DISALLOW_LIST); // prod
  } else {
    res.send(DISALLOW_ALL); // else
  }
}
