import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {
  isShow: false,
  type: null,
  message: null,
};

const showMessageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GLOBALTYPES.SHOW_MESSAGE:
      return action.payload;
    default:
      return state;
  }
};

export default showMessageReducer;
