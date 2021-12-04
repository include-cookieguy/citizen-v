import { GLOBALTYPES } from "./globalTypes";
import { postDataAPI } from "../../utils/fetchData";

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
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

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
  return new Promise(async next => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      try {
        const res = await postDataAPI("refresh_token");
        localStorage.setItem('token', res.data.access_token)
        next()
      } catch (err) {
        console.log(err)
      }
    }
  })
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
