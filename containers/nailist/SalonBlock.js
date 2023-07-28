import { Grid } from "@material-ui/core";
import { useState } from "react";
import _get from "lodash/get";
import _isNumber from "lodash/isNumber";
import SlideShow from "./SlideShow";
import StaticMap from "./StaticMap";

const SalonBlock = ({ data }) => {
  const [openDetailsSalon, setOpenDetailsSalon] = useState(false);
  const [openDetailsMemo, setOpenDetailsMemo] = useState(false);
  const lat = _get(data, "latitude");
  const long = _get(data, "longitude");

  return (
    <div className="salon-block">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6} className="salon-inner-block">
          <div className="salon-r">
            <div className="salon-heading">
              <i className="icon-house" />
              <p className="title">サロン名</p>
            </div>
            <div className="salon-inner">
              <span className="salonName">{_get(data, "salonName")}</span>
            </div>
          </div>
          {_get(data, "isPrivate") ? (
            <>
              <div className="salon-r">
                <div className="salon-heading">
                  <i className="icon-location-line" />
                  <p className="title">住所</p>
                </div>
                <div className="salon-inner">
                  <span className="address">
                    {`${_get(data, "salonAddress")} (予約確定後に公開)`}
                  </span>
                </div>
              </div>
              {_get(data, "salonStationName") && (
                <div className="salon-r">
                  <div className="salon-heading">
                    <i className="icon-station" />
                    <p className="title">最寄駅</p>
                  </div>
                  <div className="salon-inner">
                    {`${_get(data, "salonStationName")}駅`}
                    {_isNumber(_get(data, "salonStationWalkingMinutes"))
                      ? `から徒歩${_get(data, "salonStationWalkingMinutes")}分`
                      : ""}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="salon-r">
                <div className="salon-heading">
                  <i className="icon-location-line" />
                  <p className="title">住所</p>
                </div>
                <div className="salon-inner">
                  <span className="address">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`http://maps.google.co.jp/maps?q=${lat},${long}`}
                    >
                      {_get(data, "salonAddress")}
                    </a>
                  </span>
                </div>
              </div>
              {_get(data, "salonStationName") && (
                <div className="salon-r">
                  <div className="salon-heading">
                    <i className="icon-station" />
                    <p className="title">最寄駅</p>
                  </div>
                  <div className="salon-inner">
                    {`${_get(data, "salonStationName")}駅`}
                    {_isNumber(_get(data, "salonStationWalkingMinutes"))
                      ? `から徒歩${_get(data, "salonStationWalkingMinutes")}分`
                      : ""}
                  </div>
                </div>
              )}
              {_get(data, "salonStationNavigation") && (
                <div className="salon-r salon-r--2-block">
                  <div className="salon-heading">
                    <i className="icon-map-pin" />
                    <p className="title">道案内・アクセス</p>
                  </div>
                  <div className="salon-inner">
                    <div className="salon-inner salon-notes">
                      <div className={!openDetailsMemo && "max-3-lines"}>
                        {_get(data, "salonStationNavigation")}
                      </div>
                      {!openDetailsMemo && (
                        <button
                          type="button"
                          className="more-txt-btn"
                          onClick={() => setOpenDetailsMemo(true)}
                        >
                          もっと読む
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {_get(data, "salonTypes") && _get(data, "salonTypes").length > 0 && (
            <div className="salon-r salon-r--2-block">
              <div className="salon-heading">
                <i className="icon-heart" />
                <p className="title">特徴</p>
              </div>

              <div className="salon-inner salon-types">
                {_get(data, "salonTypes").map((item) => (
                  <p key={item.type} className="i-type" tooltip={item.name}>
                    <img src={_get(item, "icons.normal")} alt={item.name} />
                    <span className="name-type">{item.name}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
          {_get(data, "salonDescription") && (
            <div className="salon-r salon-r--2-block remove-line">
              <div className="salon-heading">
                <i className="icon-notes" />
                <p className="title">サロンについて・注意事項</p>
              </div>

              <div className="salon-inner salon-notes">
                <div className={!openDetailsSalon && "max-3-lines"}>
                  {_get(data, "salonDescription")}
                </div>
                {!openDetailsSalon && (
                  <button
                    type="button"
                    className="more-txt-btn"
                    onClick={() => setOpenDetailsSalon(true)}
                  >
                    もっと読む
                  </button>
                )}
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
          <div className="salon-photos">
            <div className="slides">
              <SlideShow
                settings={{
                  dots: false,
                  arrows: true,
                  slidesToShow: 1,
                  responsive: [
                    {
                      breakpoint: 460,
                      settings: {
                        arrows: false,
                        centerMode: true,
                      },
                    },
                  ],
                }}
              >
                {_get(data, "salonPhotos") &&
                  _get(data, "salonPhotos").length > 0 &&
                  _get(data, "salonPhotos").map((image) => (
                    <img
                      className="slick-slide-image"
                      key={image}
                      src={image}
                      alt={data.salonName}
                    />
                  ))}
              </SlideShow>
            </div>
          </div>
          {!_get(data, "isPrivate") && (
            <StaticMap
              className="salon-map"
              lat={_get(data, "latitude")}
              long={_get(data, "longitude")}
            />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default SalonBlock;
