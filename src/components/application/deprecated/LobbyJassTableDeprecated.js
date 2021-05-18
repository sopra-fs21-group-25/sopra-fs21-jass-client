import React, {useEffect, useState} from 'react';
import {useSubscription, useStompClient} from 'react-stomp-hooks';
import {Button} from "../../../views/design/Button";
import styled from "styled-components";



const LobbyJassTableDeprecated = props => {
  const [playerTop, setPlayerTop] = useState('');
  const [playerBottom, setPlayerBottom] = useState('');
  const [playerLeft, setPlayerLeft] = useState('');
  const [playerRight, setPlayerRight] = useState('');
  const [myPosition, setMyPosition] = useState(null);
  const myUsername = JSON.parse(sessionStorage.getItem('user')).username;

  useEffect(() => {
    sessionStorage.setItem('topPlayer', playerTop);
  }, [playerTop])
  useEffect(() => {
    sessionStorage.setItem('bottomPlayer', playerBottom);
  }, [playerBottom])
  useEffect(() => {
    sessionStorage.setItem('leftPlayer', playerLeft);
  }, [playerLeft])
  useEffect(() => {
    sessionStorage.setItem('rightPlayer', playerRight);
  }, [playerRight])

  useEffect(() => {
    setPlayerTop(sessionStorage.getItem('topPlayer'));
    setPlayerBottom(sessionStorage.getItem('bottomPlayer'));
    setPlayerLeft(sessionStorage.getItem('leftPlayer'));
    setPlayerRight(sessionStorage.getItem('rightPlayer'));
  }, [])

  const stompClient = props.client;
  useSubscription(`/lobbies/${props.lobbyId}/table`, message => {
    const body = JSON.parse(message.body);
    setPlayerTop(body.playerTop);
    setPlayerBottom(body.playerBottom);
    setPlayerLeft(body.playerLeft);
    setPlayerRight(body.playerRight);
  });





  const publishPlayer = (position) => {
    let message = '';
    if(position === 'top') {
      if(playerTop === myUsername) {
        setMyPosition(null);
        message = parseUsers('', playerBottom, playerLeft, playerRight);
      } else {
        message = parseUsers(myUsername, playerBottom, playerLeft, playerRight);
        setMyPosition(position);
      }
    } else if(position === 'bottom') {
      if(playerBottom === myUsername) {
        setMyPosition(null);
        message = parseUsers(playerTop, '', playerLeft, playerRight);
      } else {
        message = parseUsers(playerTop, myUsername, playerLeft, playerRight);
        setMyPosition(position);
      }
    } else if(position === 'left') {
      if(playerLeft === myUsername) {
        setMyPosition(null);
        message = parseUsers(playerTop, playerBottom, '', playerRight);
      } else {
        message = parseUsers(playerTop, playerBottom, myUsername, playerRight);
        setMyPosition(position);
      }
    } else if(position === 'right') {
      if(playerRight === myUsername) {
        setMyPosition(null);
        message = parseUsers(playerTop, playerBottom, playerLeft, '');
      } else {
        message = parseUsers(playerTop, playerBottom, playerLeft, myUsername);
        setMyPosition(position);
      }
    }
    stompClient.publish({
      destination: `/app/lobbies/${props.lobbyId}/table`,
      body: message
    })
  }



  return (
      <GridContainer>
        <ButtonContainer id={'top'} position={{col: 2, row: 1}}>
          {
            playerTop ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => (playerTop === myUsername) ? publishPlayer('top') : null}
                >{playerTop}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => myPosition == null ? publishPlayer('top') : null}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'bottom'} position={{col: 2, row: 3, }}>
          {
            playerBottom ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => (playerBottom === myUsername) ? publishPlayer('bottom') : null}
                >{playerBottom}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => myPosition == null ? publishPlayer('bottom') : null}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'left'} position={{col: 1, row: 2}}>
          {
            playerLeft ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => (playerLeft === myUsername) ? publishPlayer('left') : null}
                >{playerLeft}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => myPosition == null ? publishPlayer('left') : null}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'right'} position={{col: 3, row: 2}}>
          {
            playerRight ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => (playerRight === myUsername) ? publishPlayer('right') : null}
                >{playerRight}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => myPosition == null ? publishPlayer('right') : null}
                >Sit</Button>
            )
          }
        </ButtonContainer>

        <Jasstable/>

      </GridContainer>
  );
}

export default LobbyJassTableDeprecated;




function parseUsers(top, bot, left, right) {
  return JSON.stringify({
    playerTop: top,
    playerBottom: bot,
    playerLeft: left,
    playerRight: right
  });
}

const GridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 8fr 1fr',
  gridTemplateRows: '1fr 8fr 1fr',
  gridGap: '5px',
  width: '100%',
  height: 'auto',
  aspectRatio: '1'
});

const Jasstable = styled('div')({
  gridColumn: 2,
  gridRow: 2,
  background: '#1F7A20',
  border: '1px solid black',
  borderRadius: '5px'
});

const ButtonContainer = styled.div`
  grid-column: ${props => props.position.col || 1};
  grid-row: ${props => props.position.row || 1};
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
  -ms-transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
  transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

