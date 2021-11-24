import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Alert from "./components/alert/Alert";
import "./styles/global.scss";
import { useEffect } from "react";
import { refreshToken } from "./redux/actions/authAction";

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <Router>
      <Alert />
      <Routes>
        <Route exact path="/" element={auth.token ? <Home /> : <Login />} />
      </Routes>
    </Router>
  );
}

export default App;
