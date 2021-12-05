import { GLOBALTYPES } from "./globalTypes";
import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../utils/fetchData";

export const getAllUnit = () => async (dispatch) => {
  let message = null
  let type = null
  try {
    let res = await getDataAPI("/unit");
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
    type = 'success'
    message = res.data.msg || res.data.message || 'success'
  } catch (err) {
    type = 'error'
    message = err.response.msg || err.response.message
  } finally {
    
  }
};

export const getChildUnit = () => async (dispatch) => {
  let type = null
  let message = null
  try {
    let res = await getDataAPI("/unit/child");
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
    type = 'success'
    message = res.data.msg || res.data.message || 'Success'
  } catch (err) {
    type = 'error'
    message = err.response.msg || err.response.message
  } finally {
    
  }
};

export const createUnit = (data) => async (dispatch) => {
  let type = null
  let message = null
  try {
    let res = await postDataAPI("/unit", data);
    dispatch({ type: GLOBALTYPES.CREATE_UNIT, payload: res.data });
    type = 'success'
    message = res.data.msg || res.data.message || 'Success'
  } catch (err) {
    type = 'error'
    message = err.response.msg || err.response.message
  } finally {
    dispatch({ 
      type: GLOBALTYPES.SHOW_MESSAGE, 
      payload: { isShow: true, type, message } 
    })
    setTimeout(() => {
      dispatch({ 
        type: GLOBALTYPES.SHOW_MESSAGE, 
        payload: { isShow: false, type: null, message: null } 
      })
    }, 4000);
  }
};

export const updateUnit = (data) => async (dispatch) => {
  let type = null
  let message = null
  try {
    let res = await putDataAPI(`/unit/${data._id}`, data);
    dispatch({ type: GLOBALTYPES.UPDATE_UNIT, payload: res.data });
    type = 'success'
    message = res.data.msg || res.data.message || 'Success'
  } catch (err) {
    type = 'error'
    message = err.response.msg || err.response.message
  } finally {
    dispatch({ 
      type: GLOBALTYPES.SHOW_MESSAGE, 
      payload: { isShow: true, type, message } 
    })
    setTimeout(() => {
      dispatch({ 
        type: GLOBALTYPES.SHOW_MESSAGE, 
        payload: { isShow: false, type: null, message: null } 
      })
    }, 4000);
  }
};

export const deleteUnit =
  ({ _id }) =>
  async (dispatch) => {
    let type = null
    let message = null
    try {
      await deleteDataAPI(`/unit/${_id}`);
      let res = await getDataAPI("/unit/child");
      dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: res.data });
      type = 'success'
      message = res.data.msg || res.data.message || 'Success'
    } catch (err) {
      type = 'error'
      message = err.response.msg || err.response.message
    } finally {
      dispatch({ 
        type: GLOBALTYPES.SHOW_MESSAGE, 
        payload: { isShow: true, type, message } 
      })
      setTimeout(() => {
        dispatch({ 
          type: GLOBALTYPES.SHOW_MESSAGE, 
          payload: { isShow: false, type: null, message: null } 
        })
      }, 4000);
    }
  };
