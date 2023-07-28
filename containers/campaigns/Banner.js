import { useEffect, useState } from "react";
import _get from "lodash/get";
import { Container } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import ImageWithLoading from "components/ImageWithLoading";

export default function Banner({ imgPC, imgSP, alt, sizeContainer }) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  return (
    <div className="banner-promotion">
      <Container className="container" maxWidth={sizeContainer || "xl"}>
        <figure className="banner-img">
          {isMobileLayout && _get(imgSP, "src") && (
            <div className="type-sp">
              <ImageWithLoading
                alt={alt}
                image={{
                  thumbnail: imgSP.thumbnail,
                  src: imgSP.src,
                }}
                height="100%"
              />
            </div>
          )}

          {!isMobileLayout && _get(imgPC, "src") && (
            <div className="type-pc">
              <ImageWithLoading
                alt={alt}
                image={{
                  thumbnail: imgPC.thumbnail,
                  src: imgPC.src,
                }}
                height="100%"
              />
            </div>
          )}
        </figure>
      </Container>
    </div>
  );
}
