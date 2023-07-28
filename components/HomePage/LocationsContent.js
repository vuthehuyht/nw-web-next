import { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import _get from "lodash/get";
import _find from "lodash/find";
import _times from "lodash/times";
import _replace from "lodash/replace";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Carousel from "react-multi-carousel";
import Slider from "react-slick";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchPopup from "@components/AdvancedSearchPopup";
import LinkButton from "@components/LinkButton";

const DEFAULT_ITEM = 6;

const mobileResponsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    paritialVisibilityGutter: 0,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    paritialVisibilityGutter: 0,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    paritialVisibilityGutter: 0,
  },
};

// const desktopResponsive = {
//   desktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 6,
//     paritialVisibilityGutter: 0,
//   },
//   tablet: {
//     breakpoint: { max: 1024, min: 464 },
//     items: 4,
//     paritialVisibilityGutter: 0,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 3,
//     paritialVisibilityGutter: 0,
//   },
// };

function NextArrow(props) {
  const { onClick } = props;
  return (
    <IconButton aria-label="next" onClick={onClick} className="btn-next">
      <i className="icon-angle-right" />
    </IconButton>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <IconButton aria-label="prev" onClick={onClick} className="btn-prev">
      <i className="icon-angle-left" />
    </IconButton>
  );
}

export default function LocationsContent({ data, loading }) {
  const [regionId, setRegionId] = useState();
  const [regionTxt, setRegionTxt] = useState();
  const [dataPrefecture, setDataPrefecture] = useState();
  const [dataHidden, setDataHidden] = useState([]);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const carouselEl = useRef(null);
  // const smallCarouselEl = useRef(null);

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  useEffect(() => {
    setIsMobileLayout(isMobile);
  }, []);

  const getDataPrefecture = (regionIdValue) => {
    const dataTemp = _find(data, ["objectId", regionIdValue]);
    setDataPrefecture(dataTemp);
    if (_get(dataTemp, "prefectures").length < DEFAULT_ITEM) {
      setDataHidden(
        _times(DEFAULT_ITEM - _get(dataTemp, "prefectures").length),
        String
      );
    } else {
      setDataHidden([]);
    }
  };

  const handleChooseRegion = (item) => {
    setRegionId(item.objectId);
    setRegionTxt(item.region);
    getDataPrefecture(item.objectId);
    carouselEl.current.next();
  };

  const handleBack = () => {
    setRegionId("");
    // const nextSlide = carouselEl.current.state.currentSlide - 1;
    carouselEl.current.previous();
  };

  // const CustomSlider = ({ carouselState }) => (
  //   <div className="custom-slider">
  //     <IconButton
  //       aria-label="prev"
  //       onClick={() => smallCarouselEl.current.previous()}
  //     >
  //       <i className="icon-angle-left" />
  //     </IconButton>
  //     <IconButton
  //       aria-label="next"
  //       onClick={() => smallCarouselEl.current.next()}
  //     >
  //       <i className="icon-angle-right" />
  //     </IconButton>
  //   </div>
  // );

  return (
    <div className="locations-wrapper">
      <Container>
        <SearchPopup />
        {isMobileLayout ? (
          <div className="recommend-wrapper mobild-carousel">
            <Carousel
              ref={carouselEl}
              ssr
              itemClass="carousel-item"
              responsive={mobileResponsive}
              swipeable={false}
              draggable={false}
            >
              <div className="region-wrapper">
                <div className="location-box">
                  <Button className="location-item first-item">
                    <i className="icon-location-line" />
                    <span>
                      エリア
                      <br />
                      を選ぶ
                    </span>
                  </Button>
                </div>
                {loading ? (
                  <div className="location-box loading">
                    <CircularProgress color="secondary" />
                  </div>
                ) : (
                  data &&
                  data.length > 0 &&
                  data.map((item) => (
                    <div className="location-box" key={item.objectId}>
                      <Button
                        key={item.objectId}
                        className="location-item area-item"
                        onClick={() => handleChooseRegion(item)}
                      >
                        <span>{_replace(item.region, "・", " ")}</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div className="prefecture-wrapper">
                <div className="location-box">
                  <Button
                    className="location-item first-item"
                    onClick={() => handleBack()}
                  >
                    <i className="icon-angle-left" />
                  </Button>
                </div>
                {dataPrefecture &&
                  dataPrefecture.prefectures &&
                  dataPrefecture.prefectures.length > 0 &&
                  dataPrefecture.prefectures.map((item) => (
                    <div className="location-box" key={item.objectId}>
                      <LinkButton
                        key={item.objectId}
                        className="location-item prefecture-item"
                        href={`search?region=${regionId}&prefecture=${item.objectId}&sortBy=RECOMMEND`}
                      >
                        <span>{item.province}</span>
                      </LinkButton>
                    </div>
                  ))}
                {dataHidden &&
                  dataHidden.length > 0 &&
                  dataHidden.map((item) => (
                    <div key={item} className="location-box">
                      <Button className="location-item hidden-item" />
                    </div>
                  ))}
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="recommend-wrapper desktop-carousel">
            <Carousel
              className="d-carousel"
              ref={carouselEl}
              ssr
              itemClass="carousel-item"
              responsive={mobileResponsive}
              swipeable={false}
              draggable={false}
            >
              <div className="region-wrapper">
                <div className="location-box text-box">
                  あなたの好みにあったネイリストをエリアから探してみましょう
                </div>
                <div className="inner-region">
                  {loading ? (
                    <Container>
                      <div className="loading-wrapper">
                        <CircularProgress color="secondary" />
                      </div>
                    </Container>
                  ) : (
                    <Container>
                      <Slider {...settings} key={1}>
                        {data &&
                          data.length > 0 &&
                          data.map((item) => (
                            <div className="location-box" key={item.objectId}>
                              <Button
                                key={item.objectId}
                                className="location-item area-item"
                                onClick={() => handleChooseRegion(item)}
                              >
                                <span>{_replace(item.region, "・", " ")}</span>
                              </Button>
                            </div>
                          ))}
                      </Slider>
                    </Container>
                  )}
                </div>
              </div>

              <div className="prefecture-wrapper">
                <div className="location-box text-box">
                  <Button className="first-item" onClick={() => handleBack()}>
                    <i className="icon-arrow-down" />
                    <span className="text">{regionTxt}</span>
                  </Button>
                </div>
                <div className="inner-prefecture">
                  <Container>
                    {dataPrefecture && dataPrefecture.prefectures && (
                      <Slider {...settings} key={regionId}>
                        {dataPrefecture.prefectures.length > 0 &&
                          dataPrefecture.prefectures.map((item) => (
                            <div className="location-box" key={item.objectId}>
                              <LinkButton
                                key={item.objectId}
                                className="location-item prefecture-item"
                                href={`search?region=${regionId}&prefecture=${item.objectId}&sortBy=RECOMMEND`}
                              >
                                <span>{item.province}</span>
                              </LinkButton>
                            </div>
                          ))}
                        {dataHidden &&
                          dataHidden.length > 0 &&
                          dataHidden.map((item) => (
                            <div key={item} className="location-box">
                              <Button className="location-item hidden-item" />
                            </div>
                          ))}
                      </Slider>
                    )}
                    {!dataPrefecture && <CircularProgress color="secondary" />}
                  </Container>
                </div>
              </div>
            </Carousel>
          </div>
        )}
      </Container>
    </div>
  );
}
