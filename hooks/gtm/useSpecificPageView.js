import { useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useWebCookie } from "hooks";

const useSpecificPageViewEvent = () => {
  const { asPath } = useRouter();

  const { webCookie } = useWebCookie();
  const [cookies] = useCookies(["prevUrl"]);

  const identificationParams = useMemo(
    () => ({
      is_login: !!webCookie,
      user_id: webCookie?.objectId || "",
    }),
    [webCookie]
  );

  const trackEvent = useCallback(
    (params) => {
      window.dataLayer?.push({
        ...identificationParams,
        page: `${process.env.DOMAIN_NAME}${asPath}`,
        ...(cookies
          ? {
              original_location: `${process.env.DOMAIN_NAME}${cookies.prevUrl}`,
            }
          : {}),
        ...params,
      });
    },
    [asPath, cookies, identificationParams]
  );

  return { trackEvent };
};

export default useSpecificPageViewEvent;
