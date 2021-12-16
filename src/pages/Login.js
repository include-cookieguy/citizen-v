import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/actions/authAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const dispatch = useDispatch();
  const naviagate = useNavigate();
  const initState = {
    username: "",
    password: "",
  };
  const [loginInfo, setLoginInfo] = useState(initState);
  const [showPassword, setShowPassword] = useState(false);
  const [errBlur, setErrBlur] = useState({
    username: "",
    password: "",
  });
  const { auth, alert } = useSelector((state) => state);

  useEffect(() => {
    if (auth.token) {
      naviagate("/", { replace: true });
    }
  }, [naviagate, auth]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;
    if (!username && !password) {
      setErrBlur({
        ...errBlur,
        username: "Vui lòng nhập mã đơn vị phù hợp.",
        password:
          "Mật khẩu của đơn vị phải có độ dài tối thiểu từ 8 đến tối đa 60 ký tự.",
      });
    } else if (!username) {
      setErrBlur({
        ...errBlur,
        username: "Vui lòng nhập mã đơn vị phù hợp.",
      });
    } else if (!password) {
      setErrBlur({
        ...errBlur,
        password:
          "Mật khẩu của đơn vị phải có độ dài tối thiểu từ 8 đến tối đa 60 ký tự.",
      });
    } else {
      dispatch(login(loginInfo));
    }
  };

  const handleBlur = (type) => {
    const { username, password } = loginInfo;
    if (type === "username" && username) {
      if (username.length === 0) {
        setErrBlur({
          ...errBlur,
          email: "Vui lòng nhập mã đơn vị.",
        });
      }
    }
    if (type === "password" && password) {
      if (password.length < 8 || password.length > 60) {
        setErrBlur({
          ...errBlur,
          password:
            "Mật khẩu của đơn vị phải có độ dài tối thiểu từ 8 đến tối đa 60 ký tự.",
        });
      }
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Đăng nhập đơn vị</h1>
        <img
          src="https://res.cloudinary.com/dyywecvyl/image/upload/v1637918137/samples/people-shape-logo-design_1025-884-removebg-preview_yostcz.png"
          alt="Logo"
        />
        <div className="input-login">
          <label htmlFor="code-unit">Mã đơn vị</label>
          <input
            type="text"
            value={loginInfo.username}
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, username: e.target.value })
            }
            onBlur={() => handleBlur("username")}
            onInput={() => setErrBlur({ username: "" })}
            placeholder="Nhập mã đơn vị"
            id="code-unit"
          />
        </div>
        <small className="error">{errBlur.username}</small>
        <div className="input-login">
          <label htmlFor="password">Mật khẩu của đơn vị</label>
          <input
            type={showPassword ? "text" : "password"}
            value={loginInfo.password}
            onBlur={() => handleBlur("password")}
            onInput={() => setErrBlur({ password: "" })}
            onChange={(e) =>
              setLoginInfo({ ...loginInfo, password: e.target.value })
            }
            placeholder="Nhập mật khẩu"
            id="password"
          />
          {loginInfo.password && (
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="show-pass"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon icon={faEye} />
              )}
            </span>
          )}
        </div>
        <small className="error">{errBlur.password}</small>

        {alert.error && <div className="error-submit">{alert.error}</div>}
        <button>Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
