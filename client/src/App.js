import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import Test from "./pages/Test";
import "./stylesheets/application.scss";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Test} />
        <ProtectedRoute exact path="/login" component={Login} />
        <ProtectedRoute exact path="/signup" component={Login} />
      </Switch>
    </BrowserRouter>
  );
};
