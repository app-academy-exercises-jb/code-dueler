import React from "react";
import SplashComponent from "../components/splash/Splash";
import NavBar from "../components/nav/NavBar";

export default (props) => {
  return (
    <div className="global">
      <NavBar />
      <div className="main">
        <SplashComponent />
      </div>
      <footer></footer>
    </div>
  );
};
