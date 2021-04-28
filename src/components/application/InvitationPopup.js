import React from 'react';
import styled from 'styled-components';
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import {useHistory} from "react-router-dom";

const PopupView = styled('div')({
  position: 'fixed',
  width: '100%',
  height: '100%',
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

export const InvitationPopup = props => {
  const myId = props.userId;
  const lobbyId = props.lobbyId;
  const history = useHistory();

  console.log({myId, lobbyId})

  const join = async () => {
    try {
      const userIdRequest = JSON.stringify({userId: myId, remove: false, add: true})
      const response = await api.put(`/lobbies/${lobbyId}`, userIdRequest);
      const lobby = response.data;
      console.log(lobby.id);
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