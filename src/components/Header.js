import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";
import { Link } from "react-router-dom";
import homeIcon from '../assets/home.png';

const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <header>
        <div className='header-container'>
          <div className='header-container-content'>
            <div className='title-nav'>
              <div className='title-logo'>
                <Link to='/' className='header-link'>
                  <div className="logo">
                    <img
                      src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
                      alt="Logo"
                    />
                  </div>
                  <div className='title'>CITIZEN V</div>
                </Link>
              </div>
              <div className='nav-bar'>
                <div className='nav-bar-option'>
                  <div className='opt-nav-bar'>
                    <Link to='/' className='header-link'>Trang chủ</Link>
                  </div>
                  <div className='opt-nav-bar'>
                    <Link to='/newUnit' className='header-link'>Đơn vị</Link>
                  </div>
                  <div className='opt-nav-bar'>Option</div>
                  <div className='opt-nav-bar'>Option</div>
                </div>

              </div>
            </div>

            <div className='logout'>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>

          </div>
        </div>
      </header>

      <div className='bottom'>
        <div className='nav-bar-bottom'>
          <div className='nav-bar-bottom-container'>
            <div className='nav-bar-option'>
              <div className='opt-nav-bar home'>
                <Link to='/' className='header-link'>
                  <div className='icon'>
                    {/* <img src={homeIcon} /> */}
                  </div>
                  <div>Trang chủ</div>
                </Link>
              </div>
              <div className='opt-nav-bar'>
                <Link to='/newUnit' className='header-link'>Đơn vị</Link>
              </div>
              <div className='opt-nav-bar'>Option</div>
              <div className='opt-nav-bar'>Option</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
