import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_USER } from "../../graphql/mutations";
// import { IS_LOGGED_IN, CURRENT_USER } from '../../graphql/queries';
import { Link } from "react-router-dom";

export default () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [login, { loading }] = useMutation(LOGIN_USER, {
    // Removed "error" from second arg. May need to add back
    // for improved error messages later
    variables: {
      username,
      password,
    },
    update(cache, { data: { login } }) {
      if (!login) setErrorMessage("Invalid Credentials");
      else {
        cache.writeData({
          data: {
            isLoggedIn: login.loggedIn,
            me: {
              _id: login._id,
              username: login.username,
              __typename: "User",
            },
          },
        });
        localStorage.setItem("token", login.token);
      }
    },
    onError() {
      setErrorMessage("Something went wrong");
    },
  });

  return (
    <form
      className="session-form"
      onSubmit={(e) => {
        e.preventDefault();
        login();
      }}
    >
      <div className="session-errors">{errorMessage}</div>
      <h1 className="session-header">Welcome back!</h1>
      <p className="session-sub-header">Please sign in</p>
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

      <button id="login" className="session-button" disabled={loading}>
        Log In
      </button>
      <button 
        id="demo"
        className="session-button"
        disabled={loading}
        onClick={() => {setUsername('scobyLover'); setPassword('asdfasdf')}}
      >
        Demo User
      </button>
      <Link to="/signup">
        Create an account
      </Link>
    </form>
  );
};
