import { makeStyles } from "@material-ui/core/styles";
import Image from "../elements/image";

const useStyles = makeStyles(() => ({
  image: {
    objectFit: "contain",
    width: "430px",
    height: "298px",
  },
}));

const Banner = ({ data }) => {
  const classes = useStyles();

  return (
    <div className="banner-section">
      {/* Mobile Image */}
      {/* Image */}
      <Image media={data.desktopImage.src} className={classes.image} />
      {/* Desktop Image */}
      {/* Image */}
      <Image media={data.mobileImage.src} className={classes.image} />
    </div>
  );
};

export default Banner;
