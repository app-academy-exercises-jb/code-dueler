import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/util/ProtectedRoute'
import AuthRoute from './components/util/AuthRoute'

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={ SignUp } />
        <AuthRoute exact path="/login" component={ Login} />
        <AuthRoute exact path="/signup" component={ Login} />
      </Switch>
    </BrowserRouter>
  );
};