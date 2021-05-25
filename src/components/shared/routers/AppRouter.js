import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Login from "../../login/Login";
import { MenuGuard } from '../routeProtectors/MenuGuard';
import CreationPage from "../../application/CreationPage";
import Register from "../../register/Register";
import JoinPage from "../../application/JoinPage";
import GamePlus from "../../game/GamePlus";
import {ProfilePageGuard} from "../routeProtectors/ProfilePageGuard";
import ProfilePage from "../../profile/ProfilePage";
import Menu from "../../application/Menu";
import LobbyPage from "../../application/LobbyPage";


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
                      <Menu/>
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
                path="/profile"
                exact
                render={() => (
                    <ProfilePageGuard>
                      <ProfilePage />
                    </ProfilePageGuard>
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
                path="/game/:id"
                exact
                render={props => (
                    <GamePlus initialGameState={{...props.location.state}}/>
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
