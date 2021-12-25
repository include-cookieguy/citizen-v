import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  searchCitizensList: [],
};

const citizenReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.GET_CITIZENS:
      return {
        ...state,
        searchCitizensList: action.payload,
      };
    case GLOBALTYPES.ADD_CITIZEN:
      return {
        ...state,
        searchCitizensList: [...state.searchCitizensList, action.payload],
      };
    case GLOBALTYPES.EDIT_CITIZEN:
      const editCitizens = state.searchCitizensList.map((e) =>
        e._id === action.payload._id ? action.payload : e
      );
      return {
        ...state,
        searchCitizensList: editCitizens,
      };
    case GLOBALTYPES.REMOVE_CITIZEN:
      return {
        ...state,
        searchCitizensList: state.searchCitizensList.filter(
          (e) => e._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export default citizenReducer;
