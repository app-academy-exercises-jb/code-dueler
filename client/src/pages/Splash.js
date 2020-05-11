import React from "react";
import SplashPage from "../components/splash/Splash";
import NavBar from "../components/nav/NavBar";

export default (props) => {
  return (
    <div className="global">
      <NavBar />
      <div className="main">
        <SplashPage />
      </div>
      <footer></footer>
    </div>
  );
};
