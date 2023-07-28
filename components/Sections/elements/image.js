import { getStrapiMedia } from "utils/media";

const Image = ({ media, className, style }) => {
  if (!media) {
    return null;
  }

  const { url, alternativeText } = media;
  const fullUrl = getStrapiMedia(url);

  return (
    <img
      src={fullUrl}
      alt={alternativeText || ""}
      className={className}
      style={style}
    />
  );
};

export default Image;
