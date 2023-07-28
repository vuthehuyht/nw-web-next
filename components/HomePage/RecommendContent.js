import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import LinkButton from "@components/LinkButton";
import ManicuristCard from "@components/ManicuristCard";

const useStyles = makeStyles(() => ({
  paper: {
    margin: "auto",
    maxWidth: 1140,
  },
}));

const RecommendContent = ({ data }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container className="recomment-section" spacing={3}>
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.objectId}>
              <ManicuristCard data={item} />
            </Grid>
          ))}
        <Grid item xs={12} className="btn-group">
          <LinkButton
            variant="outlined"
            color="primary"
            className="btn-link"
            endIcon={<i className="icon-angle-right" />}
            href="/search?region=all&sortBy=RECOMMEND"
          >
            一覧へ
          </LinkButton>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RecommendContent;
