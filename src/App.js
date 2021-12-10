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
import { refreshToken } from "./redux/actions/authAction";
import { getSearchInit, getVillages } from "./redux/actions/userAction";
import SearchCitizen from "./pages/SearchCitizen";
import ListCitizen from "./pages/ListCitizen";

function App() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  // useEffect(() => {
  //    refreshToken();
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getSearchInit(auth));
  }, [dispatch, auth]);

  return (
    <Router>
      <Alert />
      {auth.token && <Header />}
      <Routes>
        <Route exact path="/" element={auth.token ? <Home /> : <Login />} />
        {auth.token && (
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
      </Routes>
    </Router>
  );
}

export default App;
