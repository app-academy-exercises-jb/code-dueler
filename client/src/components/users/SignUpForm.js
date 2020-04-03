import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { SIGNUP_USER } from "../../graphql/mutations";
import { IS_LOGGED_IN, CURRENT_USER } from "../../graphql/queries";
import { Link } from "react-router-dom";

export default () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [signup, { loading, error }] = useMutation(SIGNUP_USER, {
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
      {/* <input type="submit" value="Sign Up" disabled={loading} /> */}
      <button className="session-button" disabled={loading}>
        Sign Up
      </button>
      <Link to="/login" className="logo-nav">
        Already have an account? Sign in
      </Link>
    </form>
  );
};
