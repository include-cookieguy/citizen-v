import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import { Link } from "react-router-dom";
import SearchCitizen from "./SearchCitizen";

const Home = () => {
  return (
    <div className="home-container">
      <div>
        <SearchCitizen />
      </div>
      <div>
        <Link to="/input-citizen">
          <button>Nhập thông tin công dân</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
