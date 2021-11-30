import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";
import { Link } from "react-router-dom"

const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <header>
      <div className="header-left">
        <Link to='/' className='link' style={{ display: 'flex', alignItems: 'center' }}>
          <div className="logo">
            <img
              src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
              alt="Logo"
            />
          </div>
          <h3>CITIZEN V</h3>
        </Link>
      </div>
      <nav className="header-right">
        <ul>
          <li>Trang chủ</li>
          <li><Link to='/newUnit' className='link' >Đơn vị</Link></li>
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
