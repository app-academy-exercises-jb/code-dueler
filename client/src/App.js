import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalLobby from "./pages/GlobalLobby";
import GameFilter from "./components/game/GameFilter";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import Spectator from "./pages/Spectator";
import "./stylesheets/application.scss";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute path="/game/:id" component={GameFilter} />
        <AuthRoute path="/login" component={Login} />
        <AuthRoute path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
