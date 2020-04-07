import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalLobby from "./pages/GlobalLobby";
import PlayerScreen from "./pages/PlayerScreen";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import "./stylesheets/application.scss";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute exact path="/playerscreen" component={PlayerScreen} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
