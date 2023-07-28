import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Helper from "utils/helper";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    backgroundColor: "#fcfbff",
    boxShadow: "0 2px 8px 0 rgba(181, 181, 181, 0.15)",
  },
  media: {
    height: 111,
  },
  actions: {
    flexDirection: "column",
    alignItems: "initial",

    "& p": {
      color: "#858585",
      fontFamily: [
        "Noto Sans JP",
        "Noto Serif JP",
        "Open Sans",
        "sans-serif",
      ].join(","),
    },
  },
  content: {
    height: 45,
    overflow: "hidden",

    "& h2": {
      fontFamily: [
        "Noto Sans JP",
        "Noto Serif JP",
        "Open Sans",
        "sans-serif",
      ].join(","),
      fontWeight: "normal",
    },
  },
});

export default function NewsCard({ data }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={data.thumbnail}
          title={data.title}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="subtitle2" component="h2">
            {data.title}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.actions}>
        <Typography variant="caption" component="p">
          {data.postByRole}
        </Typography>
        <Typography variant="caption" component="p" style={{ marginLeft: 0 }}>
          {Helper.formatDate(data.createAt, "YYYY年MM月DD日")}
        </Typography>
      </CardActions>
    </Card>
  );
}
