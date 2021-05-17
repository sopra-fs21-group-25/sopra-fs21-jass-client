import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Spinner} from "../../../views/design/Spinner";


const ItemContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '50px',
  border: '1px solid black',
  background: '#7F8385'
});

const LeftItemComponentContainer = styled('div')({
  display: 'flex',
  width: '70%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '15px',
  color: 'white'
});

const RightItemComponentContainer = styled('div')({
  display: 'flex',
  width: '30%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
});

const RemoveButton = styled.button`
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 60%;
  height: 60%;
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  background: rgb(186, 31, 31, 1);
  transition: all 0.3s ease;
`;

const ListItem = props => {

  const removeUser = () => {
    props.client.publish({
      destination: `/app/lobbies/${props.lobbyId}/kicked/${props.user}`,
      data: null
    })
  };

  return (
      <li>
        <ItemContainer>
          <LeftItemComponentContainer>
            {props.user}
          </LeftItemComponentContainer>
          <RightItemComponentContainer>
            {props.removable ? (
                <RemoveButton onClick={() => removeUser()}>X</RemoveButton>
            ) : null}
          </RightItemComponentContainer>
        </ItemContainer>
      </li>
  );
};

const LobbyPlayerList = props => {
  let uniqueKey = 0;    // key generator for children in the render method
  const stompClient = props.client;
  const lobbyId = props.lobbyId;


  return (
      <div>
        <ul>
          {props.users ? (
              props.users.map(user =>
                  <ListItem
                    key={uniqueKey++}
                    user={user}
                    removable={props.permitted && props.creator !== user}
                    client={stompClient}
                    lobbyId={lobbyId}
                  />)
            ) : (
                <Spinner/>
          )}
        </ul>
      </div>
  );
}

export default LobbyPlayerList;



