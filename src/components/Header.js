import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";

const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header>
      <div className="header-left">
        <div className="logo">
          <img
            src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
            alt="Logo"
          />
        </div>
        <h3>CITIZEN V</h3>
      </div>
      <nav className="header-right">
        <ul>
          <li>Trang chủ</li>
          <li>Trang chủ</li>
          <li>Trang chủ</li>
          <li>Trang chủ</li>
          <li>
            <button onClick={handleLogout}>Đăng xuất</button>
          </li>
          <li>VN | EN</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
