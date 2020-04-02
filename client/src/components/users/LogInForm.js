import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { LOGIN_USER } from '../../graphql/mutations';
import { IS_LOGGED_IN, CURRENT_USER } from '../../graphql/queries';

export default () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [login, { loading, error }] = useMutation(
    LOGIN_USER,
    {
      variables: {
        username,
        password
      },
      update(cache, { data: { login } }) {
        if (!login) setErrorMessage('Invalid Credentials');
        else {
          cache.writeData({ data: { isLoggedIn: login.loggedIn, me: { _id: login._id, username: login.username, __typename: 'User' } }});
          localStorage.setItem('token', login.token);
        }
      },
      onError() {
        setErrorMessage('Something went wrong');
      }
    }
  );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      login();
    }}>
      {errorMessage}
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="submit" value="Log In" disabled={loading} />
    </form>
  );
};