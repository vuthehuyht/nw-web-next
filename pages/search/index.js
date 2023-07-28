import { useState, useCallback, useMemo, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import _find from "lodash/find";
import _isEqual from "lodash/isEqual";
import { Container, Grid, Box, Hidden } from "@material-ui/core";
import { useSelector } from "react-redux";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { useQuery } from "react-query";
import Select from "components/SelectCustom";
import Layout from "components/Layout";
import Modal from "components/Modal";
import ManicuristCard from "components/ManicuristCard";
import AdvancedForm from "containers/search/AdvancedSearchForm";
import AdvancedSearchBox from "containers/search/AdvancedSearchBox";
import Breadcrumbs from "containers/search/SearchBreadcrumbs";
import { searchNailist } from "@providers/nailist-actions";
import HELPER from "utils/helper";
import {
  ALL_FIELD,
  PRICE_FILED,
  SORT_BY,
  TYPE_AREAS_FILED,
  TYPE_STATIONS_FILED,
  LOCATION_URL,
  SYMBOL_CONCAT_URL,
} from "utils/constants";
import { wrapper } from "store";
import ResultNailistsSkeleton from "components/Skeleton/ResultNailistsSkeleton";
import { useStations } from "hooks";
import {
  getAreasList,
  getLineList,
  getNormalMenuCategories,
  getSalonTypes,
} from "providers/ResourceProvider/actions";
import {
  setDataAreas,
  setDataLines,
  setDataMenus,
  setDataSalonTypes,
} from "providers/ResourceProvider/slice";
import dataStationName from "./stationName.json";

const handleGetNailist = (query) => {
  const params = HELPER.splitParamsFromRouter(query);
  return searchNailist(params);
};

const SearchPage = ({ querySearch, stationsName }) => {
  const { isReady, query, replace } = useRouter();
  const {
    region,
    prefecture,
    wards,
    line,
    salonTypes,
    stations,
    sortBy,
    menuCategory,
  } = query || querySearch;

  const salonTypesArray = useMemo(
    () => (salonTypes ? salonTypes.split(SYMBOL_CONCAT_URL) : []),
    [salonTypes]
  );
  const stationsArray = useMemo(
    () => (stations ? stations.split(SYMBOL_CONCAT_URL) : []),
    [stations]
  );
  const lineArray = useMemo(
    () => (line ? line.split(SYMBOL_CONCAT_URL) : []),
    [line]
  );

  const searchParams = HELPER.splitParamsFromRouter(query);

  const { isFetching: isNailistSearching, data = {} } = useQuery({
    queryKey: ["nailist", query],
    queryFn: () => handleGetNailist(query),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    keepPreviousData: true,
    enabled: isReady,
  });
  const { users, total } = data;
  const dataAreas = useSelector((state) => state.resource.dataAreas.entities);
  const dataLines = useSelector((state) => state.resource.dataLines);
  const { dataStations, getStationsByLine } = useStations();
  const dataMenus = useSelector((state) => state.resource.dataMenus.entities);
  const dataSalonTypes = useSelector(
    (state) => state.resource.dataSalonTypes.entities
  );

  const queryLocation = useMemo(() => {
    const location = {};
    if (region) {
      if (region === ALL_FIELD.objectId) {
        location.region = {
          objectId: ALL_FIELD.objectId,
          region: ALL_FIELD.name,
        };
      }
      const dataRegion = dataAreas[region];

      if (dataRegion) {
        location.region = dataRegion;
      }
      const dataPrefecture = dataRegion?.prefectures[prefecture];
      if (dataPrefecture) {
        location.province = dataPrefecture;
        if (wards) {
          const wardArr = wards.split(SYMBOL_CONCAT_URL);
          const areas = [];
          wardArr.forEach((wardId) => {
            const area = _find(dataPrefecture.areas, ["objectId", wardId]);
            if (area) {
              areas.push(area);
            }
          });
          location.areas = areas;
        }
      }
    }
    return location;
  }, [dataAreas, prefecture, region, wards]);

  const {
    region: currentRegion,
    province: currentProvince,
    areas: currentAreas,
  } = queryLocation;

  const currentDataLines = dataLines[currentProvince?.prefectureCode];

  const chosenLines = useMemo(
    () =>
      currentDataLines ? lineArray.map((item) => currentDataLines[item]) : [],
    [lineArray, currentDataLines]
  ); // Array of chosen "object" lines

  const chosenStations = useMemo(
    () =>
      dataStations ? stationsArray.map((station) => dataStations[station]) : [],
    [stationsArray, dataStations]
  ); // Array of chosen "object" stations

  useEffect(() => {
    // get dataStations when null on mobile
    if (!_isEmpty(chosenStations)) {
      getStationsByLine({
        type: "no dataStations",
        prefectureCodes: queryLocation?.province.prefectureCode,
        lineCodes: line,
      });
    }
  }, [dataStations, chosenStations, line, queryLocation, getStationsByLine]);

  const salonTypeList = useMemo(
    () =>
      dataSalonTypes
        ? salonTypesArray.map((type) => dataSalonTypes[type]?.name).join()
        : [],
    [salonTypesArray, dataSalonTypes]
  );
  const currentAreasWards = currentAreas
    ? currentAreas.map((area) => area.wards).join("+") // .join(SYMBOL_CONCAT_URL)
    : "";

  const [openSearchPopup, setOpenSearchPopup] = useState(false);
  const locationText = useMemo(() => {
    const locationArr = [];
    const locationBreadcrumb = [];
    if (currentRegion) {
      locationArr[0] = currentRegion.region;
      locationBreadcrumb[0] = {
        text: currentRegion.region,
        href: `search?${LOCATION_URL.REGION}=${currentRegion.objectId}&${LOCATION_URL.SORT}=${sortBy}`,
      };
      if (currentProvince) {
        locationArr[1] = currentProvince.province;
        locationBreadcrumb[1] = {
          text: currentProvince.province,
          href: `search?${LOCATION_URL.REGION}=${currentRegion.objectId}&${LOCATION_URL.PREFECTURE}=${currentProvince.objectId}&${LOCATION_URL.SORT}=${sortBy}`,
        };
      }
      if (!_isEmpty(chosenLines)) {
        locationArr[2] = TYPE_STATIONS_FILED.name; // add type
        locationArr[3] = chosenLines.map((li) => li?.name).join("+");
        // .join(SYMBOL_CONCAT_URL);
        locationBreadcrumb[2] = {
          text: locationArr[3],
          href: `search?${LOCATION_URL.REGION}=${currentRegion.objectId}&${
            LOCATION_URL.PREFECTURE
          }=${currentProvince.objectId}&${LOCATION_URL.LINES}=${chosenLines
            .map((li) => li?.objectId)
            .join(SYMBOL_CONCAT_URL)}&${LOCATION_URL.SORT}=${sortBy}`,
        };
      }
      if (!_isEmpty(chosenStations)) {
        locationArr[2] = TYPE_STATIONS_FILED.name; // add type
        locationArr[4] = `${chosenStations
          .map((station) => station?.name)
          .join("駅+")}駅`;
        // .join(SYMBOL_CONCAT_URL);
        locationBreadcrumb[3] = {
          text: `${chosenStations
            .map((station) => station?.name)
            .join("駅+")}駅`,
          // .join(SYMBOL_CONCAT_URL),
        };
      } else if (!_isEmpty(currentAreasWards)) {
        locationArr[2] = TYPE_AREAS_FILED.name; // add type
        locationArr[3] = currentAreasWards;
        locationBreadcrumb[2] = {
          text: currentAreasWards,
        };
      }
    }
    return { locationArr, locationBreadcrumb };
  }, [
    chosenLines,
    chosenStations,
    currentAreasWards,
    currentProvince,
    currentRegion,
    sortBy,
  ]);

  const handleGetNailistList = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const onSubmitAdvancedForm = useCallback(
    (values) => {
      let params = {};
      try {
        const {
          location,
          menuCategory: menuCategoryValue,
          price,
          salonTypes: salonTypesValue,
        } = values;
        // locations
        if (!_isEmpty(_get(values, "location"))) {
          if (location.region.id === ALL_FIELD.id) {
            params.region = "all";
          } else {
            params = HELPER.renderLocationUrl(location);
          }
          params.sortBy = sortBy;
        }

        if (menuCategoryValue && !_isEmpty(menuCategoryValue)) {
          params.menuCategory = menuCategoryValue;
          params.minPrice = _get(price, "min") || PRICE_FILED[0].VALUE;
          if (
            _get(price, "max", 0) > 0 &&
            _get(price, "max") !== PRICE_FILED[1].VALUE
          ) {
            params.maxPrice = _get(price, "max");
          }
        }

        if (salonTypesValue && !_isEmpty(salonTypesValue)) {
          params.salonTypes = salonTypesValue.join(",");
        }
        setOpenSearchPopup(false);
        handleGetNailistList();
        // console.log("submit: ", HELPER.convertSearchUrl(params));
        replace(
          { pathname: "/search", query: HELPER.convertSearchUrl(params) },
          null,
          {
            shallow: true,
          }
        );
      } catch (error) {
        console.log("error", error);
      }
    },
    [handleGetNailistList, replace, sortBy]
  );

  const handleChangeSortBy = useCallback(
    (sortValue) => {
      handleGetNailistList();
      replace(
        {
          pathname: "/search",
          query: HELPER.convertSearchUrl({
            ...query,
            sortBy: sortValue,
            page: 1,
          }),
        },
        null,
        { shallow: true }
      );
    },
    [handleGetNailistList, query, replace]
  );

  let currentKeySearch = "";
  if (locationText.locationArr) {
    if (locationText.locationArr.length < 5) {
      currentKeySearch = locationText.locationArr.join(",");
    } else if (!_isEmpty(chosenStations)) {
      let countIndex = -1;
      while (++countIndex <= locationText.locationArr.length - 2) {
        currentKeySearch += `${locationText.locationArr[countIndex]},`;
      }
      if (_isEqual(locationText.locationArr[4].split("+")[0], "駅")) {
        currentKeySearch += `${stationsName.join("駅+")}駅`;
      } else {
        currentKeySearch += locationText.locationArr[4];
      }
    }
  }

  return (
    <Layout>
      <Head>
        <meta
          name="keywords"
          content={`${currentKeySearch},ネイル,ネイリスト,サロン,予約,ネイリー,Nailie`}
        />
      </Head>
      {/* <NextSeo
        title={`${currentKeySearch}の人気なネイルサロン・ネイリスト - ネイリー（Nailie）`}
        description={`${currentKeySearch}の人気のネイリストの口コミ人気ランキングをご紹介！レビューやデザイン情報からあなたにピッタリのネイリスト・ネイルサロンが見つかります。`}
      /> */}
      <div className="search-page">
        <Breadcrumbs breadcrumbs={locationText.locationBreadcrumb} />
        <div className="search-wrapper">
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AdvancedSearchBox
                  locations={locationText.locationArr.join("/")}
                  salonTypes={salonTypeList}
                  menuCategory={dataMenus[menuCategory]}
                  clickFunction={() => setOpenSearchPopup(true)}
                />
                <div className="heading-result">
                  <div className="total-result">
                    <span>{total}</span> 人のおすすめネイリスト
                  </div>
                  <div className="sort-field">
                    <div className="text-field-label">並び替え</div>
                    <div className="select-field">
                      <Select
                        label="並び替え"
                        options={SORT_BY}
                        value={_get(searchParams, "sortBy")}
                        onChange={(e) => handleChangeSortBy(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </Grid>
              <Hidden only={["xs", "sm"]}>
                <Grid item md={4}>
                  <h4 className="filter-title">絞り込み方法</h4>
                  <AdvancedForm
                    defaultValues={{
                      ...searchParams,
                      keywordLocations: locationText.locationArr.join(","),
                      locationList: locationText.locationArr.join("/"),
                      menuCategory: searchParams.menuCategory.join(","),
                      salonTypeList,
                      location: searchParams.locations,
                    }}
                    onSubmit={onSubmitAdvancedForm}
                  />
                </Grid>
              </Hidden>
              <Grid item xs={12} sm={12} md={8}>
                {!isNailistSearching && _isEmpty(users) && (
                  <div className="empty-search-nailist">
                    <img
                      src="/assets/images/empty/empty-nailist.svg"
                      alt="Nailie"
                    />
                    <p>
                      申し訳ございません。検索対象のネイリストは見つかりませんでした。
                    </p>
                    <p>別の方法でお試しください。</p>
                  </div>
                )}
                {!isNailistSearching && !_isEmpty(users) && (
                  <>
                    <div className="result-wrapper">
                      {users.map((nailist) => (
                        <ManicuristCard
                          key={nailist.objectId}
                          data={nailist}
                          type="horizontal"
                          stationKeys={
                            !_isEmpty(locationText.locationArr)
                              ? locationText.locationArr[
                                  locationText.locationArr.length - 1
                                ]
                              : ""
                          }
                          searchByStations={_get(
                            searchParams,
                            "locations.lines"
                          )}
                        />
                      ))}
                      {!isNailistSearching && total > 20 && (
                        <Box
                          paddingTop="16px"
                          paddingBottom="16px"
                          display="flex"
                          justifyContent="center"
                        >
                          <Pagination
                            count={Math.ceil(total / 20)}
                            page={searchParams.page}
                            color="primary"
                            onChange={async (event, value) => {
                              await replace(
                                {
                                  pathname: "/search",
                                  query: HELPER.convertSearchUrl({
                                    ...query,
                                    page: value,
                                  }),
                                },
                                null,
                                {
                                  shallow: true,
                                }
                              );
                              setTimeout(
                                () =>
                                  window.scrollTo({
                                    top: 0,
                                    left: 0,
                                    behavior: "smooth",
                                  }),
                                100
                              );
                            }}
                            renderItem={(item) => <PaginationItem {...item} />}
                          />
                        </Box>
                      )}
                    </div>
                  </>
                )}
                {isNailistSearching && (
                  <div className="result-wrapper">
                    {[1, 2, 3, 4].map((item) => (
                      <ResultNailistsSkeleton key={item} />
                    ))}
                  </div>
                )}
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
      <Modal
        className="search-dialog modal"
        title="ネイリスト検索"
        open={openSearchPopup}
        handleClose={setOpenSearchPopup}
      >
        <AdvancedForm
          className="search-popup"
          defaultValues={{
            ...searchParams,
            keywordLocations: locationText.locationArr.join(","),
            locationList: locationText.locationArr.join("/"),
            menuCategory: searchParams.menuCategory.join(","),
            salonTypeList,
            location: searchParams.locations,
          }}
          onSubmit={onSubmitAdvancedForm}
        />
      </Modal>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    if (!global.dataAreaList || !global.dataMenus || !global.dataSalonTypes) {
      [global.dataAreaList = [], global.dataMenus, global.dataSalonTypes] =
        await Promise.all([
          getAreasList({}, true),
          getNormalMenuCategories({}, true),
          getSalonTypes({}, true),
        ]);
    }

    if (!global.prefectureData) {
      const promises = [];
      const prefectureData = {};
      global.dataAreaList.forEach((area) => {
        area.prefectures.forEach((prefecture) => {
          promises.push(
            getLineList(
              { getAll: true, prefectureCodes: prefecture.prefectureCode },
              true
            ).then((result) => {
              prefectureData[prefecture.prefectureCode] =
                HELPER.convertArrayToObject(result);
            })
          );
        });
      });
      await Promise.all(promises);

      global.prefectureData = prefectureData;
    }

    store.dispatch(setDataAreas(global.dataAreaList));
    store.dispatch(setDataLines(global.prefectureData));
    store.dispatch(setDataMenus(global.dataMenus));
    store.dispatch(setDataSalonTypes(global.dataSalonTypes));

    const stationsName = [];
    if (context?.query?.stations) {
      context.query.stations
        .split(",")
        .forEach((st) => stationsName.push(dataStationName[st]));
    }

    return {
      props: {
        querySearch: context.query,
        stationsName,
      },
    };
  }
);

export default SearchPage;
