import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {Spinner} from "../../views/design/Spinner";
import LobbyJassTable from "./assets/LobbyJassTable";
import {StompSessionProvider} from 'react-stomp-hooks';
import {getDomain} from "../../helpers/getDomain";
import {
  BackButton,
  JassTeppichWrapper,
  LobbyWrapper,
  ChatWrapper,
  PlayerWrapper,
  PlayerHeader,
  StartButton,
  SearchBar
} from "./assets/LobbyAssets";
import LobbyPlayerList from "./assets/LobbyPlayerList";




const LobbyPage = props => {
  const lobbyId = useLocation().state.id;
  const myId = JSON.parse(localStorage.getItem('user')).id;
  const history = useHistory();
  const [connected, setConnected] = useState(false);


  const backToMenu = async () => {
    localStorage.removeItem('topPlayer');
    localStorage.removeItem('bottomPlayer');
    localStorage.removeItem('leftPlayer');
    localStorage.removeItem('rightPlayer');

    const userIdRemoveRequest = JSON.stringify({userId: myId, remove: true, add: false})
    const response = await api.put(`/lobbies/${lobbyId}`, userIdRemoveRequest);
    console.log({data: response.data});
    history.push('/menu');
  }

  return (
      <StompSessionProvider
        brokerURL={'ws://localhost:8080/websocket'}
        debug={STOMP => console.log({STOMP})}
        onConnect={() => setConnected(true)}
      >
        <BackgroundContainer>
          <LobbyWrapper>

            <SearchBar
                placeholder={'Search users...'}
                id="lobbySearch"
            />

            <PlayerWrapper>
              <PlayerHeader>
                Game Lobby
              </PlayerHeader>
              {connected ? <LobbyPlayerList lobbyId={lobbyId}/> : <Spinner/>}

            </PlayerWrapper>

            <JassTeppichWrapper>

              <LobbyJassTable lobbyId={lobbyId}/>

            </JassTeppichWrapper>

            <ChatWrapper/>

            <BackButton onClick={() => backToMenu()}>
              Back to Mainmenu
            </BackButton>

            <StartButton>
              Start Game
            </StartButton>

          </LobbyWrapper>
        </BackgroundContainer>
      </StompSessionProvider>
  );
}


export default LobbyPage;