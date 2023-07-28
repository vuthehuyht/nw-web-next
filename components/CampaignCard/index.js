import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import renderHTML from "react-render-html";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import _get from "lodash/get";
import { isMobile } from "react-device-detect";

export default function CampaignCard({ data }) {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);
  const imageMobileItem = data.params.popupMobile
    ? data.params.popupMobile
    : _get(data, "params.details.banner.desktop");
  const imageItem = isMobileLayout ? imageMobileItem : data.params.popup;

  return (
    <Card className="campaign-card">
      <CardActionArea
        className="action-area"
        component="a"
        href={`/campaigns/${data.objectId}`}
      >
        <CardMedia
          className="card-media"
          title={data.name}
          style={{ position: "relative" }}
        >
          <Image src={imageItem} alt={data.name} layout="fill" />
        </CardMedia>
        <CardContent className="card-content">
          <div className="content-wrapper">
            <div className="content-inner">
              <Typography component="h2" variant="h5" color="textSecondary">
                {data.name}
              </Typography>
              <Typography component="h3" variant="subtitle1">
                {data.params.subName}
              </Typography>
              <Typography variant="caption">
                {data.params.codeDescription}
              </Typography>
              <Typography component="h4" variant="subtitle1">
                {data.params.code}
              </Typography>
              {data.date && (
                <Typography component="p" variant="subtitle1">
                  {renderHTML(data.date)}
                </Typography>
              )}
              {data.params.dateParams && (
                <Typography component="p" variant="subtitle1">
                  {renderHTML(data.params.dateParams)}
                </Typography>
              )}
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

CampaignCard.propTypes = {
  data: PropTypes.object,
};
