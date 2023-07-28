import {
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      height: 360,
      boxShadow: "0 2px 8px 0 rgba(181, 181, 181, 0.15)",
      backgroundColor: "#fff",
      border: "1px solid #eee",
      justifyContent: "space-between",
    },
    details: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "50%",
    },
    cover: {
      minWidth: "50%",
    },
  })
);

export default function CampaignsSkeleton() {
  const classes = useStyles();

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6}>
        <CardActionArea component="div">
          <Card className={classes.root}>
            <CardContent className={classes.details}>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </CardContent>
            <CardMedia image={<Skeleton animation="wave" height="100%" />} />
          </Card>
        </CardActionArea>
      </Grid>
      <Grid item xs={12} sm={6}>
        <CardActionArea component="div">
          <Card className={classes.root}>
            <CardContent className={classes.details}>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </CardContent>
            <CardMedia image={<Skeleton animation="wave" />} />
          </Card>
        </CardActionArea>
      </Grid>
    </Grid>
  );
}
