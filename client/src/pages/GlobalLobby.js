import React from "react";
import NavBar from "../components/nav/NavBar.js";
import GlobalMain from "../components/global/global.js";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <GlobalMain />
    </div>
  );
};
