import React, {useEffect} from "react";
import {useState} from "react";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {api} from "../../../helpers/api";
import {Button} from "../../../views/design/Button";


export const InvitationInjector = props => {
  const [showPopup, setShowPopup] = useState(false);
  const [lobbyToJoinId, setLobbyToJoinId] = useState('');
  const stompClient = useStompClient();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  const resetLobbyToJoinId = () => {
    setLobbyToJoinId('');
  }

  useSubscription(`/lobbies/invite/${props.userId}`, msg => {
    setLobbyToJoinId(msg.body);
  });

  useEffect(() => {
    if(lobbyToJoinId) {
      togglePopup();
    }
  }, [lobbyToJoinId]);

  return (
      <div>
        {showPopup ? (
            <InvitationPopup
                userId={props.userId}
                lobbyId={lobbyToJoinId}
                client={stompClient}
                closePopup={() => {
                  togglePopup();
                  resetLobbyToJoinId();
                }}
            />
        ) : null }
      </div>
  );
}


const InvitationPopup = props => {
  const myId = props.userId;
  const lobbyId = props.lobbyId;
  const history = useHistory();

  console.log({myId, lobbyId})

  const join = async () => {
    try {
      const userIdRequest = JSON.stringify({userId: myId, remove: false, add: true})
      const response = await api.put(`/lobbies/${lobbyId}`, userIdRequest);
      const lobby = response.data;

      props.client.publish({
        destination: `/app/lobbies/${lobby.id}/fetch`,
        body: ''
      });

      history.push({
        pathname: `/lobby/${lobbyId}`,
        state: lobby
      });
    } catch(error) {
      console.log({error});
    }
  }

  const decline = () => {
    props.closePopup();
  }


  return (
      <PopupView>
        <PopupInner>
          <Button onClick={() => join()}>Join</Button>
          <Button onClick={() => decline()}>Decline</Button>
        </PopupInner>
      </PopupView>
  );
}

const PopupView = styled('div')({
  position: 'fixed',
  width: '100%',
  height: '100%',
  zIndex: '50',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 'auto',
  backgroundColor: 'rgb(0, 0, 0, 0.5)'
});

const PopupInner = styled('div')({
  position: 'absolute',
  top: '25%',
  left: '25%',
  right: '25%',
  bottom: '25%',
  margin: 'auto',
  background: 'white'
});