import { getDataAPI, postDataAPI, putDataAPI } from "../../utils/fetchData";
import { GLOBALTYPES } from "./globalTypes";

export const getChildUser = () => async (dispatch) => {
  try {
    let res = await getDataAPI(`/user/child`);
    dispatch({ type: GLOBALTYPES.GET_CHILD_USER, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const getSearchInit = (auth) => async (dispatch) => {
  try {
    const {
      regency,
      nameOfUnit,
      nameOfParentUnit,
      nameOfGrandUnit,
      nameOfGreatGrandUnit,
    } = auth.user;

    const searchLocation = {
      city: "",
      district: "",
      ward: "",
    };

    const disabledLocation = {
      city: false,
      district: false,
      ward: false,
    };

    if (regency === "A2") {
      disabledLocation.city = true;
      searchLocation.city = nameOfUnit;
    } else if (regency === "A3") {
      disabledLocation.city = true;
      disabledLocation.district = true;
      searchLocation.city = nameOfParentUnit;
      searchLocation.district = nameOfUnit;
    } else if (["B1", "B2"].includes(regency)) {
      disabledLocation.city = true;
      disabledLocation.district = true;
      disabledLocation.ward = true;
      searchLocation.city = nameOfGrandUnit;
      searchLocation.district = nameOfParentUnit;
      searchLocation.ward = nameOfUnit;
    }

    dispatch({ type: GLOBALTYPES.GET_SEARCH_INIT, payload: searchLocation });
    dispatch({
      type: GLOBALTYPES.GET_DISABLED_INIT,
      payload: disabledLocation,
    });
  } catch (err) {
    console.log(err);
  }
};

export const createUser = (data) => async (dispatch) => {
  let type = null;
  let message = null;
  try {
    let res = await postDataAPI("/user", data);
    dispatch({ type: GLOBALTYPES.CREATE_USER, payload: res.data });
    type = "success";
    message = res.data.msg || res.data.message || "Success";
  } catch (err) {
    type = "error";
    message = err.response.msg || err.response.message;
  } finally {
    dispatch({
      type: GLOBALTYPES.SHOW_MESSAGE,
      payload: { isShow: true, type, message },
    });
    setTimeout(() => {
      dispatch({
        type: GLOBALTYPES.SHOW_MESSAGE,
        payload: { isShow: false, type: null, message: null },
      });
    }, 4000);
  }
};

export const updateUserById = (data) => async (dispatch) => {
  let type = null;
  let message = null;
  try {
    let res = await putDataAPI(`/user/${data._id}`, data);
    dispatch(getChildUser());
    type = "success";
    message = res.data.msg || res.data.message || "Success";
  } catch (err) {
    type = "error";
    message = err.response.msg || err.response.message;
  } finally {
    dispatch({
      type: GLOBALTYPES.SHOW_MESSAGE,
      payload: { isShow: true, type, message },
    });
    setTimeout(() => {
      dispatch({
        type: GLOBALTYPES.SHOW_MESSAGE,
        payload: { isShow: false, type: null, message: null },
      });
    }, 4000);
  }
};

export const getOptions = () => {
  return new Promise(async (next) => {
    try {
      let res = await getDataAPI("/user/options");
      next(res.data);
    } catch (err) {
      console.log(err);
    }
  });
};
