import { useState, useEffect } from "react";
import _find from "lodash/find";
import Image from "next/image";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
import Button from "./DownloadButton";
import mock from "./mock.json";

export default function DownloadSection({ className }) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [isMobileAndroid, setIsMobileAndroid] = useState(false);
  const [isMobileIOS, setIsMobileIOS] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
    setIsMobileAndroid(isAndroid);
    setIsMobileIOS(isIOS);
  }, []);

  return (
    <div className={`download-sec ${className || ""}`}>
      {isMobileIOS && (
        <Button {..._find(mock, ["type", "iOS"])}>
          <Image {..._find(mock, ["type", "iOS"])} width={160} height={52} />
        </Button>
      )}
      {isMobileAndroid && <Button {..._find(mock, ["type", "android"])} />}
      {!isMobileLayout &&
        mock.map((item) => (
          <Button key={item.type} {...item}>
            <Image {...item} width={160} height={52} />
          </Button>
        ))}
    </div>
  );
}
