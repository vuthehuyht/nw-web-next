import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  currentUser: {},
  authenticateVisible: false,
  profileDialogVisible: false,
  invitationDialogVisible: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      return { ...state, isLoading: false, currentUser: action.payload };
    },
    getCurrentUserRequest(state) {
      return { ...state, isLoading: true };
    },
    getCurrentUserSuccess(state, action) {
      return { ...state, currentUser: action.payload };
    },
    switchAuthentcateDialog(state, action) {
      return { ...state, authenticateVisible: action.payload };
    },
    switchProfileDialog(state, action) {
      return { ...state, profileDialogVisible: action.payload };
    },
    logOut() {
      return initialState;
    },
    setLoadingUser(state, action) {
      return { ...state, isLoading: action.payload };
    },
    // Because in the currentUser also has couponlist,
    // so using couponlist with currentUser will have a better UX when open the coupon modal
    setCouponList(state, action) {
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      };
    },
  },
});

export const {
  loginSuccess,
  getCurrentUserRequest,
  getCurrentUserSuccess,
  switchAuthentcateDialog,
  switchProfileDialog,
  logOut,
  setLoadingUser,
  setCouponList,
} = authSlice.actions;

export default authSlice.reducer;
