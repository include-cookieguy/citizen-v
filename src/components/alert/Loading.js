import React from "react";
import LoadIcon from "./logo-spinner.gif";

const Loading = () => {
  return (
    <div className="loading">
      <img src={LoadIcon} alt="loading" />
      <span>Loading...</span>
    </div>
  );
};

export default Loading;
