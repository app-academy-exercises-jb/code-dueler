import React from "react";
import CreditsComponent from "../components/credits/Credits.js";
import NavBar from "../components/nav/NavBar";

export default () => {
  return (
    <div className="global">
      <NavBar noData inCredits />
      <div className="main">
        <CreditsComponent />
      </div>
      <footer></footer>
    </div>
  );
};
