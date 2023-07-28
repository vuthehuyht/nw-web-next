import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import { useSelector } from "react-redux";
import _get from "lodash/get";
import _findIndex from "lodash/findIndex";
import _isEmpty from "lodash/isEmpty";
import _isEqual from "lodash/isEqual";
import _filter from "lodash/filter";
import _omit from "lodash/omit";
import _isArray from "lodash/isArray";
import _groupBy from "lodash/groupBy";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import {
  ALL_FIELD,
  TYPE_STATIONS_FILED,
  TYPE_AREAS_FILED,
  SYMBOL_CONCAT_URL,
} from "@utils/constants";
import { useStations } from "hooks";
import Helper from "utils/helper";
import TextItem from "./TextItem";
import AreasList from "./AreasList";
import LineList from "./LineList";
import ProvinceList from "./ProvinceList";
import RegionList from "./RegionList";

export default function LocationSelect(props) {
  const dataAreas = useSelector((state) => state.resource.dataAreas.entities);
  const dataAreasIds = useSelector((state) => state.resource.dataAreas.ids);
  const { isReady } = useRouter();
  const dataLines = useSelector((state) => state.resource.dataLines);
  const { dataStations, loadingStations, getStationsByLine } = useStations();

  const { defaultValue, className, label, onChange } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [regionField, setRegionField] = useState(null);
  const [prefectureField, setPrefectureField] = useState(null);
  const [typeField, setTypeField] = useState(null);
  const [areaField, setAreaField] = useState(null);
  const [selectAllArea, setSelectAllArea] = useState(false);
  const [lineList, setLineList] = useState(false);
  const [lineField, setLineField] = useState([]);
  const [currentLine, setCurrentLine] = useState(null);
  const [stationList, setStationList] = useState({});
  const [selectAllStation, setSelectAllStation] = useState({});
  const [stationField, setStationField] = useState({});
  const [scrollTop, setScrollTop] = useState(false);
  const [displayStation, setDisplayStation] = useState();
  const defaultRegion = defaultValue?.region;
  const defaultPrefecture = defaultValue?.prefecture;
  const defaultType = defaultValue?.type;
  const stringifyDefaultArea = JSON.stringify(defaultValue?.area);
  const stringifyLine = JSON.stringify(defaultValue?.line);
  const stringifyLines = JSON.stringify(defaultValue?.lines);
  const stringifyStation = JSON.stringify(defaultValue?.station);

  useEffect(() => {
    if (defaultRegion && isReady) {
      const regionData = dataAreas[defaultRegion];

      const prefectureData = regionData?.prefectures[defaultPrefecture];
      const { prefectureCode } = prefectureData || {};
      let step = 0;

      setRegionField({
        ...regionData,
        name: _get(regionData, "region"),
        values: _get(regionData, "prefectures"),
      });

      if (defaultPrefecture) {
        step = 1;
        setPrefectureField({
          ...prefectureData,
          name: _get(regionData, "province"),
          values: _get(prefectureData, "areas"),
        });
      }
      if (defaultType) {
        step = 2;
        setTypeField(defaultType);
      }
      if (!_isEmpty(stringifyLine)) {
        step = 3;
        const station = stringifyStation ? JSON.parse(stringifyStation) : [];
        if (!_isEmpty(station)) {
          step = 4;
        }
      }

      if (!_isEmpty(stringifyDefaultArea)) {
        const defaultArea = JSON.parse(stringifyDefaultArea);
        step = 2;
        setTypeField(TYPE_AREAS_FILED);

        setSelectAllArea(
          defaultArea.length === _get(prefectureData, "areas", []).length
        );

        if (defaultArea.length > 0) {
          step = 3;
          setAreaField(defaultArea);
        }
      }

      if (!_isEmpty(stringifyLine)) {
        const lineData = JSON.parse(stringifyLine);
        setTypeField(TYPE_STATIONS_FILED);
        const lineListData = dataLines[Number(prefectureCode)];
        if (!_isEmpty(lineListData)) {
          setLineList(lineListData);
          const lineObjList = [];
          let lineObj = {};
          lineData.forEach((idLine, index) => {
            // lineObjList[idLine] = lineListData[idLine];
            Object.keys(lineListData).forEach((key) => {
              if (_isEqual(idLine, key.split(SYMBOL_CONCAT_URL).pop()))
                lineObj = lineListData[key];
            });
            if (index < 1) {
              setCurrentLine(lineObj);
            }
            if (!_isEmpty(lineObj)) {
              lineObjList.push(lineObj);
            }
          });
          setLineField(lineObjList);
        }
      }
      setActiveStep(step);
    }
  }, [
    dataAreas,
    dataLines,
    defaultPrefecture,
    defaultRegion,
    defaultType,
    isReady,
    stringifyDefaultArea,
    stringifyLine,
    stringifyStation,
  ]);

  useEffect(() => {
    if (defaultRegion && isReady) {
      const regionData = dataAreas[defaultRegion];
      const prefectureData = regionData?.prefectures[defaultPrefecture];
      const { prefectureCode } = prefectureData || {};
      if (!_isEmpty(stringifyLine)) {
        const lineData = JSON.parse(stringifyLine);
        const lineListData = dataLines[Number(prefectureCode)];

        if (!_isEmpty(lineListData)) {
          let lineObj = {};
          const newStations = {};
          lineData.forEach((idLine) => {
            // lineObjList[idLine] = lineListData[idLine];
            lineObj = lineListData[idLine];
            // if (index < 1) {
            //   setCurrentLine(lineObj);
            // }
            if (!_isEmpty(lineObj)) {
              // lineObjList.push(lineObj);
              const stations = Object.keys(dataStations).reduce((acc, cur) => {
                if (
                  dataStations[cur].lineCodes.indexOf(lineObj.objectId) > -1 &&
                  dataStations[cur].prefectureCode === prefectureCode
                ) {
                  return { ...acc, [cur]: dataStations[cur] };
                }
                return acc;
              }, {});
              Object.assign(newStations, { [lineObj.objectId]: stations });
            }
          });
          setStationList((oldStationList) => ({
            ...oldStationList,
            ...newStations,
          }));
          // set station's value
          setDisplayStation(newStations[lineData[0]]);
          setStationField({}); // reset station field
          setSelectAllStation({}); // reset checkAll station
          // setLineField(lineObjList);
        }
        const station = stringifyStation ? JSON.parse(stringifyStation) : [];
        if (!_isEmpty(station)) {
          let results = [];

          if (!_isEmpty(dataStations)) {
            const defaultLines = JSON.parse(stringifyLines);
            let stationFieldData = {};
            let checkboxAllSation = {};
            defaultLines.forEach((lineId) => {
              results = [];
              const currentStationList = Object.keys(dataStations).reduce(
                (acc, cur) => {
                  if (
                    dataStations[cur].prefectureCode === prefectureCode &&
                    dataStations[cur].lineCodes[0] === lineId
                  ) {
                    return { ...acc, [cur]: dataStations[cur] };
                  }
                  return acc;
                },
                {}
              );

              if (!_isEmpty(currentStationList)) {
                station.forEach((stationId) => {
                  if (currentStationList[stationId]) {
                    results.push(stationId);
                  }
                });

                if (!_isEmpty(results)) {
                  const textLineId = lineId.objectId || lineId;
                  stationFieldData = Object.assign(stationFieldData, {
                    [textLineId]: results,
                  });
                  // check select all of stations with sation has numOfNailist > 0
                  checkboxAllSation = {
                    ...checkboxAllSation,
                    [textLineId]:
                      results.length ===
                      Object.keys(
                        _filter(currentStationList, (o) => o.numOfNailist > 0)
                      ).length,
                  };
                } else {
                  getStationsByLine({
                    type: "1 line",
                    prefectureCodes: _get(defaultPrefecture, "prefectureCode"),
                    lineCodes: lineId,
                  });
                }
              }
            });
            // Set stationField and selectAllStation outside forEach
            setStationField(stationFieldData);
            setSelectAllStation(checkboxAllSation);
          } else {
            const defaultLines = JSON.parse(stringifyLines);
            // No dataStations
            getStationsByLine({
              type: "no dataStations",
              prefectureCodes: prefectureCode,
              lineCodes: _isArray(defaultLines)
                ? defaultLines.join(",")
                : defaultLines,
            }).then((result) => {
              setDisplayStation(
                result.reduce((acc, cur) => {
                  if (
                    cur.lineCodes.includes(
                      _isArray(defaultLines) ? defaultLines[0] : defaultLines
                    )
                  ) {
                    return { ...acc, [cur.objectId]: cur };
                  }
                  return acc;
                }, {})
              );
              const groupResult = _groupBy(result, "lineCodes");
              const test = Object.keys(groupResult).reduce(
                (acc, cur) => ({
                  ...acc,
                  [cur]: Helper.convertArrayToObject(groupResult[cur]),
                }),
                {}
              );
              setStationList(test);
            });
          }
        }
      }
    }
  }, [
    dataAreas,
    dataLines,
    dataStations,
    defaultPrefecture,
    defaultRegion,
    getStationsByLine,
    isReady,
    stringifyLine,
    stringifyLines,
    stringifyStation,
  ]);

  /** Reset field when change defaulValue */
  useEffect(() => {
    if (!defaultPrefecture) {
      setPrefectureField(null);
    }
  }, [defaultPrefecture]);
  useEffect(() => {
    setTypeField(defaultType);
  }, [defaultType]);
  useEffect(() => {
    if (!stringifyDefaultArea) {
      setAreaField(null);
    }
  }, [stringifyDefaultArea]);
  useEffect(() => {
    if (!stringifyStation) {
      setStationField({});
    }
  }, [stringifyStation]);
  useEffect(() => {
    if (!stringifyLine) {
      setLineField([]);
    }
  }, [stringifyLine]);

  const setLineValue = useCallback(
    (lineObj) => {
      setCurrentLine(lineObj);
      const lineObjList = lineField || [];
      const indexCurrentItem = _findIndex(lineObjList, [
        "objectId",
        lineObj.objectId,
      ]);
      if (indexCurrentItem < 0) {
        lineObjList.push(lineObj);
      }
      setLineField(lineObjList);
    },
    [lineField]
  );

  const handleBack = () => {
    if (activeStep === 4) {
      // check: has not any stations of line in stationField
      if (
        !_isEmpty(currentLine) &&
        _isEmpty(stationField[currentLine.objectId])
      ) {
        setLineField(_filter(lineField, ["objectId", !currentLine.objectId])); // remove field in lineField
        setCurrentLine(null);
      }
    }
    if (activeStep === 3) {
      setTypeField(null);
      setAreaField(null);
      setSelectAllArea(false);
      setLineField(null);
      setStationField({});
      setSelectAllStation({});
      onChange({
        region: regionField.objectId,
        prefecture: prefectureField.objectId,
        type: typeField,
        area: [],
      });
    }
    if (activeStep === 2) {
      setLineField(null);
      setCurrentLine(null);
      setPrefectureField(null);
      setSelectAllArea(false);
      setStationList(null);
    }
    if (activeStep === 1) {
      setPrefectureField(null);
      setRegionField(null);
    }
    setActiveStep(activeStep - 1);
  };

  const chooseRegionValue = useCallback(
    (region) => {
      setRegionField({ ...region, objectId: region.id });
      setPrefectureField(null);
      setAreaField(null);

      if (region.id !== ALL_FIELD.objectId) {
        // switch prefecture slide
        setActiveStep(1);
      }
      onChange({ region: region.id });
    },
    [onChange]
  );

  const choosePrefectureValue = useCallback((prefecture) => {
    setScrollTop(true);
    setPrefectureField(prefecture);
    setAreaField(null);
    // reset lineFiled and stationFiled
    setLineField([]);
    setStationField({}); // reset station field
    setSelectAllStation({}); // reset checkAll station
    // switch areas slide
    setActiveStep(2);
  }, []);

  const chooseTypesValue = useCallback(
    (type) => {
      setTypeField(type);
      if (type.id === TYPE_STATIONS_FILED.id) {
        const lines = _get(
          dataLines,
          `${_get(prefectureField, "prefectureCode")}`
        );
        setLineList(lines);
        setScrollTop(false);
      }
      // switch areas slide
      setActiveStep(3);
    },
    [dataLines, prefectureField]
  );

  const chooseAreasValue = useCallback(
    (areas) => {
      let listArea = areaField || [];
      if (listArea.includes(areas.objectId)) {
        listArea = listArea.filter((areaId) => areaId !== areas.objectId);
      } else {
        listArea.push(areas.objectId);
      }
      setAreaField(listArea);
      setSelectAllArea(listArea.length === prefectureField.values.length);
      // set value when choose AREA
      onChange({
        region: regionField.objectId,
        prefecture: prefectureField.objectId,
        type: typeField,
        area: listArea,
      });
    },
    [
      areaField,
      onChange,
      prefectureField?.objectId,
      prefectureField?.values?.length,
      regionField?.objectId,
      typeField,
    ]
  );

  const chooseAllAreasValue = useCallback(
    (e) => {
      const valueCheck = e.target.checked;
      if (valueCheck) {
        const areaIds = prefectureField.values.map((area) => area.objectId);
        setAreaField(areaIds);
        onChange({
          region: regionField.objectId,
          prefecture: prefectureField.objectId,
          type: typeField,
          area: areaIds,
        });
      } else {
        setAreaField([]);
        onChange({
          region: regionField.objectId,
          prefecture: prefectureField.objectId,
          type: typeField,
          area: [],
        });
      }
      setSelectAllArea(valueCheck);
    },
    [onChange, prefectureField, regionField, typeField]
  );

  const chooseLineValue = useCallback(
    async (line) => {
      setLineValue(line);
      // get station list
      // check data in stationList
      // if it not has, it will requests data using API
      setActiveStep(4);
      if (_isEmpty(_get(stationList, `[${line.objectId}]`))) {
        const lineIds = [];
        if (lineField) {
          lineField.map((obj) => lineIds.push(obj.objectId));
        } else {
          lineIds.push(line.objectId);
        }
        const result = await getStationsByLine({
          type: "chooseLineValue",
          lineCodes: line.objectId,
          prefectureCodes: _get(prefectureField, "prefectureCode"),
        });
        setDisplayStation(Helper.convertArrayToObject(result));
        setStationList((oldStationList) => ({
          ...oldStationList,
          [line.objectId]: Helper.convertArrayToObject(result),
        }));
      } else {
        setDisplayStation(_get(stationList, `[${line.objectId}]`));
      }

      // switch station slide
    },
    [getStationsByLine, lineField, prefectureField, setLineValue, stationList]
  );

  const chooseStationsValue = useCallback(
    (stations) => {
      const lineId = _get(stations, "lineCodes.0");
      let dataCurrentStation = { ...stationField };
      if (!_isEmpty(dataCurrentStation)) {
        // check lineId exist in stationField Object
        if (!_isEmpty(dataCurrentStation[lineId])) {
          // check station exist in array
          const currentStation = dataCurrentStation[lineId].includes(
            stations.objectId
          );
          // const currentItem = dataCurrentStation[lineId][stations.objectId];
          if (currentStation) {
            dataCurrentStation[lineId] = dataCurrentStation[lineId].filter(
              (id) => id !== stations.objectId
            );
          } else {
            dataCurrentStation[lineId] = dataCurrentStation[lineId].concat([
              stations.objectId,
            ]);
          }
        } else {
          // not in stationField Object
          dataCurrentStation[lineId] = [stations.objectId];
        }
      } else {
        dataCurrentStation[lineId] = [stations.objectId];
      }

      if (dataCurrentStation[lineId].length < 1) {
        dataCurrentStation = _omit(dataCurrentStation, lineId);
        setSelectAllStation((oldSelectAllStation) =>
          Object.assign(oldSelectAllStation, { [lineId]: false })
        );
        // remove lineObject has not any station
        setLineField((oldLineField) =>
          _filter(oldLineField, (o) => o.objectId !== lineId)
        );
      } else {
        setSelectAllStation((oldSelectAllStation) =>
          Object.assign(oldSelectAllStation, {
            [lineId]:
              dataCurrentStation[lineId].length ===
              _filter(stationList[lineId], (o) => o.numOfNailist > 0).length,
          })
        );
      }
      setStationField(dataCurrentStation);
      // set value when choose STATION
      onChange({
        region: regionField.objectId,
        prefecture: prefectureField.objectId,
        type: typeField,
        line: lineField,
        station: dataCurrentStation,
      });
    },
    [
      lineField,
      onChange,
      prefectureField?.objectId,
      regionField?.objectId,
      stationField,
      stationList,
      typeField,
    ]
  );

  const chooseAllStationValue = (e) => {
    const valueCheck = e.target.checked;
    const lineId = currentLine.objectId;
    let dataCurrentStation = selectAllStation;
    dataCurrentStation = Object.assign(dataCurrentStation, {
      [lineId]: valueCheck,
    });
    if (valueCheck) {
      const newStationField = Object.assign(stationField, {
        [lineId]: _filter(stationList[lineId], (o) => o.numOfNailist > 0).map(
          (i) => i.objectId
        ),
      });

      setStationField(newStationField);
      onChange({
        region: regionField.objectId,
        prefecture: prefectureField.objectId,
        type: typeField,
        line: lineField,
        station: newStationField,
      });
    } else {
      setStationField(_omit(stationField, lineId)); // remove field in stationField
      onChange({
        region: regionField.objectId,
        prefecture: prefectureField.objectId,
        type: typeField,
        line: _filter(lineField, ["objectId", !lineId]),
        station: _omit(stationField, lineId),
      });
    }
    setSelectAllStation(dataCurrentStation);
  };

  const genrateSearchText = useCallback(() => {
    let results = "";
    if (regionField) {
      results = regionField.name || regionField.region;
    }
    if (!_isEmpty(prefectureField)) {
      results += `/${prefectureField.name || prefectureField.province}`;
    }
    if (!_isEmpty(typeField)) {
      results += `/${typeField.name}`;
    }
    if (!_isEmpty(areaField)) {
      let areaText = "";
      const areaData = (prefectureField.values || []).reduce(
        (acc, cur) => ({ ...acc, [cur.objectId]: cur }),
        {}
      );
      areaField.forEach((id, index) => {
        if (areaField.length - 1 === index) {
          areaText += areaData[id]?.name || areaData[id]?.wards;
        } else {
          areaText += `${areaData[id]?.name || areaData[id]?.wards}+`;
        }
      });
      results += `/${areaText}`;
    }

    if (!_isEmpty(lineField) && activeStep > 3) {
      const lineText = lineField.map((item) => _get(item, "name"));
      results += `/${lineText.join("+")}`;
    }

    if (
      !_isEmpty(stationField) &&
      activeStep === 4 &&
      !_isEmpty(dataStations)
    ) {
      const allStations = Object.values(stationField).flat();
      const stationText = allStations.map(
        (stationId) => dataStations[stationId].name
      );
      results += `/${stationText.join("駅+")}駅`;
    }
    return results;
  }, [
    activeStep,
    areaField,
    dataStations,
    lineField,
    prefectureField,
    regionField,
    stationField,
    typeField,
  ]);

  const renderLinesSwipe = () => (
    <div className="list-wrapper lines-swipe">
      <div className="left-list-wrapper">
        <IconButton onClick={() => handleBack()}>
          <span className="icon-angle-left left"></span>
        </IconButton>
      </div>
      <div className="right-list-wrapper">
        {!_isEmpty(lineList) && (
          <LineList
            data={lineList}
            handleGoTo={chooseLineValue}
            initValue={
              defaultValue &&
              (_get(defaultValue, "prefecture.objectId") ===
                _get(prefectureField, "objectId") ||
                _get(defaultValue, "prefecture") ===
                  _get(prefectureField, "objectId"))
                ? _get(defaultValue, "lines")
                : {}
            }
            scrollTop={scrollTop}
          />
        )}
      </div>
    </div>
  );

  const renderAresorLinesSwipe = () => {
    if (typeField.id === TYPE_AREAS_FILED.id) {
      return (
        <div className="list-wrapper areas-swipe">
          <div className="left-list-wrapper">
            <IconButton onClick={() => handleBack()}>
              <span className="icon-angle-left left"></span>
            </IconButton>
          </div>
          <div className="right-list-wrapper">
            {prefectureField &&
              prefectureField.values &&
              prefectureField.values.length > 0 && (
                <>
                  <div className="location-item location-item--checkbox">
                    {selectAllArea && (
                      <FormControlLabel
                        className="all-areas-btn"
                        label={`${
                          prefectureField.province || prefectureField.name
                        }すべて`}
                        control={
                          <Checkbox
                            onChange={(e) => chooseAllAreasValue(e)}
                            checked
                            name="all areas"
                            color="default"
                          />
                        }
                      />
                    )}
                    {!selectAllArea && (
                      <FormControlLabel
                        className="all-areas-btn"
                        label={`${
                          prefectureField.province || prefectureField.name
                        }すべて`}
                        control={
                          <Checkbox
                            onChange={(e) => chooseAllAreasValue(e)}
                            checked={selectAllArea}
                            name="all areas"
                            color="default"
                          />
                        }
                      />
                    )}
                  </div>
                  <AreasList
                    data={prefectureField.values}
                    handleGoTo={chooseAreasValue}
                    initValue={_get(defaultValue, "area", [])}
                    chooseValues={areaField && areaField}
                  />
                </>
              )}
          </div>
        </div>
      );
    }
    return renderLinesSwipe();
  };

  return (
    <div className={`location-wrapper ${className || ""}`}>
      <div className="location-label">
        {label}
        <div className="search-text">{genrateSearchText()}</div>
      </div>
      <div className="location-list">
        {!_isEmpty(dataAreasIds) ? (
          <SwipeableViews index={activeStep} enableMouseEvents={false} disabled>
            <div className="list-wrapper region-swipe">
              <div className="left-list-wrapper">
                <span className="icon-angle-left left"></span>
              </div>
              <div className="right-list-wrapper">
                <Button
                  className={`
                    all-region-btn
                    ${
                      regionField &&
                      regionField.objectId === ALL_FIELD.objectId &&
                      "active"
                    }
                  `}
                  disabled={
                    _get(regionField, "id") === ALL_FIELD.objectId ||
                    regionField === ALL_FIELD.objectId
                  }
                  onClick={() =>
                    chooseRegionValue({
                      id: ALL_FIELD.objectId,
                      name: ALL_FIELD.name,
                      objectId: ALL_FIELD.objectId,
                    })
                  }
                >
                  <Badge
                    className="badge"
                    overlap="rectangular"
                    invisible={
                      _get(defaultValue, "region") !== ALL_FIELD.objectId
                    }
                    badgeContent={
                      <img src="/assets/images/check.svg" alt="check" />
                    }
                  >
                    {ALL_FIELD.name}
                  </Badge>
                </Button>
                <RegionList
                  data={dataAreas}
                  ids={dataAreasIds}
                  handleGoTo={chooseRegionValue}
                  initValue={
                    _get(defaultValue, "region.objectId") ||
                    _get(defaultValue, "region")
                  }
                />
              </div>
            </div>
            <div className="list-wrapper province-swipe">
              <div className="left-list-wrapper">
                <IconButton onClick={() => handleBack()}>
                  <span className="icon-angle-left left"></span>
                </IconButton>
              </div>
              <div className="right-list-wrapper">
                {regionField && regionField.values && (
                  <ProvinceList
                    data={regionField.values}
                    handleGoTo={choosePrefectureValue}
                    initValue={
                      _get(defaultValue, "prefecture.objectId") ||
                      _get(defaultValue, "prefecture")
                    }
                  />
                )}
              </div>
            </div>
            <div className="list-wrapper station-or-area-swipe">
              <div className="left-list-wrapper">
                <IconButton onClick={() => handleBack()}>
                  <span className="icon-angle-left left"></span>
                </IconButton>
              </div>
              <div className="right-list-wrapper">
                <div className="types-list">
                  <Button
                    className="location-item types-btn location-item--button"
                    onClick={() => chooseTypesValue(TYPE_STATIONS_FILED)}
                  >
                    <Badge
                      className="badge"
                      overlap="rectangular"
                      invisible={
                        defaultValue &&
                        (_get(defaultValue, "prefecture.objectId") ===
                          _get(prefectureField, "objectId") ||
                          _get(defaultValue, "prefecture") ===
                            _get(prefectureField, "objectId"))
                          ? _get(defaultValue, "type.objectId") !==
                            TYPE_STATIONS_FILED.id
                          : true
                      }
                      badgeContent={
                        <img src="/assets/images/check.svg" alt="check" />
                      }
                    >
                      <i className="icon-station" />
                      <span>{TYPE_STATIONS_FILED.name}</span>
                    </Badge>
                  </Button>
                  <Button
                    className="location-item types-btn location-item--button"
                    onClick={() => chooseTypesValue(TYPE_AREAS_FILED)}
                  >
                    <Badge
                      className="badge"
                      overlap="rectangular"
                      invisible={
                        defaultValue &&
                        (_get(defaultValue, "prefecture.objectId") ===
                          _get(prefectureField, "objectId") ||
                          _get(defaultValue, "prefecture") ===
                            _get(prefectureField, "objectId"))
                          ? _get(defaultValue, "type.objectId") !==
                            TYPE_AREAS_FILED.id
                          : true
                      }
                      badgeContent={
                        <img src="/assets/images/check.svg" alt="check" />
                      }
                    >
                      <i className="icon-location-line" />
                      <span>{TYPE_AREAS_FILED.name}</span>
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
            {typeField && renderAresorLinesSwipe()}
            <div className="list-wrapper station-swipe">
              {!loadingStations && lineField ? (
                <>
                  <div className="left-list-wrapper">
                    <IconButton onClick={() => handleBack()}>
                      <span className="icon-angle-left left"></span>
                    </IconButton>
                  </div>
                  <div className="right-list-wrapper">
                    {!_isEmpty(currentLine) && !_isEmpty(stationList) && (
                      <>
                        <div className="location-item location-item--checkbox">
                          {_get(selectAllStation, `${currentLine.objectId}`) &&
                            _get(currentLine, "numOfNailist", 0) > 0 && (
                              <FormControlLabel
                                className="all-areas-btn"
                                label={`${currentLine.name}すべて`}
                                control={
                                  <Checkbox
                                    onChange={(e) => chooseAllStationValue(e)}
                                    checked
                                    name="all station"
                                    color="default"
                                  />
                                }
                              />
                            )}
                          {!_get(selectAllStation, `${currentLine.objectId}`) &&
                            _get(currentLine, "numOfNailist", 0) > 0 && (
                              <FormControlLabel
                                className="all-areas-btn"
                                label={`${currentLine.name}すべて`}
                                control={
                                  <Checkbox
                                    onChange={(e) => chooseAllStationValue(e)}
                                    checked={false}
                                    name="all station"
                                    color="default"
                                  />
                                }
                              />
                            )}
                          {_get(currentLine, "numOfNailist", 0) === 0 && (
                            <TextItem
                              key="all station"
                              id="all station"
                              name={`${currentLine.name}すべて`}
                              className="all-areas-btn"
                            />
                          )}
                        </div>
                        <AreasList
                          data={displayStation}
                          handleGoTo={chooseStationsValue}
                          initValue={defaultValue?.station}
                          chooseValues={stationField[currentLine.objectId]}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div style={{ marginTop: "16px" }}>
                  <CircularProgress />
                </div>
              )}
            </div>
          </SwipeableViews>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

LocationSelect.defaultProp = {
  defaultValue: [],
};

LocationSelect.propTypes = {
  defaultValue: PropTypes.any,
  className: PropTypes.any,
  label: PropTypes.any,
  name: PropTypes.string,
  onChange: PropTypes.func,
};
