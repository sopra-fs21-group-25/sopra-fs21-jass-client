import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import LobbyJassTable from "./assets/LobbyJassTable";
import {useStompClient, useSubscription} from 'react-stomp-hooks';
import {
  BackButton,
  JassTeppichWrapper,
  LobbyWrapper,
  ChatWrapper,
  PlayerWrapper,
  PlayerHeader,
  StartButton,
  SearchBar, PlayerListWrapper
} from "./assets/LobbyAssets";
import LobbyPlayerList from "./assets/LobbyPlayerList";
import LobbySearchbar from "./assets/LobbySearchbar";



// leveraged to exclude the users that are currently in the lobby from the list of users one can invite
function excludeSublist(list, sublist) {
  const subset = new Set(sublist);
  return [...new Set(list.filter(el => !subset.has(el.username)))];
}

function parseUsers(top, bot, left, right) {
  return JSON.stringify({
    playerTop: top,
    playerBottom: bot,
    playerLeft: left,
    playerRight: right
  });
}

function composeGamePostJSON(lobby, player0id, player1id, player2id, player3id) {
  return JSON.stringify({
    ingameModes: lobby.ingameModes,
    pointsToWin: lobby.pointsToWin,
    startingCard: lobby.startingCard,
    weisAllowed: lobby.weis,
    crossWeisAllowed: lobby.crossWeis,
    weisAsk: lobby.weisAsk,
    player0id: player0id,
    player1id: player1id,
    player2id: player2id,
    player3id: player3id
  });
}




