import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import _isEmpty from "lodash/isEmpty";
import { getStationListByLine } from "@providers/ResourceProvider/actions";
import { setDataStations } from "@providers/ResourceProvider/slice";

const useStations = () => {
  const dispatch = useDispatch();
  const [loadingStations, setLoadingStations] = useState(false);
  const [currentDataStations, setCurrentDataStations] = useState();
  const dataStations = useSelector(
    (state) => state.resource.dataStations.entities
  );
  const dataStationsIds = useSelector(
    (state) => state.resource.dataStations.ids
  );

  const getStationsByLineId = useCallback(
    // eslint-disable-next-line consistent-return
    async (params) => {
      try {
        setLoadingStations(true);
        const result = await getStationListByLine(params);
        if (!_isEmpty(result)) {
          dispatch(setDataStations(result));
          setCurrentDataStations(result);
        }
        setLoadingStations(false);
        return result;
      } catch (e) {
        setLoadingStations(false);
        console.error("error: ", e);
      }
    },
    [dispatch]
  );

  return {
    loadingStations,
    dataStations,
    dataStationsIds,
    currentDataStations,
    getStationsByLine: getStationsByLineId,
  };
};

export default useStations;
