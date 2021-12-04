import { getDataAPI, postDataAPI, putDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"

export const getChildUser = () => async (dispatch) => {
  try {
    let res = await getDataAPI(`/user/child`)
    dispatch({ type: GLOBALTYPES.GET_CHILD_USER, payload: res.data })
  } catch(err) {
    console.log(err)
  }
}

export const createUser = (data) => async (dispatch) => {
  try {
    let res = await postDataAPI('/user', data)
    dispatch({ type: GLOBALTYPES.CREATE_USER, payload: res.data })
  } catch(err) {
    console.log(err)
  }
}

export const updateUserById = (data) => async (dispatch) => {
  try {
    await putDataAPI(`/user/${data._id}`, data)
    dispatch(getChildUser())
  } catch(err) {
    console.log(err)
  }
}

export const getOptions = () => {
  return new Promise(async next => {
    try {
    let res = await getDataAPI('/user/options')
      next(res.data)
    } catch(err) {
      console.log(err)
    }
  })
}