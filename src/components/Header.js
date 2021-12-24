import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/authAction";
import { Link, useLocation } from "react-router-dom";
import ShowMessage from "./ShowMessage";
import homeIcon from "../assets/home.png";
import locationIcon from "../assets/location.png";
import citizenIcon from "../assets/list-citizens.png";
import searchIcon from "../assets/search.png";
import investigateIcon from "../assets/investigate-icon.png";
import { updateCurrentUser } from "../redux/actions/userAction";
import { convertTime } from "../utils/convertTime";

const Header = () => {
  const dispatch = useDispatch();
  const [showNoti, setShowNoti] = useState(false);
  const [hover, setHover] = useState("notifications");
  const ref = useRef();

  const handleLogout = () => {
    dispatch(logout());
  };
  const user = useSelector((state) => state.auth.user);
  let notis = useSelector((state) => state.auth.user.notifications) || [];
  let newNotification =
    useSelector((state) => state.auth.user.newNotification) || 0;

  const handleNoti = () => {
    setShowNoti(!showNoti);
    if (showNoti === false) {
      dispatch(updateCurrentUser(user._id));
    }
  };

  const handleOnHover = () => setHover("notifications-outline");
  const handleOverHover = () => setHover("notifications");

  useEffect(() => {
    const clickOutSide = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      console.log("first");
      setShowNoti(false);
    };

    document.addEventListener("mousedown", clickOutSide);

    return () => {
      document.removeEventListener("mousedown", clickOutSide);
    };
  }, [showNoti]);

  const location = useLocation();

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
                  <div className={location.pathname === '/' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                    <Link to="/" className="header-link">
                      Trang chủ
                    </Link>
                  </div>
                  <div className={location.pathname === '/newUnit' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                    <Link to="/newUnit" className="header-link">
                      Đơn vị
                    </Link>
                  </div>
                  <div className={location.pathname === '/list' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                    <Link to="/list" className="header-link">
                      Danh sách
                    </Link>
                  </div>
                  <div className={location.pathname === '/search' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                    <Link to="/search" className="header-link">
                      Tìm kiếm
                    </Link>
                  </div>
                  <div className={location.pathname === '/monitor' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                    <Link to="/monitor" className="header-link">
                      Theo dõi
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="logout-notification">
              <button onClick={handleLogout}>Đăng xuất</button>

              <div className="notification" ref={ref}>
                <div
                  className="icon"
                  onClick={handleNoti}
                  onMouseEnter={handleOnHover}
                  onMouseLeave={handleOverHover}
                >
                  <ion-icon name={hover}></ion-icon>
                  {newNotification > 0 && (
                    <span className="newNotification">{newNotification}</span>
                  )}
                </div>

                {showNoti && (
                  <div className="body_notification">
                    <div className="title">Thông báo</div>
                    <div className="noti-container">
                      {notis.length > 0 ? (
                        notis.map((e) => (
                          <div className="noti-item">
                            <p>{e.value}</p>{" "}
                            <small>
                              {convertTime(
                                (new Date().getTime() - e.createdAt) / 1000
                              )}
                            </small>
                          </div>
                        ))
                      ) : (
                        <p className="no-noti">Không có thông báo nào mới</p>
                      )}
                    </div>
                  </div>
                )}
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
              <li className={location.pathname === '/' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                <Link to="/" className="header-link">
                  <div className="img">
                    <img src={homeIcon} alt="icon" />
                  </div>
                  <div className="text">Trang chủ</div>
                </Link>
              </li>

              <li className={location.pathname === '/newUnit' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                <Link to="/newUnit" className="header-link">
                  <div className="img">
                    <img src={locationIcon} alt="icon" />
                  </div>
                  <div className="text">Đơn vị</div>
                </Link>
              </li>

              <li className={location.pathname === '/list' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                <Link to="/list" className="header-link">
                  <div className="img">
                    <img src={citizenIcon} alt="icon" />
                  </div>
                  <div className="text">Danh sách</div>
                </Link>
              </li>

              <li className={location.pathname === '/search' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
                <Link to="/search" className="header-link">
                  <div className="img">
                    <img src={searchIcon} alt="icon" />
                  </div>
                  <div className="text">Tìm kiếm</div>
                </Link>
              </li>

              <li className={location.pathname === '/monitor' ? 'opt-nav-bar current-route' : 'opt-nav-bar'}>
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
