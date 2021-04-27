import React, { Component } from "react";
import Header from "./views/Header";
import AppRouter from "./components/shared/routers/AppRouter";
import {StompSessionProvider} from "react-stomp-hooks";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 */
class App extends Component {
  render() {
    return (
      <div>
        <StompSessionProvider
            brokerURL={'ws://localhost:8080/websocket'}
            debug={STOMP => console.log({STOMP})}
            onConnect={() => console.log({STOMP_CONNECT: 'TCP connection successfully established'})}
        >
          <AppRouter />
        </StompSessionProvider>
      </div>
    );
  }
}

export default App;
