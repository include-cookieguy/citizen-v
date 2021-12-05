import React from "react";
import ChartCitizen from "../components/ChartCitizen";
import { Link } from "react-router-dom";
import SearchCitizen from "./SearchCitizen";
import ListCitizen from "./ListCitizen";

const Home = () => {
  return (
    <div className="home-container">
      <div>
        <ListCitizen />
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
