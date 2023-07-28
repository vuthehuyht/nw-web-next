import { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { isMobile } from "react-device-detect";

export default function Banner({ imgPC, imgSP }) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  return (
    <Container className="banner-section" maxWidth={false}>
      {/* <div id="image-div">
        <Image
          src={isMobileLayout ? imgSP : imgPC}
          layout="fill"
          alt={alt}
        />
      </div> */}
      <div
        id="image-div"
        style={{ backgroundImage: `url(${isMobileLayout ? imgSP : imgPC})` }}
      />
    </Container>
  );
}
