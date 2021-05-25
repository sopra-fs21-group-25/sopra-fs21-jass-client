import React, {Component, useRef, useState} from "react";
import AppRouter from "./components/shared/routers/AppRouter";
import {getWebsocketDomain} from "./helpers/getDomain";
import {StompSessionProvider} from "react-stomp-hooks";


export const UserListContext = React.createContext(null);

class App extends Component {
  render() {
    return (
      <div>
          <StompSessionProvider
              brokerURL={`${getWebsocketDomain()}/websocket`}
              debug={STOMP => console.log({STOMP})}
              onConnect={() => console.log({STOMP_CONNECT: 'TCP connection successfully established'})}
          >
            <ExtendedAppRouter/>
          </StompSessionProvider>
      </div>
    );
  }
}

export default App;

// We wrap the original AppRouter in a stateful component ExtendedAppRouter
// where the state holds the current chat data and profile picture data.
// The extended component then return the original component wrapped in
// a globally available context encoding the described state.
// We do this, in order to make the chat state accessible throughout the
// entire routing tree, i.e. we enable persisting chat state across all
// pages rendered in the routing tree. By doing so, we ensure that e.g.
// chat tabs that have been present on a preceding page stay being present
// on a subsequent page.
const ExtendedAppRouter = () => {
  const [chatData = [{
    chatPartnerId: String,
    chatPartnerUsername: String,
    messageData: [{
      senderId: String,
      senderUsername: String,
      timestamp: Date,
      text: String
    }]
  }], setChatData] = useState([]);
  const [profilePictureCollection, setProfilePictureCollection] = useState({});
  const [activeChatData, setActiveChatData] = useState(null);


  return (
      <UserListContext.Provider
          value={{
            chatData: chatData,
            profilePictureCollection: profilePictureCollection,
            setChatData: setChatData,
            setProfilePictureCollection: setProfilePictureCollection,
            activeChatData: activeChatData,
            setActiveChatData: setActiveChatData
          }}
      >
        <AppRouter/>
      </UserListContext.Provider>
  );
};