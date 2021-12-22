import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { GLOBALTYPES } from "./redux/actions/globalTypes";
import { getUser } from "./redux/actions/authAction";

const SocketClient = () => {
  const { auth, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io("http://localhost:3000");
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });

    socket.on("connect", () => {
      console.log("Socket connected: ", socket.id);
    });

    socket.emit("joinUser", {
      id: auth.user._id,
      regencyOn: auth.user.regency,
      location: user.searchLocation,
    });

    socket.on("getCountCitizen", (check) => {
      if (check) dispatch({ type: GLOBALTYPES.TOTAL_CITIZENS, payload: 1 });
    });

    socket.on("newNotification", (idUser) => {
      console.log("Socket received, idUser: ", idUser);
      dispatch(getUser());
    });

    return () => socket.close();
  }, [auth.user, dispatch, user]);
  return <div></div>;
};

export default SocketClient;
