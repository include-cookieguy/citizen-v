import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./styles/global.scss";
import { useEffect } from "react";
import NewUnit from "./pages/NewUnit";
import Header from "./components/Header";
import InputCitizen from "./pages/InputCitizen";
import Alert from "./components/alert/Alert";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { getSearchInit, getTotalCitizens } from "./redux/actions/userAction";
import SearchCitizen from "./pages/SearchCitizen";
import ListCitizen from "./pages/ListCitizen";
import SocketClient from "./SocketClient";
import Monitor from "./pages/Monitor";

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  // useEffect(() => {
  //    refreshToken();
  // }, [dispatch]);

  useEffect(() => {
    if (auth.token) {
      dispatch(getSearchInit(auth));
      dispatch(getTotalCitizens(auth.user.nameOfUnit));
    }
  }, [dispatch, auth]);

  return (
    <Router>
      <Alert />
      {auth.token && <Header />}
      {auth.token && <SocketClient />}
      <Routes>
        <Route exact path="/" element={auth.token ? <Home /> : <Login />} />
        {auth.token && ["B1", "B2"].includes(auth.user.regency) && (
          <Route exact path="/input-citizen" element={<InputCitizen />} />
        )}
        {auth.token && auth.user.regency !== "B2" && (
          <Route exact path="/newUnit" element={<NewUnit />} />
        )}
        {auth.token && auth.user.regency !== "B2" && (
          <Route exact path="/search" element={<SearchCitizen />} />
        )}
        {auth.token && auth.user.regency !== "B2" && (
          <Route exact path="/list" element={<ListCitizen />} />
        )}
        {auth.token && auth.user.regency !== "B2" && (
          <Route exact path="/monitor" element={<Monitor />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
