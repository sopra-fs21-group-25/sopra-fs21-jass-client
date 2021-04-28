import React, {useEffect} from "react";
import {useState} from "react";
import {InvitationPopup} from "../InvitationPopup";
import {useSubscription} from "react-stomp-hooks";


export const InvitationInjector = props => {
  const [showPopup, setShowPopup] = useState(false);
  const [lobbyToJoinId, setLobbyToJoinId] = useState('');

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
                closePopup={() => {
                  togglePopup();
                  resetLobbyToJoinId();
                }}
            />
        ) : null }
      </div>
  );
}