import React, {useEffect, useState} from 'react';
import {useSubscription, useStompClient} from 'react-stomp-hooks';
import styled from "styled-components";
import {Spinner} from "../../../views/design/Spinner";
import {api} from "../../../helpers/api";
import {useHistory} from "react-router-dom";



const LobbyPlayerList = props => {
  const [users, setUsers] = useState([]);
  const [fetch, setFetch] = useState(false);
  const lobbyId = props.lobbyId;
  const myUsername = JSON.parse(localStorage.getItem('user')).username;
  const myId = JSON.parse(localStorage.getItem('user')).id;
  const history = useHistory();
  let uniqueKey = 0;    // key generator for children in the render method

  const stompClient = useStompClient();
  useSubscription(`/topic/lobbies/${props.lobbyId}/fetch`, () => {
    setFetch(true);
  });


  useEffect(() => {
    fetchUsers().then(response => console.log({users: response}));
  }, [fetch]);


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

  // upon re-fetch notification do re-fetch
  const fetchUsers = async () => {
    try {
      const response = await api.get(`/lobbies/${lobbyId}`);
      setUsers([...response.data.usersInLobby]);

      return response.data.usersInLobby;

    } catch (error) {
      alert('It seems this lobby has been shut down...');
      await backToMenu();
    }
  }

  return (
      <div>
        <ul>
          {users ? (
              users.map(user => <li key={uniqueKey++}>{user}</li>)
            ) : (
                <Spinner/>
          )}
        </ul>
      </div>
  );
}

export default LobbyPlayerList;



