import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    largeTitle: {
      fontSize: "2.25rem",
      fontFamily: "Senlot",
      lineHeight: 1,
      [theme.breakpoints.up("md")]: {
        fontSize: "3.5rem",
      },
    },
    smallTitle: {
      fontFamily: "Noto Sans JP, Noto Serif JP, Open Sans, sans-serif",
    },
  })
);

export default function Title({ className, title, japanese }) {
  const classes = useStyles();

  return (
    <div className={`title-page ${className}`}>
      <Typography className={classes.largeTitle} variant="h2" align="center">
        {title}
      </Typography>
      <Typography
        className={classes.smallTitle}
        variant="subtitle1"
        align="center"
      >
        {japanese}
      </Typography>
    </div>
  );
}
