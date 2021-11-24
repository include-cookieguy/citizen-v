import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authAction";

const Login = () => {
  const dispatch = useDispatch();
  const initState = {
    email: "",
    password: "",
  };
  const [loginInfo, setLoginInfo] = useState(initState);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginInfo));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={loginInfo.email}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, email: e.target.value })
          }
          placeholder="Nhập email"
        />
        <input
          type="password"
          value={loginInfo.password}
          onChange={(e) =>
            setLoginInfo({ ...loginInfo, password: e.target.value })
          }
          placeholder="Nhập mật khẩu"
        />
        <button>Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login;
