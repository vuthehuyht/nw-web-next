import { useCookies } from "react-cookie";

const cookieName = "nw-cookie";

const useWebCookie = () => {
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);
  const webCookie = cookies[cookieName];

  const setWebCookie = (value, options = {}) => {
    setCookie(cookieName, value, options);
  };
  const removeWebCookie = (options = {}) => {
    removeCookie(cookieName, options);
  };
  return { webCookie, setWebCookie, removeWebCookie };
};

export default useWebCookie;
