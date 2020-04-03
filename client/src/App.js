import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalLobby from "./pages/GlobalLobby";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import Test from "./pages/Test";
import "./stylesheets/application.scss";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Test} />
        <AuthRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute exact path="/login" component={Login} />
        <ProtectedRoute exact path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
