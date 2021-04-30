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


function parseUsers(top, bot, left, right) {
  return JSON.stringify({
    playerTop: top,
    playerBottom: bot,
    playerLeft: left,
    playerRight: right
  });
}

// leveraged to exclude the users that are currently in the lobby from the list of users one can invite
function excludeSublist(list, sublist) {
  const subset = new Set(sublist);
  return [...new Set(list.filter(el => !subset.has(el.username)))];
}

// returns false if list-elements are not identical, true otherwise
function containTheSameUsers(list1, list2) {
  if(list1.length != list2.length) {
    return false;
  }

  const l1set = new Set(list1.map(u => u.id));
  const l2set = new Set(list2.map(u => u.id));

  for(let x of l1set) {
    if(!l2set.has(x)) return false;
  }

  for(let y of l2set) {
    if(!l1set.has(y)) return false;
  }

  return true;
}

const LobbyPage = () => {
  const [thisLobby, setThisLobby] = useState(useLocation().state);
  const [lobbyUsers, setLobbyUsers] = useState(useLocation().state.usersInLobby);
  const [allUsers, setAllUsers] = useState([]);
  const [lobbyUsersFetchSwitch, setLobbyUsersFetchSwitch] = useState(false);
  const [allUsersFetchSwitch, setAllUsersFetchSwitch] = useState(false);
  const myId = JSON.parse(localStorage.getItem('user')).id;
  const myUsername = JSON.parse(localStorage.getItem('user')).username;
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
        const top = localStorage.getItem('topPlayer');
        const bottom = localStorage.getItem('bottomPlayer');
        const left = localStorage.getItem('leftPlayer');
        const right = localStorage.getItem('rightPlayer');

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
      // finally remove the items from my localStorage and redirect back to the menu
      localStorage.removeItem('topPlayer');
      localStorage.removeItem('bottomPlayer');
      localStorage.removeItem('leftPlayer');
      localStorage.removeItem('rightPlayer');
      history.push('/menu');
    }
  }

  const createGame = async () => {
    const response = await api.get(`/lobbies/${thisLobby.id}`);
    history.push({
      pathname: `/game/${thisLobby.id}`,
      state: {...response.data}
    });
  }
  // if I got kicked from the lobby...
  useSubscription(`/lobbies/${thisLobby.id}/kicked/${myUsername}`, () => backToMenu());

  // if shutdown notification received then clear localStorage items and redirect to menu
  useSubscription(`/lobbies/${thisLobby.id}/shutdown`, msg => {
    alert("It seems this lobby has been shut down...");
    localStorage.removeItem('topPlayer');
    localStorage.removeItem('bottomPlayer');
    localStorage.removeItem('leftPlayer');
    localStorage.removeItem('rightPlayer');
    history.push('/menu');
  });

  // if another player joins or leaves, get a notification to initialize re-fetching an table synchronisation
  useSubscription(`/lobbies/${thisLobby.id}/fetch`, msg => {
    // trigger the user fetching switch
    setLobbyUsersFetchSwitch(!lobbyUsersFetchSwitch);

    // additionally if I am the creator and a user has joined I need to inform him about the seats already taken
    if(iAmCreator && msg.body === 'join') {
      const top = localStorage.getItem('topPlayer');
      const bottom = localStorage.getItem('bottomPlayer');
      const left = localStorage.getItem('leftPlayer');
      const right = localStorage.getItem('rightPlayer');

      stompClient.publish({
        destination: `/app/lobbies/${thisLobby.id}/table`,
        body: parseUsers(top, bottom, left, right)
      });
    }
  });


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
        localStorage.removeItem('topPlayer');
        localStorage.removeItem('bottomPlayer');
        localStorage.removeItem('leftPlayer');
        localStorage.removeItem('rightPlayer');
        history.push('/menu');
      }
    }

    fetchLobbyUsers().then(newUsers => console.log({newUsers}));
  }, [lobbyUsersFetchSwitch]);



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