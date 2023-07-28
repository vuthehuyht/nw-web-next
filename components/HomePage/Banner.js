import { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { isMobile } from "react-device-detect";
import LazyImage from "@components/LazyImage";

export default function Banner({ imgPC, imgSP, alt }) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  return (
    <Container maxWidth="xl">
      <LazyImage
        className="lazy-home-banner"
        alt={alt}
        src={isMobileLayout ? imgSP : imgPC}
        height={isMobileLayout ? 269 : 480}
      />
    </Container>
  );
}
