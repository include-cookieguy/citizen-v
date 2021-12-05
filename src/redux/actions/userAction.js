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
  try {
    let res = await postDataAPI("/user", data);
    dispatch({ type: GLOBALTYPES.CREATE_USER, payload: res.data });
  } catch (err) {
    console.log(err);
  }
};

export const updateUserById = (data) => async (dispatch) => {
  try {
    await putDataAPI(`/user/${data._id}`, data);
    dispatch(getChildUser());
  } catch (err) {
    console.log(err);
  }
};
