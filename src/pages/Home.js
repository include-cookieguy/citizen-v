import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import StatisticInput from "../components/statistic/StatisticInput";
import { getUnit } from "../redux/actions/unitAction";

const Home = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getUnit(user));
  }, []);

  return (
    <div className="home-container">
      <StatisticInput />
    </div>
  );
};

export default Home;
