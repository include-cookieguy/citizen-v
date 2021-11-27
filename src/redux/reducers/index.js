import { combineReducers } from "redux";
import auth from "./authReducer";
import alert from "./alertReducer";
import unit from "./unitReducer"

export default combineReducers({ auth, alert, unit });
