import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/authAction";

const Header = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    // <header>
    //   <div className="header-left">
    //     <div className="logo">
    //       <img
    //         src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
    //         alt="Logo"
    //       />
    //     </div>
    //     <h3>CITIZEN V</h3>
    //   </div>
    //   <nav className="header-right">
    //     <ul>
    //       <li>Trang chủ</li>
    //       <li>Trang chủ</li>
    //       <li>Trang chủ</li>
    //       <li>Trang chủ</li>
    //       <li>
    //         <button onClick={handleLogout}>Đăng xuất</button>
    //       </li>
    //       <li>VN | EN</li>
    //     </ul>
    //   </nav>
    // </header>
    <>
      <header>
        <div className='header-container'>
          <div className='header-container-content'>
            <div className='title-nav'>
              <div className='title-logo'>
                <div className="logo">
                  <img
                    src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
                    alt="Logo"
                  />
                </div>
                <div className='title'>CITIZEN V</div>
              </div>
              <div className='nav-bar'>
                <div className='nav-bar-option'>
                  <div className='opt-nav-bar'>Option</div>
                  <div className='opt-nav-bar'>Option</div>
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
              <div className='opt-nav-bar'>Option</div>
              <div className='opt-nav-bar'>Option</div>
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
