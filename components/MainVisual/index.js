import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Image from "next/image";
import clsx from "clsx";

const MainVisual = ({
  className,
  alt,
  imgSP,
  imgPC,
  maxWidth = "lg",
  desktopSize = 555 / 1440,
  mobileSize = 490 / 375,
}) => (
  <div className={`main-visual ${className || ""}`}>
    <Container maxWidth={maxWidth}>
      {imgSP && (
        <div className="mobile">
          <Image
            alt={alt}
            src={imgSP}
            layout="responsive"
            objectFit="contain"
            priority
            width={1}
            height={mobileSize}
          />
        </div>
      )}
      <div
        className={clsx("desktop", {
          // eslint-disable-next-line prettier/prettier
          "show": !imgSP,
        })}
      >
        <Image
          alt={alt}
          src={imgPC}
          width={1}
          height={desktopSize}
          layout="responsive"
          objectFit="contain"
          priority
        />
      </div>
    </Container>
  </div>
);

MainVisual.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  imgPC: PropTypes.string,
  imgSP: PropTypes.string,
  maxWidth: PropTypes.oneOf(["lg", "md"]),
  desktopSize: PropTypes.number,
};

export default MainVisual;
