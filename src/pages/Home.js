import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";

const Home = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="home">
      HOME
      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
};

export default Home;
