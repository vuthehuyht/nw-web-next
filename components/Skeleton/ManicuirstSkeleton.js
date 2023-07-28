import { Grid, Card, CardHeader, CardContent } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

export default function ManicuirstSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardHeader
            avatar={
              <Skeleton
                variant="circle"
                animation="wave"
                width={44}
                height={44}
              />
            }
            title={<Skeleton animation="wave" />}
            subheader={<Skeleton animation="wave" />}
          />
          <CardContent>
            <Skeleton variant="rect" height={118} />
            <Skeleton animation="wave" style={{ marginTop: 8 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
