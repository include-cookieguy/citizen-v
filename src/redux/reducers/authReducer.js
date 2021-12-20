import { getToken, gGetUnit, getUser, GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  token: getToken,
  user: getUser,
  unit: gGetUnit,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return action.payload;
    case GLOBALTYPES.GET_UNIT:
      return { ...state, unit: action.payload }
    case GLOBALTYPES.AUTH_GET_USER:
      return { ...state, user: action.payload }
    default:
      return state;
  }
};

export default authReducer;
