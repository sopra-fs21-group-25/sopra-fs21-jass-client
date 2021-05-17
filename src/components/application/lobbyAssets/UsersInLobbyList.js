import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {api} from "../../../helpers/api";
import {Spinner} from "../../../views/design/Spinner";
import {
  StompSessionProvider,
  useSubscription,
  withSubscription,
  useStompClient,
  withStompClient
} from 'react-stomp-hooks';



const UsersInLobbyList = props => {
  const lobbyId = props.id;
  const [users, setUsers] = useState(props.users);
  const history = useHistory();
  let uniqueKey = 0;

  const stompClient = useStompClient();
  useSubscription(`/topic/lobbies/lobbyUsers/${lobbyId}`, message => {
    setUsers([...users, message.content]);
    console.log({message});
  });

  const sendMessage = message => {
    stompClient.publish({
      destination: `/lobbies/${lobbyId}`,
      username: message
    })
  }

  return (
      <div>

      </div>
  );
}


export default UsersInLobbyList;