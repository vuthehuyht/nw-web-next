import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";

import Skeleton from "@material-ui/lab/Skeleton";

const ManicuristCard = () => (
  <Card className="manicurist-card horizontal" variant="outlined">
    <CardActionArea>
      <CardContent>
        <div className="manicurist-card__info">
          <div className="avatar">
            <Skeleton variant="circle">
              <Avatar></Avatar>
            </Skeleton>
          </div>
          <div className="content">
            <div className="inner-content">
              <Skeleton width="100%">
                <Typography component="h3" className="user-name">
                  .
                </Typography>
              </Skeleton>
              <Skeleton width="100%">
                <Typography
                  component="h3"
                  className="salon-name overflow-ellipsis"
                  color="textSecondary"
                >
                  .
                </Typography>
              </Skeleton>
              <Skeleton width="100%">
                <p className="rating-content">.</p>
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="post-wrapper">
          {[1, 2, 3, 4].map((item) => (
            <div className="post-media-wrapper" key={item}>
              <div className="post-media">
                <div className="post-media__img">
                  <Skeleton
                    variant="rect"
                    className="gallery-img"
                    height="100%"
                    animation="wave"
                  ></Skeleton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardActions>
        <p className="slot-title">
          <i className="icon-progress-make-appointment" />
          空き状況
        </p>
      </CardActions>
    </CardActionArea>
  </Card>
);

export default ManicuristCard;
