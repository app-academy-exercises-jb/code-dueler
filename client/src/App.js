import React from "react";
import { 
  BrowserRouter,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Auth from "./pages/Auth";
import GlobalLobby from "./pages/GlobalLobby";
import GameFilter from "./components/game/GameFilter";
import ProtectedRoute from "./components/util/ProtectedRoute";
import AuthRoute from "./components/util/AuthRoute";
import "./stylesheets/application.scss";
import Splash from "./pages/Splash";
import Credits from "./pages/Credits";

export default () => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute exact path="/" component={GlobalLobby} />
        <ProtectedRoute path="/game/:id" component={GameFilter} />
        <AuthRoute path="/welcome" component={Splash} />
        <AuthRoute path="/login" render={() => <Auth action="login" />} />
        <AuthRoute path="/signup" render={() => <Auth action="signup" />} />
        <Route path="/credits" component={Credits} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
};
