import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  allUser: [],
  searchLocation: {
    city: "",
    district: "",
    ward: "",
  },
  disabledLocation: { city: false, district: false, ward: false },
};

const unitReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_CHILD_USER:
      return { ...state, allUser: action.payload };
    case GLOBALTYPES.GET_SEARCH_INIT:
      return { ...state, searchLocation: action.payload };
    case GLOBALTYPES.GET_DISABLED_INIT:
      return { ...state, disabledLocation: action.payload };
    case GLOBALTYPES.CREATE_USER:
      let temp = state.allUser;
      temp.push(action.payload);
      return { ...state, allUser: temp };
    default:
      return state;
  }
};

export default unitReducer;
