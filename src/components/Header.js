import React from "react";
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authAction";
import { Link } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import homeIcon from "../assets/home.png";
import locationIcon from "../assets/location.png";
import citizenIcon from "../assets/list-citizens.png";
import searchIcon from "../assets/search.png";
import investigateIcon from "../assets/investigate-icon.png";

const Header = () => {
  const dispatch = useDispatch();
  const [showNoti, setShowNoti] = useState(false);
  const [hover, setHover] = useState('notifications');

  const handleLogout = () => {
    dispatch(logout());
  };

  let notis = useSelector(state => state.auth.user.notifications) || []
  notis = notis.reverse()

  const handleNoti = () => {
    setShowNoti(!showNoti);
  }

  const handleOnHover = () => setHover('notifications-outline');
  const handleOverHover = () => setHover('notifications');

  return (
    <>
      <header>
        <div className="header-container">
          <div className="header-container-content">
            <div className="title-nav">
              <div className="title-logo">
                <Link to="/" className="header-link">
                  <div className="logo">
                    <img
                      src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637921432/samples/people-shape-logo-design_1025-884_mjisuq.jpg"
                      alt="Logo"
                    />
                  </div>
                  <div className="title">CITIZEN V</div>
                </Link>
              </div>
              <div className="nav-bar">
                <div className="nav-bar-option">
                  <div className="opt-nav-bar">
                    <Link to="/" className="header-link">
                      Trang chủ
                    </Link>
                  </div>
                  <div className="opt-nav-bar">
                    <Link to="/newUnit" className="header-link">
                      Đơn vị
                    </Link>
                  </div>
                  <div className="opt-nav-bar">
                    <Link to="/list" className="header-link">
                      Danh sách
                    </Link>
                  </div>
                  <div className="opt-nav-bar">
                    <Link to="/search" className="header-link">
                      Tìm kiếm
                    </Link>
                  </div>
                  <div className="opt-nav-bar">
                    <Link to="/monitor" className="header-link">
                      Theo dõi
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="logout-notification">
              <button onClick={handleLogout}>Đăng xuất</button>

              <div className="notification">
                <div
                  className="icon"
                  onClick={handleNoti}
                  onMouseEnter={handleOnHover}
                  onMouseLeave={handleOverHover}
                >
                  <ion-icon name={hover}></ion-icon>
                </div>

                {showNoti && <div className="body_notification">
                  <div className="title">Thông báo</div>
                  <ul>
                    <li>{notis[0] || ''}</li>
                    <li>{notis[1] || ''}</li>
                    <li>{notis[2] || ''}</li>
                    <li>{notis[3] || ''}</li>
                    <li>{notis[4] || ''}</li>
                  </ul>
                </div>}
              </div>

            </div>
          </div>
        </div>

        <ShowMessage />
      </header>

      <div className="title-all-page">
        <div className="home-title">
          <div className="department">{localStorage["department"]}</div>
          <div className="official">{localStorage["official"]}</div>
          <div className="start">* * * * * * *</div>
        </div>
      </div>

      <div className="bottom">
        <div className="nav-bar-bottom">
          <div className="nav-bar-bottom-container">
            <ul className="nav-bar-option">
              <li className="opt-nav-bar">
                <Link to="/" className="header-link">
                  <div className="img">
                    <img src={homeIcon} alt="icon" />
                  </div>
                  <div className="text">Trang chủ</div>
                </Link>
              </li>

              <li className="opt-nav-bar">
                <Link to="/newUnit" className="header-link">
                  <div className="img">
                    <img src={locationIcon} alt="icon" />
                  </div>
                  <div className="text">Đơn vị</div>
                </Link>
              </li>

              <li className="opt-nav-bar">
                <Link to="/list" className="header-link">
                  <div className="img">
                    <img src={citizenIcon} alt="icon" />
                  </div>
                  <div className="text">Danh sách</div>
                </Link>
              </li>

              <li className="opt-nav-bar">
                <Link to="/search" className="header-link">
                  <div className="img">
                    <img src={searchIcon} alt="icon" />
                  </div>
                  <div className="text">Tìm kiếm</div>
                </Link>
              </li>

              <li className="opt-nav-bar">
                <Link to="/monitor" className="header-link">
                  <div className="img">
                    <img src={investigateIcon} alt="icon" />
                  </div>
                  <div className="text">Theo dõi</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
