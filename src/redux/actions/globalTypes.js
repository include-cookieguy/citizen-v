export const GLOBALTYPES = {
  AUTH: "AUTH",
  ALERT: "ALERT",

  // Unit
  GET_ALL_UNIT: "GET_ALL_UNIT",
  CREATE_UNIT: "CREATE_UNIT",

  // Citizen
  GET_CITIZENS: "GET_CITIZENS",
  UPDATE_UNIT: "UPDATE_UNIT",

  // User
  GET_CHILD_USER: "GET_CHILD_USER",
  CREATE_USER: "CREATE_USER",
  UPDATE_USER_BY_ID: "UPDATE_USER_BY_ID",
  DELETE_USER_BY_ID: "DELETE_USER_BY_ID",

  // Show message
  SHOW_MESSAGE: "SHOW_MESSAGE",
};

export const getToken = localStorage.getItem("token");
