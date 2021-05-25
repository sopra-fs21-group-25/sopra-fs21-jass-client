import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {useStompClient, useSubscription} from 'react-stomp-hooks';
import {
  BackButton,
  JassTeppichWrapper,
  LobbyWrapper,
  ChatWrapper,
  PlayerWrapper,
  PlayerHeader,
  StartButton,
  PlayerListWrapper,
  LobbyJassTable,
  LobbyPlayerList,
  LobbySearchbar
} from "./lobbyAssets/LobbyAssets";
import {UserList} from "./applicationAssets/UserList";


const LobbyPage = () => {
  const [lobbyUsers, setLobbyUsers] = useState(useLocation().state.usersInLobby);
  const [allUsers, setAllUsers] = useState([]);
  const [lobbyFetchSwitch, setLobbyFetchSwitch] = useState(false);
  const [allUsersFetchSwitch, setAllUsersFetchSwitch] = useState(false);
  const thisLobby = useLocation().state;
  const [usersAtTable, setUsersAtTable] = useState([thisLobby.userTop, thisLobby.userLeft, thisLobby.userBottom, thisLobby.userRight]);
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
        await api.delete(`/lobbies/${thisLobby.id}/delete/cascade`);

        // notify other users in the lobby it has been shut down
        stompClient.publish({
          destination: `/app/lobbies/${thisLobby.id}/notifyShutdown`,
          body: null
        });
      } else {
        // if another user leaves lobby then remove user from the lobby in the database
        const userIdRemoveRequest = JSON.stringify({userId: myId, remove: true, add: false})
        await api.put(`/lobbies/${thisLobby.id}`, userIdRemoveRequest);

        // inform the other users to re-fetch the users in the lobby and at the table
        stompClient.publish({
          destination: `/app/lobbies/${thisLobby.id}/fetch`,
          body: 'leave'
        });
      }
    } catch(error) {
      alert("Something went wrong when trying to return to the menu")
    } finally {
      // finally redirect back to the menu
      history.push('/menu');
    }
  }

  // used to clean up the lobby (i.e. remove from database) on game launch
  const cleanUpLobby = async () => {
    try {
      if(iAmCreator) {
        // delete lobby in the database
        await api.delete(`/lobbies/${thisLobby.id}/delete/no-cascade`);
      }
    } catch(error) {
      alert('could not clean up lobby, something went wrong...');
    }
  }

  // essentially this sends a POST to crete the game and then publishes via stomp, that participants must fetch the game now
  const createGame = async () => {
    try {
      const player0id = usersAtTable[0].id;
      const player1id = usersAtTable[1].id;
      const player2id = usersAtTable[2].id;
      const player3id = usersAtTable[3].id;

      const postPayload = JSON.stringify({
        ingameModes: thisLobby.ingameModes,
        pointsToWin: thisLobby.pointsToWin,
        startingCard: thisLobby.startingCard,
        weisAllowed: thisLobby.weis,
        crossWeisAllowed: thisLobby.crossWeis,
        weisAsk: thisLobby.weisAsk,
        player0id: player0id,
        player1id: player1id,
        player2id: player2id,
        player3id: player3id,
        prevLobbyId: thisLobby.id
      });

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
  }



  // on component mount (I have joined the lobby), inform the other users in the lobby to re-fetch the users in the lobby
  useEffect(() => {

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
          const fetchedOnlineUsersNotInLobby = excludeSublist(response.data, lobbyUsers);
          setAllUsers(fetchedOnlineUsersNotInLobby);
          return fetchedOnlineUsersNotInLobby;
        } catch(error) {
          alert('Could not fetch any users to invite...');
        }
      }

      fetchAllUsers().then(fetchedOnlineUsersNotInLobby => console.log({fetchedOnlineUsersNotInLobby}));
    }
  }, [allUsersFetchSwitch])

  // does the actual re-fetching of the lobby users and users at the table triggered by state update of lobbyFetchSwitch
  useEffect(() => {
    // upon fetch notification do fetching
    const fetchAndSetLobbyUsersAndUsersAtTable = async () => {
      try {
        const response = await api.get(`/lobbies/${thisLobby.id}`);
        const fetchedLobby = response.data;
        setLobbyUsers(fetchedLobby.usersInLobby);
        setUsersAtTable([fetchedLobby.userTop, fetchedLobby.userLeft, fetchedLobby.userBottom, fetchedLobby.userRight])
        return fetchedLobby;

      } catch (error) {
        alert('Could not fetch the necessary lobby data...');
        history.push('/menu');
      }
    }

    fetchAndSetLobbyUsersAndUsersAtTable().then(fetchedLobby => console.log({fetchedLobby}));
  }, [lobbyFetchSwitch]);



  // if I got kicked from the lobby...
  useSubscription(`/lobbies/${thisLobby.id}/kicked/${myId}`, () => backToMenu());

  // if shutdown notification received then redirect to menu
  useSubscription(`/lobbies/${thisLobby.id}/shutdown`, () => {
    alert("It seems this lobby has been shut down...");
    history.push('/menu');
  });

  // if another player joins or leaves, get a notification to initialize lobby users and users an table re-fetching
  useSubscription(`/lobbies/${thisLobby.id}/fetch`, () => {
    // trigger the user fetching switch
    setLobbyFetchSwitch(!lobbyFetchSwitch);
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

        history.push({
          pathname: `/game/${gameId}`,
          state: {...game}
        });


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
                lobbyCreator={thisLobby.creatorUsername}
              />
          ) : <></> }
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
            <LobbyJassTable client={stompClient} tableUsers={usersAtTable} lobbyId={thisLobby.id}/>
          </JassTeppichWrapper>
          <ChatWrapper/>
          <BackButton onClick={() => backToMenu()}>
            Back to Mainmenu
          </BackButton>
          {iAmCreator ? (
              <StartButton onClick={() => createGame()}>
                Start Game
              </StartButton>
          ) : <></> }
        </LobbyWrapper>
        <UserList onMountOpen={false}/>
      </BackgroundContainer>
  );
}

export default LobbyPage;


// leveraged to exclude the users that are currently in the lobby from the list of users one can invite
function excludeSublist(list, sublist) {
  const lobbyUserIds = new Set(sublist.map(u => u.id));
  return [...new Set(list.filter(el => !lobbyUserIds.has(el.id)))];
}
