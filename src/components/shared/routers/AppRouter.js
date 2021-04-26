import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import { MenuGuard } from '../routeProtectors/MenuGuard';
import Menu from '../../application/Menu';
import CreationPage from "../../application/CreationPage";
import LobbyPage from "../../application/LobbyPage";
import Register from "../../register/Register";
import JoinPage from "../../application/JoinPage";
import Game from '../../game/Game';

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
            <Route path="/" exact render={() => <Redirect to={"/login"} />} />
            <Route
              path="/menu"
              render={() => (
                <MenuGuard>
                  <Menu />
                </MenuGuard>
              )}
            />
            <Route
              path="/create"
              exact
              render={() => (
                  <CreationPage />
              )}
            />
            <Route
              path="/join"
              exact
              render={() => (
                  <JoinPage />
              )}
            />
            <Route
              path="/lobby/:id"
              exact
              render={() => (
                  <LobbyPage />
              )}
            />
            <Route
              path="/login"
              exact
              render={() => (
                  <Login />
                // <LoginGuard>
                //   <Login />
                // </LoginGuard>
              )}
            />
            <Route
                path="/register"
                exact
                render={() => (
                    <Register />
                )}
            />
            <Route
                path="/game"
                exact
                render={() => (
                    <Game />
                )}
            />
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default AppRouter;
