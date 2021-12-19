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
    message = err.response.data.msg || err.response.data.message
  } finally {
    
  }
};

export const getUnit = (data) => async (dispatch) => {
  let message = null
  let type = null
  try {
    const unit = await getDataAPI(`unit/code/${data.username}`)
    localStorage.setItem('unit', JSON.stringify(unit.data))
    dispatch({ type: GLOBALTYPES.GET_UNIT, payload: unit.data })
  } catch(err) {
    type = 'error'
    message = err.response.data.msg || err.response.data.message
  }
}

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
    message = err.response.data.msg || err.response.data.message || 'Error'
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
    message = res.data.msg || res.data.message || 'Cấp mã thành công!'
  } catch (err) {
    type = 'error'
    message = err.response.data.msg || err.response.data.message || 'Cấp mã thất bại. Đã xảy ra lỗi!'
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

export const updateUnitStatus = (socket, status, idUnit) => async (dispatch) => {
  let type = null
  let message = null
  try {
    let res = await putDataAPI(`unit/status/${idUnit}`, {status})
    let user = JSON.parse(localStorage.getItem('user'))
    const unit = await getDataAPI(`unit/code/${user.username}`)
    localStorage.setItem('unit', JSON.stringify(unit.data))

    //  pushNotification
    socket.emit('pushNotification', {
      _user: user,
      type: 'NOTI_TO_PARENT'
    })
  
    dispatch({ type: GLOBALTYPES.GET_UNIT, payload: unit.data })
    type = 'success'
    message = res.data.msg || res.data.message || 'Cấp mã thành công!'
  } catch(err) {
    type = 'error'
    message = err.response.data.msg || err.response.data.message || 'Error'
  }  finally {
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
}

export const updateUnit = (data) => async (dispatch) => {
  let type = null
  let message = null
  try {
    let res = await putDataAPI(`/unit/${data._id}`, data);
    let unit = await getDataAPI('/unit/child')
    let user = await getDataAPI('/user/child')
    dispatch({ type: GLOBALTYPES.GET_ALL_UNIT, payload: unit.data });
    dispatch({ type: GLOBALTYPES.GET_CHILD_USER, payload: user.data })
    type = 'success'
    message = res.data.msg || res.data.message || 'Success'
  } catch (err) {
    type = 'error'
    message = err.response.data.msg || err.response.data.message || 'Error'
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
      message = res.data.msg || res.data.message || 'Xóa thành công!'
    } catch (err) {
      type = 'error'
      message = err.response.data.msg || err.response.data.message || 'Xóa thất bại. Đã xảy ra lỗi!'
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
