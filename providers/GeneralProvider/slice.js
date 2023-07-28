import { createSlice } from "@reduxjs/toolkit";

const generalSlice = createSlice({
  name: "general",
  initialState: {
    backdropVisible: false,
    confirmModal: {
      visible: false,
      data: {},
    },
  },
  reducers: {
    switchBackdropVisible(state, action) {
      return { ...state, backdropVisible: action.payload };
    },
    switchConfirmModal(state, action) {
      return {
        ...state,
        confirmModal: {
          ...state.confirmModal,
          ...action.payload,
        },
      };
    },
  },
});
export const { switchBackdropVisible, switchConfirmModal } =
  generalSlice.actions;

export default generalSlice.reducer;
