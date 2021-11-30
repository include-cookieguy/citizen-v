import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  allUser: [],
};

const unitReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_CHILD_USER:
      return { ...state, allUser: action.payload };
    case GLOBALTYPES.CREATE_USER:
      let temp = state.allUser
      temp.push(action.payload)
      return { ...state, allUser: temp };
    default:
      return state;
  }
};

export default unitReducer;
