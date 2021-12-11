import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import { useSelector } from "react-redux";
import Monitor from "../components/Monitor";

const Home = () => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="home-container">
      <Monitor />
    </div>
  );
};

export default Home;
