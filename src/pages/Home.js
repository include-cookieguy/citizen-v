import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import SearchCitizen from "./SearchCitizen";
import ListCitizen from "./ListCitizen";
import { useSelector } from "react-redux";

const Home = () => {
  const { auth } = useSelector((state) => state);

  return (
    <div className="home-container">
      <div className="home-title">
        <div className="department">{localStorage["department"]}</div>
        <div className="official">{localStorage["official"]}</div>
        <div className="start">* * * * * * *</div>
      </div>

      {auth.user.regency !== "B2" && (
        <div>
          <ListCitizen />
        </div>
      )}

      <div>
        <SearchCitizen />
      </div>
    </div>
  );
};

export default Home;
