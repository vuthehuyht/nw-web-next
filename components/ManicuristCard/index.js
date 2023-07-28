import { useState, useEffect, memo } from "react";
import moment from "moment";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";
import Avatar from "@material-ui/core/Avatar";
import { isMobile } from "react-device-detect";
import { LazyLoadImage } from "react-lazy-load-image-component";
import NumberFormat from "react-number-format";
import _get from "lodash/get";
import _uniqWith from "lodash/uniqWith";
import _isEqual from "lodash/isEqual";
import _isNumber from "lodash/isNumber";
import _isEmpty from "lodash/isEmpty";
import _includes from "lodash/includes";
import Image from "next/image";
import Link from "next/link";

const mockData = [{ name: "a" }, { name: "b" }, { name: "c" }, { name: "d" }];

const renderTextDate = (text) => {
  const dateItem = moment(text, "YYYY-MM-DD");
  const countDays = dateItem.diff(moment().format("YYYY-MM-DD"), "days");

  switch (countDays) {
    case 0:
      return "今日";
    case 1:
      return "明日";
    case 2:
      return "明後日";
    default:
      return dateItem.format("MM/DD");
  }
};

const renderStationName = (stationName = [], data) => {
  // console.log('renderStationName: ', stationName, data);
  if (!_isEmpty(data.salonStationName)) {
    if (stationName.length === 1) {
      if (_isEqual(stationName[0], `${data.salonStationName}駅`)) {
        return `${data.salonStationName}駅${
          _isNumber(_get(data, "salonStationWalkingMinutes"))
            ? `から徒歩${_get(data, "salonStationWalkingMinutes")}分`
            : ""
        }`;
      }
      return `${data.stationList.slice(0, 3).join("駅・")}駅`;
    }
    if (stationName.length > 1) {
      if (_includes(stationName, `${data.salonStationName}駅`)) {
        return `${data.salonStationName}駅`;
      }
      return `${data.stationList.slice(0, 3).join("駅・")}駅`;
    }
  } else {
    return `${data.stationList.slice(0, 3).join("駅・")}駅`;
  }
};

const ManicuristCard = ({
  data,
  type = "vertical",
  stationKeys = [],
  searchByStations = false,
}) => {
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  const dataSlots = isMobileLayout
    ? data.recommendSlots.slice(0, 3)
    : data.recommendSlots;
  const dataSlotsForType =
    type === "vertical" && dataSlots ? dataSlots.slice(0, 3) : dataSlots;
  const dataPosts = isMobileLayout
    ? data.recommendPosts.slice(0, 3)
    : data.recommendPosts;
  let dataPostsForType = Array.from(dataPosts);
  if (dataPosts.length < 4) {
    // eslint-disable-next-line prefer-spread
    dataPostsForType.push.apply(dataPostsForType, mockData);
  }
  if (type === "vertical") {
    dataPostsForType = dataPosts.slice(0, 3);
  }
  if (type === "horizontal") {
    dataPostsForType = isMobileLayout
      ? dataPosts.slice(0, 3)
      : dataPosts.slice(0, 4);
  }
  const stationList = _uniqWith(
    _get(data, "salonStationSuggestionsList", []),
    _isEqual
  );

  return (
    <Card className={`manicurist-card ${type}`} variant="outlined">
      <Link href={`/nailist/${data.objectId}`} passHref>
        <CardActionArea>
          <CardContent>
            <div className="manicurist-card__info">
              <div className="avatar">
                <Avatar>
                  <Image layout="fill" alt={data.username} src={data.avatar} />
                </Avatar>
              </div>
              <div className="content">
                <div className="inner-content">
                  <Typography component="h3" className="user-name">
                    {data.username}
                  </Typography>
                  <Typography
                    component="h3"
                    className="salon-name overflow-ellipsis"
                    color="textSecondary"
                  >
                    {data.salonName || " "}
                  </Typography>
                  <p className="rating-content">
                    <span className="total">{data.totalAverage}</span>
                    <Rating
                      name="size-small"
                      defaultValue={data.totalAverage || 0}
                      size="small"
                      disabled
                    />
                    <span className="review">({data.countReview}件)</span>
                  </p>
                </div>
                {!searchByStations && (
                  <>
                    {stationList.length > 0 && (
                      <div className="location-content">
                        <i className="icon-map-pin" />
                        {data.salonStationName ? (
                          <>
                            {`${data.salonStationName}駅`}
                            {_isNumber(_get(data, "salonStationWalkingMinutes"))
                              ? `から徒歩${_get(
                                  data,
                                  "salonStationWalkingMinutes"
                                )}分`
                              : ""}
                          </>
                        ) : (
                          `${stationList.slice(0, 3).join("駅・")}駅`
                        )}
                      </div>
                    )}
                    {stationList.length === 0 && (
                      <div className="location-content">
                        <i className="icon-location" />
                        {data.salonArea}
                      </div>
                    )}
                  </>
                )}

                {/* Search results page */}
                {searchByStations && !_isEmpty(stationKeys) && (
                  <div className="location-content">
                    <i className="icon-map-pin" />
                    {renderStationName(stationKeys.split("+"), {
                      ...data,
                      stationList,
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className="post-wrapper">
              {dataPostsForType &&
                dataPostsForType.map((item, index) => {
                  if (!_isEmpty(_get(item, "objectId"))) {
                    return (
                      <div key={item.objectId} className="post-media-wrapper">
                        <div className="post-media">
                          <div className="post-media__img">
                            <Image
                              src={_get(item, "thumbnail")}
                              layout="fill"
                              alt={_get(data, "objectId")}
                            />
                          </div>
                          <div className="post-media__details">
                            {_get(item, "taggedMenu.price") > 0 && (
                              <div className="post-media__tag type-price">
                                <NumberFormat
                                  value={_get(item, "taggedMenu.price")}
                                  displayType={"text"}
                                  prefix={"¥"}
                                  thousandSeparator
                                  renderText={(value) => (
                                    <span className="price">{value}</span>
                                  )}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div className="post-media-wrapper" key={index}>
                      <div className="post-media">
                        <div className="post-media__img">
                          <LazyLoadImage
                            alt="Nailie"
                            className="gallery-img"
                            height="100%"
                            placeholderSrc="/assets/images/default-photo.png"
                            src="/assets/images/default-photo.png"
                            wrapperClassName="gallery-img-wrapper"
                            effect="blur"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
          <CardActions>
            <p className="slot-title">
              <i className="icon-progress-make-appointment" />
              空き状況
            </p>
            <div className="slot-content">
              {dataSlotsForType &&
                dataSlotsForType.map((slot) => (
                  <Typography variant="body2" key={slot.date}>
                    <span className="date-text">
                      {renderTextDate(slot.date)}
                    </span>
                    <span className="display-text">{slot.display}</span>
                  </Typography>
                ))}
            </div>
          </CardActions>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default memo(ManicuristCard);
