import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Monitor from "../components/Monitor";
import { getUnit } from "../redux/actions/unitAction";

const Home = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch()
  let user = useSelector(state => state.auth.user)
  useEffect(() => {
    console.log(user.username)
    dispatch(getUnit(user))
  }, [])
  return (
    <div className="home-container">
      <Monitor />
    </div>
  );
};

export default Home;
