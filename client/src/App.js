import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import GlobalLobby from "./pages/GlobalLobby";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import "./stylesheets/application.scss";
import CodeEditor from "./components/codeEditor/CodeEditor";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={CodeEditor} />
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/signup" component={SignUp} />
        <Route path="/" component={ErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};
