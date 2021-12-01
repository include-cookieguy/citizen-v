import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {};

const citizenReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_CITIZENS:
      return action.payload;
    default:
      return state;
  }
};

export default citizenReducer;
