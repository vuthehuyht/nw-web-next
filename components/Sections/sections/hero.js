import { getStrapiMedia } from "utils/media";
import { getBackground } from "utils/background";
import { getTextColor } from "utils/color";

const HeroSection = ({ data }) => (
  <div
    style={{
      ...getBackground(data.backgroundColor),
      ...getTextColor(data.textColor),
      backgroundImage: data.backgroundImage?.url
        ? `url(${getStrapiMedia(data.backgroundImage.url)})`
        : "none",
    }}
    className="hero-section"
  >
    {/* Title */}
    <div className="hero__title">{data.title}</div>
    {/* Subtitle */}
    <div className="hero__subtitle">{data.subtitle}</div>
  </div>
);

export default HeroSection;
