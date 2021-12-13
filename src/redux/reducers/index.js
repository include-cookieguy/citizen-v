import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import unit from "./unitReducer";
import citizen from "./citizenReducer";
import user from "./userReducer";
import showMessage from "./showMessageReducer";
import socket from "./socketReducer";

export default combineReducers({
  auth,
  alert,
  unit,
  citizen,
  user,
  showMessage,
  socket,
});
