import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  allUnit: []
};

const unitReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_ALL_UNIT:
      return { ...state, allUnit: action.payload };
    case GLOBALTYPES.CREATE_UNIT:
      let temp = state.allUnit
      temp.push(action.payload)
      console.log(temp)
      return { ...state, allUnit: temp };
    default:
      return state;
  }
};

export default unitReducer;
