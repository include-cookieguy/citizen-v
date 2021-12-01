import { GLOBALTYPES } from "./globalTypes";
import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../utils/fetchData";

export const getAllUnit = () => async (dispatch) => {
  try {
    let res = await getDataAPI("/unit");
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const getChildUnit = () => async (dispatch) => {
  try {
    let res = await getDataAPI("/unit/child");
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const createUnit = (data) => async (dispatch) => {
  try {
    let res = await postDataAPI("/unit", data);
    dispatch({ type: GLOBALTYPES.CREATE_UNIT, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const updateUnit = (data) => async (dispatch) => {
  try {
    let res = await putDataAPI(`/unit/${data._id}`, data);
    dispatch({ type: GLOBALTYPES.UPDATE_UNIT, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const deleteUnit =
  ({ _id }) =>
  async (dispatch) => {
    try {
      await deleteDataAPI(`/unit/${_id}`);
      let res = await getDataAPI("/unit");
      dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
    } catch (err) {
      console.log(err);
    }
  };
