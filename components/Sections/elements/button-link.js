import { makeStyles } from "@material-ui/core/styles";
import CustomLink from "./custom-link";

const useStyles = makeStyles(() => ({
  children: {
    display: "flex",
    padding: "12px",
    backgroundColor: "#ffd280",
    borderRadius: "4px",
  },
  text: {
    textAlign: "left",
    fontWeight: 700,
    color: "#4d7293",
  },
}));

const ButtonLink = ({ link, rightIcon, maxWidth }) => {
  const classes = useStyles();

  return (
    <CustomLink link={link}>
      <div className={classes.children}>
        <div style={{ maxWidth }} className={classes.text}>
          {link.text}
        </div>
        {rightIcon}
      </div>
    </CustomLink>
  );
};

export default ButtonLink;
