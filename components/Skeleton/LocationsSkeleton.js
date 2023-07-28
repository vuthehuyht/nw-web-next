import { Container } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { isMobile } from "react-device-detect";

export default function LocationsSkeleton() {
  return (
    <Container className="locations-wrapper">
      <Container className="location-search-form" maxWidth="md">
        <Skeleton
          animation="wave"
          width={isMobile ? 310 : 960}
          height={isMobile ? 53 : 86}
        />
      </Container>
      <div className="recommend-location">
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
        <div className="location-block">
          <div className="location-inner">
            <Skeleton animation="wave" width={140} height={140} />
          </div>
        </div>
      </div>

      <div className="area-list">
        <div className="area-block">
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
        </div>
        <div className="area-block">
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
          <div className="area-line">
            <div className="region-item">
              <i className="icon-location" />
              <Skeleton animation="wave" style={{ width: 80, height: 26 }} />
            </div>
            <div className="prefecture-list">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
