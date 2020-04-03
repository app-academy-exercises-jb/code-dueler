import React from "react";
import SignUpForm from "../components/users/SignUpForm";
import NavBar from "../components/nav/NavBar";

export default () => {
  return (
    <div className="main">
      <NavBar />
      <div className="signup-page">
        <SignUpForm />
      </div>
    </div>
  );
};
