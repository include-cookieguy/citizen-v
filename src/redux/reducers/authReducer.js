import { getToken, GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  token: getToken,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.AUTH:
      return action.payload;
    default:
      return state;
  }
};

export default authReducer;
