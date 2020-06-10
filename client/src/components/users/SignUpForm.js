import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNUP_USER } from "../../graphql/mutations";
import { IS_LOGGED_IN, CURRENT_USER } from "../../graphql/queries";
import { Link, useLocation } from "react-router-dom";
import faker from "faker/locale/en_BORK";
import { useEffect } from "react";

export default () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [signup, { loading }] = useMutation(SIGNUP_USER, {
    // Removed "error" from second arg. May need to add back
    // for improved error messages later
    variables: {
      username,
      password,
    },
    update(cache, { data: { signup } }) {
      if (!signup) setErrorMessage("Invalid Credentials");
      else {
        localStorage.setItem("token", signup.token);
      }
    },
    onError() {
      setErrorMessage("Something went wrong");
    },
    refetchQueries: [{ query: IS_LOGGED_IN }, { query: CURRENT_USER }],
  });

  const generateUser = () => {
    let usr = faker.internet.userName(null, "."),
      pwd = faker.internet.password(8, true);
    
    setUsername(usr);
    setPassword(pwd);
    // setPersonalMessage(`Your new password is: ${pwd}`);
  }
  
  let location = useLocation(),
    shouldUpdate = location.state && location.state.demoUser;

  useEffect(() => {
    if (shouldUpdate) {
      generateUser();
      setTimeout(() => {
        signup();
      }, 100);
    }
  }, [shouldUpdate]);

  return (
    <form
      className="session-form"
      onSubmit={(e) => {
        e.preventDefault();
        signup();
      }}
    >
      <div className="session-errors">{errorMessage}</div>
      <h1 className="session-header">Create an account</h1>
      <p className="session-sub-header">It's free!</p>
      <div className="input-wrapper">
        <div>
          <h2 className="session-label">Username</h2>
          <input
            autoFocus
            className="session-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <h2 className="session-label">Password</h2>
          <input
            className="session-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      <button className="session-button" disabled={loading}>
        Sign Up
      </button>
      <button 
        id="demo"
        className="session-button"
        disabled={loading}
        onClick={() => generateUser()}
      >
        Generate New User
      </button>
      <Link to="/login">
        Already have an account? Sign in
      </Link>
    </form>
  );
};
