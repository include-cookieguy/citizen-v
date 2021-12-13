import axios from "axios";
import { refreshToken } from '../redux/actions/authAction'

axios.interceptors.request.use(function (req) {
  const token = localStorage.getItem('token')
  Object.assign(req.headers, { 'Authorization': token })
  return req;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (res) {
  return res;
}, async function (error) {
  if (error.response.status === 401) {
    await refreshToken()
    error.config.headers['Authorization'] = localStorage.getItem('token')
    return axios.request(error.config)
  } else if (error.response.status === 402) {
    localStorage.removeItem('token')
    localStorage.removeItem('firstLogin')
    window.location.replace('/')
  }
  return Promise.reject(error);
});

export const getDataAPI = async (url) => {
  const res = await axios.get(`/api/${url}`);
  return res;
};

export const postDataAPI = async (url, post) => {
  const res = await axios.post(`/api/${url}`, post);
  return res;
};

export const putDataAPI = async (url, post) => {
  const res = await axios.put(`/api/${url}`, post);
  return res;
};

export const patchDataAPI = async (url, post) => {
  const res = await axios.patch(`/api/${url}`, post);
  return res;
};

export const deleteDataAPI = async (url) => {
  const res = await axios.delete(`/api/${url}`);
  return res;
};
