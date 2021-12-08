import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import SearchCitizen from "./SearchCitizen";
import ListCitizen from "./ListCitizen";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-title">
        <div className="department">{localStorage["department"]}</div>
        <div className="official">{localStorage["official"]}</div>
        <div className="start">* * * * * * *</div>
      </div>

      <div>
        <ListCitizen />
      </div>
    </div>
  );
};

export default Home;
