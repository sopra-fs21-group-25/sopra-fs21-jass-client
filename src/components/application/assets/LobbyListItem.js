import React from 'react';
import styled from 'styled-components';
import {Button} from "../../../views/design/Button";
import {useHistory} from "react-router-dom";
import {api} from "../../../helpers/api";


const ItemContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'inherit',
  height: '160px',
  overflowY: 'auto',
  overflowX: 'hidden',
  borderRadius: '10px',
  border: '1px solid black',
  background: 'linear-gradient(0deg, rgba(89,89,89,0.5) 0%, rgba(184,184,184,0.5) 100%)',
  marginBottom: '2px'
});

const UserlistContainer = styled('div')({
  height: '100%',
  width: '30%'
});

const RulesContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  width: '60%',
});

const ButtonContainer = styled('div')({
  display: 'block',
  height: '100%',
  width: '10%'
});

function capitalize(string) {
  if(!(typeof string === 'string')) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


const LobbyListItem = props => {

  const history = useHistory();

  let lobby = props.lobby || null;
  let uniqueKey = 0;    // key generator for children in the render method

  const join = async () => {

    const myId = JSON.parse(localStorage.getItem('user')).id;
    const userIdRequest = JSON.stringify({userId: myId, remove: false, add: true});
    const response = await api.put(`/lobbies/${lobby.id}`, userIdRequest);
    lobby = response.data;
    console.log({data: response.data});
    history.push({
      pathname: `/lobby/${lobby.id}`,
      state: lobby
    });
  }

  return (
    <ItemContainer>
      <UserlistContainer>
        Users in Lobby:
        {lobby?.usersInLobby.map(user => <div key={uniqueKey++}>{user}</div>)}
      </UserlistContainer>
      <RulesContainer>
        <div style={{width: '50%'}}>
          Game modes played:
          {lobby?.ingameModes.map(m => {
            return (
                <div key={uniqueKey++} style={{margin: 0, padding: 0, fontSize: '12px'}}>
                  {capitalize(m.ingameMode)} {m.multiplicator}x
                </div>
            )
          })}
        </div>
        <div style={{width: '50%'}}>
          Starting Card:
          <p style={{marginBottom: '20px', padding: 0, fontSize: '12px'}}>{capitalize(lobby?.startingCard.suit)} {capitalize(lobby?.startingCard.rank)}</p>
          Points to win: <p style={{margin: 0, padding: 0, fontSize: '12px'}}>{lobby?.pointsToWin}</p>
        </div>
      </RulesContainer>
      <ButtonContainer>
        <Button onClick={() => join()}>
          Join
        </Button>
      </ButtonContainer>
    </ItemContainer>
  );
}

export default LobbyListItem;