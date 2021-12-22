import { GLOBALTYPES } from "./globalTypes";
import { getDataAPI, postDataAPI } from "../../utils/fetchData";

export const login = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    const res = await postDataAPI("login", data);
    setTimeout(() => {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });

      localStorage.setItem("firstLogin", true);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const regency = res.data.user.regency;
      const unit = res.data.user.nameOfUnit;
      switch (regency) {
        case "A1":
          localStorage.setItem("department", "BỘ Y TẾ");
          localStorage.setItem("official", "TỔNG CỤC DÂN SỐ");
          break;

        case "A2":
          localStorage.setItem("department", `Sở Y tế ${unit}`.toUpperCase());
          localStorage.setItem("official", "CHI CỤC DÂN SỐ");
          break;

        case "A3":
          localStorage.setItem(
            "department",
            `Phòng Y tế ${unit}`.toUpperCase()
          );
          localStorage.setItem("official", "");
          break;

        case "B1":
          localStorage.setItem("department", `Trạm Y tế ${unit}`.toUpperCase());
          localStorage.setItem("official", "");
          break;

        default:
          localStorage.setItem("department", `${unit}`.toUpperCase());
          localStorage.setItem("official", "");
      }

      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: res.data.msg,
        },
      });
    }, 1310);
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const refreshToken = () => {
  return new Promise(async (next) => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      try {
        const res = await postDataAPI("refresh_token");
        localStorage.setItem("token", res.data.access_token);
        next();
      } catch (err) {
        console.log(err);
      }
    }
  });
};

export const register = (data) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await postDataAPI("register", data);
    setTimeout(() => {
      dispatch({
        type: GLOBALTYPES.AUTH,
        payload: {
          token: res.data.access_token,
          user: res.data.user,
        },
      });

      localStorage.setItem("firstLogin", true);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: {
          success: res.data.msg,
        },
      });
    }, 1310);
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("unit");
    localStorage.removeItem("department");
    localStorage.removeItem("official");

    await postDataAPI("logout");
    window.location.href = "/";
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response.data.msg,
      },
    });
  }
};

export const getUser = () => async (dispatch) => {
  try {
    let user = await getDataAPI(`/user/current`);
    let tempNoti = user.data.notifications.reverse().slice(0, 15);
    user.data = {
      ...user.data,
      notifications: tempNoti,
    };
    localStorage.setItem("user", JSON.stringify(user.data));
    dispatch({ type: GLOBALTYPES.AUTH_GET_USER, payload: user.data });
  } catch (err) {
    console.log(err);
  }
};
