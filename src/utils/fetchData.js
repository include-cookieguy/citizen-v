import axios from "axios";
import { refreshToken } from "../redux/actions/authAction";

const baseURL = "https://citizen-v-api-v1.herokuapp.com";

const axiosAuth = axios.create({
  baseURL: baseURL,
});

axiosAuth.interceptors.request.use(
  function (req) {
    const token = localStorage.getItem("token");
    Object.assign(req.headers, { Authorization: token });
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  function (res) {
    return res;
  },
  async function (error) {
    if (error.response.status === 401) {
      await refreshToken();
      error.config.headers["Authorization"] = localStorage.getItem("token");
      return axios.request(error.config);
    } else if (error.response.status === 402) {
      localStorage.removeItem("token");
      localStorage.removeItem("firstLogin");
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);

export const getDataAPI = async (url) => {
  const res = await axiosAuth.get(`/api/${url}`);
  return res;
};

export const postDataAPI = async (url, post) => {
  const res = await axiosAuth.post(`/api/${url}`, post);
  return res;
};

export const putDataAPI = async (url, post) => {
  const res = await axiosAuth.put(`/api/${url}`, post);
  return res;
};

export const patchDataAPI = async (url, post) => {
  const res = await axiosAuth.patch(`/api/${url}`, post);
  return res;
};

export const deleteDataAPI = async (url) => {
  const res = await axiosAuth.delete(`/api/${url}`);
  return res;
};
