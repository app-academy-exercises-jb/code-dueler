import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
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
        {/* <Route exact path="/" component={Test} /> */}
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
        {/* <Redirect to="/" component={Test} /> */}
      </Switch>
    </BrowserRouter>
  );
};
