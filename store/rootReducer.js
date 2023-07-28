import { combineReducers } from "redux";
import booking from "providers/BookingProvider/slice";
import auth from "providers/AuthProvider/slice";
import general from "providers/GeneralProvider/slice";
import resource from "providers/ResourceProvider/slice";
import card from "providers/CardProvider/slice";

export default combineReducers({
  auth,
  general,
  resource,
  card,
  booking,
});
