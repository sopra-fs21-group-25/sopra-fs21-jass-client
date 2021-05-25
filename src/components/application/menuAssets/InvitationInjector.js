import React, {useEffect} from "react";
import {useState} from "react";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import styled from "styled-components";
import {useHistory} from "react-router-dom";
import {api} from "../../../helpers/api";
import {Button} from "../../../views/design/Button";
import {GlowButton} from "../../../views/design/ElegantAssets";


export const InvitationInjector = props => {
  const [showPopup, setShowPopup] = useState(false);
  const [lobbyToJoin = {
    lobbyId: String,
    lobbyCreator: String
  }, setLobbyToJoin] = useState(null);
  const stompClient = useStompClient();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  const resetLobbyToJoinId = () => {
    setLobbyToJoin(null);
  }

  useSubscription(`/lobbies/invite/${props.userId}`, msg => {
    const lobbyData = JSON.parse(msg.body);
    setLobbyToJoin(lobbyData);
  });

  useEffect(() => {
    if(lobbyToJoin) {
      togglePopup();
    }
  }, [lobbyToJoin]);

  return (
      <div>
        {showPopup ? (
            <InvitationPopup
                userId={props.userId}
                lobby={lobbyToJoin}
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
  const history = useHistory();


  const join = async () => {
    try {
      const userIdRequest = JSON.stringify({userId: props.userId, remove: false, add: true})
      const response = await api.put(`/lobbies/${props.lobby.lobbyId}`, userIdRequest);
      const lobby = response.data;

      props.client.publish({
        destination: `/app/lobbies/${lobby.id}/fetch`,
        body: ''
      });

      history.push({
        pathname: `/lobby/${lobby.id}`,
        state: lobby
      });
    } catch(error) {
      console.log({error});
    }
  }

  const decline = () => {
    props.closePopup();
  }

  const buttonWrapperStyle = {
    maxHeight: '20%',
    maxWidth: '100%',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '1% 3%'
  }

  const textWrapperStyle = {
    textAlign: 'center',
    fontFamily: 'Satisfy, cursive',
    fontWeight: 600,
  }


  return (
      <PopupView>
        <PopupInner>
          <div style={textWrapperStyle}>
            <h1>You have been invited to join {props.lobby.lobbyCreator}'s Jass table!</h1>
          </div>
          <div style={buttonWrapperStyle}>
            <GlowButton onClick={() => join()}>join</GlowButton>
            <GlowButton onClick={() => decline()}>decline</GlowButton>
          </div>
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
  background: 'linear-gradient(21deg, rgba(55,55,55,0.8603816526610644) 0%, rgba(107,163,170,0.8323704481792717) 48%, rgba(135,205,214,0.8547794117647058) 100%)',
  borderRadius: '10px',
  border: '10px groove rgba(221,221,221,0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});