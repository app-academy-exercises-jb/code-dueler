import React from "react";
import LogInForm from "../components/users/LogInForm";
import NavBar from "../components/nav/NavBar";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <div className="signup-page">
        <LogInForm />
      </div>
    </div>
  );
};
