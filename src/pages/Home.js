import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import StatisticInput from "../components/statistic/StatisticInput";
import { getUser } from "../redux/actions/authAction";
import { getUnit } from "../redux/actions/unitAction";
import InputCitizen from "./InputCitizen";

const Home = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);

  const regency = useSelector((state) => state.auth.user.regency);

  useEffect(() => {
    dispatch(getUnit(user));
    dispatch(getUser());
  }, []);

  return (
    <>
      {regency !== "B2" ? (
        <div className="home-container">
          {regency === "B1" && (
            <div className="btn-input">
              <Link to="/input-citizen">
                <button>Nhập thông tin công dân</button>
              </Link>
            </div>
          )}
          <StatisticInput />
        </div>
      ) : (
        <InputCitizen />
      )}
    </>
  );
};

export default Home;
