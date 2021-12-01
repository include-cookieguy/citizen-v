import { GLOBALTYPES } from "./globalTypes";

export const getAllUnit = () => async (dispatch) => {
  try {
    console.log("get all unit");
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: [] });
  } catch (err) {
    console.log(err);
  }
};

export const createUnit = () => async (dispatch) => {
  try {
    // TODO
    dispatch({ type: GLOBALTYPES.CREATE_UNIT, payload: {} });
  } catch (err) {
    console.log(err);
  }
};
