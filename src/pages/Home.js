import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import { useSelector } from "react-redux";
import Monitor from "../components/Monitor";
import Example from "../components/statistic/StatisticAge";

const Home = () => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="home-container">
      <Monitor />
      <Example />
    </div>
  );
};

export default Home;
