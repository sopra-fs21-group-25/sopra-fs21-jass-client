import React from 'react';
import styled from 'styled-components';
import {useEffect, useState} from 'react';


const ItemContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'inherit',
  height: '100px',
  overflowY: 'auto',
  overflowX: 'hidden',
  borderRadius: '5px',
  border: '1px solid black',
  background: 'white'
});

const UserlistContainer = styled('div')({
  height: '100%',
  width: '30%'
});

const RulesContainer = styled('div')({
  height: '100%',
  width: '50%',
});

const ButtonContainer = styled('div')({
  display: 'block',
  height: '100%',
  width: '20%'
});

function capitalize(string) {
  if(!(typeof string === 'string')) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


const LobbyListItem = props => {
/*  const dummyLobby = {
    id: -1,
    creatorUsername: 'dummy-name',
    mode: 'SCHIEBER',
    lobbyType: 'public',
    startingCard: {suit: 'ROSE', rank: 'TEN', trumpf: false},
    pointsToWin: 2500,
    ingameModes: [
      {ingameMode: 'ACORN', multiplicator: 1},
      {ingameMode: 'ROSE', multiplicator: 1},
      {ingameMode: 'BELL', multiplicator: 1},
      {ingameMode: 'SHIELD', multiplicator: 1},
      {ingameMode: 'UNDENUFE', multiplicator: 1},
      {ingameMode: 'OBENABE', multiplicator: 1}
    ],
    usersInLobby: ['dummy-name'],
    weis: false,
    crossWeis: false,
    weisAsk: null
  }*/

  const lobby = props.lobby || null;
  let uniqueKey = 0;    // key generator for children in the render method


  return (
    <ItemContainer>
      <UserlistContainer>
        Users in Lobby:
        {lobby?.usersInLobby.map(user => <div key={uniqueKey++}>{user}</div>)}
      </UserlistContainer>
      <RulesContainer>
        Game modes played:
        {lobby?.ingameModes.map(m => {
          return (
              <div key={uniqueKey++} style={{margin: 0, padding: 0, fontSize: '12px'}}>
                {capitalize(m.ingameMode)} {m.multiplicator}x
              </div>
              )
        })}
        Starting Card:
        <p>Suit: {capitalize(lobby?.startingCard.suit)}, Rank: {capitalize(lobby?.startingCard.rank)}</p>
        Points to win: <p>{lobby?.pointsToWin}</p>
      </RulesContainer>
      <ButtonContainer>
        DUMMY
      </ButtonContainer>
    </ItemContainer>
  );
}

export default LobbyListItem;