const LobbyPage = () => {
  const [lobbyUsers, setLobbyUsers] = useState(useLocation().state.usersInLobby);
  const [allUsers, setAllUsers] = useState([]);
  const [lobbyUsersFetchSwitch, setLobbyUsersFetchSwitch] = useState(false);
  const [allUsersFetchSwitch, setAllUsersFetchSwitch] = useState(false);
  const thisLobby = useLocation().state;
  const myId = JSON.parse(sessionStorage.getItem('user')).id;
  const myUsername = JSON.parse(sessionStorage.getItem('user')).username;
  const iAmCreator = useLocation().state.creatorUsername === myUsername;
  const history = useHistory();
  const stompClient = useStompClient();



  // function leveraged to handle proper state updates of all users in the lobby when a user leaves
  const backToMenu = async () => {
    try {
      if(iAmCreator) {
        // if creator leaves lobby then delete lobby in the database
        const response = await api.put(`/lobbies/${thisLobby.id}/close`);

        // notify other users in the lobby it has been shut down
        stompClient.publish({
          destination: `/app/lobbies/${thisLobby.id}/notifyShutdown`,
          body: null
        });
      } else {
        // if another user leaves lobby then remove user from the lobby in the database
        const userIdRemoveRequest = JSON.stringify({userId: myId, remove: true, add: false})
        const response = await api.put(`/lobbies/${thisLobby.id}`, userIdRemoveRequest);

        // construct message to inform other users about the seat that has eventually been freed up
        let message = '';
        const top = sessionStorage.getItem('topPlayer');
        const bottom = sessionStorage.getItem('bottomPlayer');
        const left = sessionStorage.getItem('leftPlayer');
        const right = sessionStorage.getItem('rightPlayer');

        // if I sit at a spot around the table, construct appropriate message for other users
        if(top === myUsername) {
          message = parseUsers('', bottom, left, right);
        } else if(bottom === myUsername) {
          message = parseUsers(top, '', left, right);
        } else if(left === myUsername) {
          message = parseUsers(top, bottom, '', right);
        } else if(right === myUsername) {
          message = parseUsers(top, bottom, left, '');
        }

        // if the message has been set (i.e. I am sitting at the table) then publish the table change to the other users
        if(message) {
          console.log({message});
          stompClient.publish({
            destination: `/app/lobbies/${thisLobby.id}/table`,
            body: message
          });
        }

        // also inform the other users to re-fetch the users in the lobby
        stompClient.publish({
          destination: `/app/lobbies/${thisLobby.id}/fetch`,
          body: 'leave'
        });
      }
    } catch(error) {
      alert("Something went wrong when trying to return to the menu")
    } finally {
      // finally remove the items from my sessionStorage and redirect back to the menu
      sessionStorage.removeItem('topPlayer');
      sessionStorage.removeItem('bottomPlayer');
      sessionStorage.removeItem('leftPlayer');
      sessionStorage.removeItem('rightPlayer');
      history.push('/menu');
    }
  }

  // used to clean up the lobby (i.e. remove from database, reset sessionStorage) on game launch
  const cleanUpLobby = async () => {
    try {
      if(iAmCreator) {
        // delete lobby in the database
        const response = await api.put(`/lobbies/${thisLobby.id}/close`);
      }
      sessionStorage.removeItem('topPlayer');
      sessionStorage.removeItem('bottomPlayer');
      sessionStorage.removeItem('leftPlayer');
      sessionStorage.removeItem('rightPlayer');

    } catch(error) {
      alert('could not clean up lobby, something went wrong...');
    }
  }

  // essentially this sends a POST to crete the game and then publishes via stomp, that participants must fetch the game now
  const createGame = async () => {
    try {
      const response = await api.get(`/lobbies/${thisLobby.id}/users`)
      const usersInLobby = response.data.usersInLobby;

      const player0id = usersInLobby.filter(u => u.username === sessionStorage.getItem('topPlayer'))[0].id;
      const player1id = usersInLobby.filter(u => u.username === sessionStorage.getItem('leftPlayer'))[0].id;
      const player2id = usersInLobby.filter(u => u.username === sessionStorage.getItem('bottomPlayer'))[0].id;
      const player3id = usersInLobby.filter(u => u.username === sessionStorage.getItem('rightPlayer'))[0].id;

      const postPayload = composeGamePostJSON(thisLobby, player0id, player1id, player2id, player3id);
      const gamePostResponse = await api.post('/games', postPayload);

      const gameId = gamePostResponse.data.id;

      stompClient.publish({
        destination: `/app/lobbies/${thisLobby.id}/initialSynchronization`,
        body: JSON.stringify({
          id: gameId,
          player0id: player0id,
          player1id: player1id,
          player2id: player2id,
          player3id: player3id})
      });

    } catch(error) {
      alert("Game could not be created...");
    }



    /*    const response = await api.get(`/lobbies/${thisLobby.id}`);
        history.push({
          pathname: `/game/${thisLobby.id}`,
          state: {...response.data}
        });*/
  }



  // on component mount (I have joined the lobby), inform the other users in the lobby to re-fetch the users in the lobby
  useEffect(() => {
    stompClient.publish({
      destination: `/app/lobbies/${thisLobby.id}/fetch`,
      body: 'join'
    });

    if(iAmCreator) {
      const interval = setInterval(() => {
        setAllUsersFetchSwitch(prev => !prev);
      }, 5000); // trigger refreshing all online users every 10 seconds

      return () => clearInterval(interval);
    }
  }, [])

  // does the actual re-fetching of all online users not present in this lobby
  useEffect(() => {
    // as the lobby creator I need to fetch a list of all online users in order to invite users
    if(iAmCreator) {
      const fetchAllUsers = async () => {
        try {
          const response = await api.get('/users/online');
          return response.data;
        } catch(error) {
          alert('Could not fetch any users to invite...');
        }
      }

      fetchAllUsers().then(fetchedUsers => {
        // update all available online users only if there has been an actual change
        setAllUsers(excludeSublist(fetchedUsers, lobbyUsers))
      });
    }
  }, [allUsersFetchSwitch])

  // does the actual re-fetching of the lobby users triggered by state update of fetchSwitch
  useEffect(() => {
    // upon fetch notification do fetching
    const fetchLobbyUsers = async () => {
      try {
        const response = await api.get(`/lobbies/${thisLobby.id}`);
        setLobbyUsers([...response.data.usersInLobby]);
        console.log({response: [...response.data.usersInLobby]})
        return response.data.usersInLobby;

      } catch (error) {
        alert('Could not fetch the necessary lobby data...');
        sessionStorage.removeItem('topPlayer');
        sessionStorage.removeItem('bottomPlayer');
        sessionStorage.removeItem('leftPlayer');
        sessionStorage.removeItem('rightPlayer');
        history.push('/menu');
      }
    }

    fetchLobbyUsers().then(newUsers => console.log({newUsers}));
  }, [lobbyUsersFetchSwitch]);



  // if I got kicked from the lobby...
  useSubscription(`/lobbies/${thisLobby.id}/kicked/${myUsername}`, async () => await backToMenu());

  // if shutdown notification received then clear sessionStorage items and redirect to menu
  useSubscription(`/lobbies/${thisLobby.id}/shutdown`, msg => {
    alert("It seems this lobby has been shut down...");
    sessionStorage.removeItem('topPlayer');
    sessionStorage.removeItem('bottomPlayer');
    sessionStorage.removeItem('leftPlayer');
    sessionStorage.removeItem('rightPlayer');
    history.push('/menu');
  });

  // if another player joins or leaves, get a notification to initialize re-fetching an table synchronisation
  useSubscription(`/lobbies/${thisLobby.id}/fetch`, msg => {
    // trigger the user fetching switch
    setLobbyUsersFetchSwitch(!lobbyUsersFetchSwitch);

    // additionally if I am the creator and a user has joined I need to inform him about the seats already taken
    if(iAmCreator && msg.body === 'join') {
      const top = sessionStorage.getItem('topPlayer');
      const bottom = sessionStorage.getItem('bottomPlayer');
      const left = sessionStorage.getItem('leftPlayer');
      const right = sessionStorage.getItem('rightPlayer');

      stompClient.publish({
        destination: `/app/lobbies/${thisLobby.id}/table`,
        body: parseUsers(top, bottom, left, right)
      });
    }
  });

  // leveraged for broadcasting the new game id upon game launch
  useSubscription(`/lobbies/${thisLobby.id}/gameInitialization`, async msg => {

    await cleanUpLobby();
    const data = JSON.parse(msg.body);

    const gameId = data.id;
    delete data.id;


    // check if I will participate in the game
    if(Object.values(data).includes(myId)) {

      // fetch the game that has been created with its initial state containing this user's cards
      try {

        const gameResponse = await api.get(`/games/${gameId}/${myId}`);
        const game = gameResponse.data;
        console.log({game});

        // TODO: uncomment when game component is implemented correctly
        /*history.push({
          path: `/game/${gameId}`,
          state: {...game}
        });*/


      } catch(error) {
        alert('Could not fetch the game about to launch')

      }
    } else {
      history.push('/menu');
    }
  });



  return (
      <BackgroundContainer>
        <LobbyWrapper>
          {iAmCreator ? (
              <LobbySearchbar
                users={allUsers}
                client={stompClient}
                lobbyId={thisLobby.id}
              />
          ) : null }
          <PlayerWrapper>
            <PlayerHeader>
              Game Lobby
            </PlayerHeader>
            <PlayerListWrapper>
              <LobbyPlayerList
                  users={lobbyUsers}
                  creator={thisLobby.creatorUsername}
                  permitted={iAmCreator}
                  lobbyId={thisLobby.id}
                  client={stompClient}
              />
            </PlayerListWrapper>
          </PlayerWrapper>
          <JassTeppichWrapper>
            <LobbyJassTable client={stompClient} lobbyId={thisLobby.id}/>
          </JassTeppichWrapper>
          <ChatWrapper/>
          <BackButton onClick={() => backToMenu()}>
            Back to Mainmenu
          </BackButton>
          {iAmCreator ? (
              <StartButton onClick={() => createGame()}>
                Start Game
              </StartButton>
          ) : null }
        </LobbyWrapper>
      </BackgroundContainer>
  );
}

export default LobbyPage;