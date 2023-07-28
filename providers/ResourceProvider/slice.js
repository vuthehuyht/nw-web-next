import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { isEmpty as _isEmty, get as _get } from "lodash";
import Helper from "utils/helper";

const salonTypesAdapter = createEntityAdapter({
  selectId: (salonType) => salonType.objectId,
});

const dataMenusAdapter = createEntityAdapter({
  selectId: (menu) => menu.objectId,
});

const stationAdapter = createEntityAdapter({
  selectId: (station) => station.objectId,
});

const areasAdapter = createEntityAdapter({
  selectId: (area) => area.objectId,
});

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    dataAreas: areasAdapter.getInitialState(),
    dataMenus: dataMenusAdapter.getInitialState(),
    dataSalonTypes: salonTypesAdapter.getInitialState(),
    dataLines: {},
    dataStations: stationAdapter.getInitialState(),
    errorBookingCard: {},
  },
  reducers: {
    setDataAreas(state, action) {
      areasAdapter.addMany(
        state.dataAreas,
        action.payload.map((area) => ({
          ...area,
          prefectures: Helper.convertArrayToObject(area.prefectures),
        }))
      );
    },
    setDataMenus(state, action) {
      dataMenusAdapter.addMany(state.dataMenus, action.payload);
    },
    setDataSalonTypes(state, action) {
      salonTypesAdapter.addMany(state.dataSalonTypes, action.payload);
    },
    setDataLines(state, action) {
      return { ...state, dataLines: action.payload };
    },
    setDataStations(state, action) {
      stationAdapter.addMany(state.dataStations, action.payload);
    },
    setErrorBookingCard(state, action) {
      return { ...state, errorBookingCard: action.payload };
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      const dataAreas = _get(action, "payload.resource.dataAreas", {});
      const dataLines = _get(action, "payload.resource.dataLines", {});
      const dataMenus = _get(action, "payload.resource.dataMenus", {});
      const dataSalonTypes = _get(
        action,
        "payload.resource.dataSalonTypes",
        {}
      );

      return {
        ...state,
        dataAreas: {
          ids: !_isEmty(dataAreas.ids) ? dataAreas.ids : state.dataAreas.ids,
          entities: !_isEmty(dataAreas.entities)
            ? dataAreas.entities
            : state.dataAreas.entities,
        },
        dataLines: !_isEmty(dataLines) ? dataLines : state.dataLines,
        dataMenus: {
          ids: !_isEmty(dataMenus.ids) ? dataMenus.ids : state.dataMenus.ids,
          entities: !_isEmty(dataMenus.entities)
            ? dataMenus.entities
            : state.dataMenus.entities,
        },
        dataSalonTypes: {
          ids: !_isEmty(dataSalonTypes.ids)
            ? dataSalonTypes.ids
            : state.dataSalonTypes.ids,
          entities: !_isEmty(dataSalonTypes.entities)
            ? dataSalonTypes.entities
            : state.dataSalonTypes.entities,
        },
      };
    },
  },
});
export const {
  setDataAreas,
  setDataMenus,
  setDataSalonTypes,
  setDataLines,
  setDataStations,
  setErrorBookingCard,
} = resourceSlice.actions;

export default resourceSlice.reducer;
