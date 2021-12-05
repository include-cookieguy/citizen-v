import { getToken, getUser, GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  token: getToken,
  user: getUser,
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
