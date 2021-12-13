import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { GLOBALTYPES } from "./redux/actions/globalTypes";

const SocketClient = () => {
  const { auth, user } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io();
    dispatch({ type: GLOBALTYPES.SOCKET, payload: socket });
    socket.emit("joinUser", {
      id: auth.user._id,
      regencyOn: auth.user.regency,
      location: user.searchLocation,
    });
    socket.on("getCountCitizen", (check) => {
      if (check) dispatch({ type: GLOBALTYPES.TOTAL_CITIZENS, payload: 1 });
    });
    return () => socket.close();
  }, [auth.user, dispatch, user]);
  return <div></div>;
};

export default SocketClient;
