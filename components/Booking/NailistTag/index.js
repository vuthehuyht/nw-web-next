import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    fontSize: 10,
    lineHeight: "16px",
    height: "unset",
  },
});

const NailistTag = () => {
  const classes = useStyles();
  return (
    <Chip
      classes={classes}
      size="small"
      label="P10倍"
      color="secondary"
      className="nailist-tag-container"
    />
  );
};

export default NailistTag;
