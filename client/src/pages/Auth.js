import React from "react";
import LogInForm from "../components/users/LogInForm";
import SignUpForm from "../components/users/SignUpForm";
import NavBar from "../components/nav/NavBar";

export default ({action}) => {
  let Form;

  if (action === "login") {
    Form = LogInForm;
  } else if (action === "signup") {
    Form = SignUpForm;
  }

  return (
    <div className="global">
      <NavBar />
      <div className="main">
        <div className="signup-page">
          <Form />
        </div>
      </div>
      <footer></footer>
    </div>
  );
};
