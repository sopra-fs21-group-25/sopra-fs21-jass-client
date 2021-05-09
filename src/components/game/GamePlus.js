import React, {useEffect, useRef, useState} from 'react';
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {useStompClient, useSubscription} from 'react-stomp-hooks';
import '../cards/index.css';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import '../cards/index.css';

import acorn from "../../views/images/icons/acorn.png";
import rose from "../../views/images/icons/rose.png";
import bell from "../../views/images/icons/bell.png";
import shield from "../../views/images/icons/shield.png";
import undenufe from "../../views/images/icons/undenufe.png";
import obenabe from "../../views/images/icons/obenabe.png";
import slalom from "../../views/images/icons/slalom.png";
import gusti from "../../views/images/icons/gusti.png";
import mary from "../../views/images/icons/mary.png";
import questionmark from "../../views/images/icons/questionmark.png";
import InitDistributionPlus from "../cards/InitDistributionPlus";



const CurrentModeContainer = styled(BaseContainer)`
  position: absolute;
  left: 3em;
  top: 3em;

`;

const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
`;



const GamePlus = props => {
  const [{
    pointsTeam0_2,
    pointsTeam1_3,
    trickToPlay,
    playerStartsTrick,
    cardsPlayed,
    hasTrickStarted,
    idOfRoundStartingPlayer,
    cardsOfPlayer,
    currentIngameMode
  }, setGameState] = useState({...props.initialGameState, currentIngameMode: {text: 'Not decided yet', value: questionmark}});

/*  const [currentIngameMode, setCurrentIngameMode] = useState({text: 'Not decided yet', value: questionmark});*/
  const [startOfRound, setStartOfRound] = useState(false);

  const [patchGameStateSwitch, setPatchGameStateSwitch] = useState(false);

  /* Game state
  ---------------------------------------------------------------------------------------------------------------------
     Helper methods                                                                                                  */

  // depending on the game state and myId, calculates myIndex which is relevant to determine where I sit around the table
  const getMyIndex = state => {
    if(state == null) return null;

    // stores the key (attribute name) of me as a player id, e.g. if I am considered playerX
    // then playerKey contains the string 'playerXid'
    const playerKey = (Object.entries(state)
        .filter(([key, val]) => (val === myId && key.substring(0, 6) === 'player'))[0])[0];

    // parses above string to obtain the integer X if I am considered playerX with playerXid
    // i.e. returns myIndex
    return Number.parseInt(playerKey.charAt(6), 10);
  }

  // takes an array of {ingameMode, multiplicator} objects and adds a text (descriping the mode) and
  // a value (describing the icon for that mode) to each such object. returns the array consisting of
  // {text, value, ingameMode, multiplicator} objects.
  // NOTE: Necessary to have this method constructed before setting initial ingameModes state
  const getLabelledIngameModes = modes => {
    if(modes == null) return null;

    const labelledIngameModes = [...modes];
    labelledIngameModes.map(mode => {
      mode.text = `${mode.ingameMode} x${mode.multiplicator}`;

      switch(mode.ingameMode){
        case "ACORN":
          mode.value = acorn;
          break;
        case "ROSE":
          mode.value = rose;
          break;
        case "BELL":
          mode.value = bell;
          break;
        case "SHIELD":
          mode.value = shield;
          break;
        case "UNDENUFE":
          mode.value = undenufe;
          break;
        case "OBENABE":
          mode.value = obenabe;
          break;
        case "SLALOM":
          mode.value = slalom;
          break;
        case "GUSTI":
          mode.value = gusti;
          break;
        case "MARY":
          mode.value = mary;
          break;
        default:
          mode.value = questionmark;
      }

      return mode;
    });

    return labelledIngameModes;
  }

  // handles the put request and stomp notifications if the player who chooses the
  // ingameMode at round start has actually chosen an ingameMode
  const handleIngameModeChosen = ingameMode => {
    setStartOfRound(false);
    updateGameState(null, ingameMode);
  }

  // triggers update of game state in backend and notifies all players to re-fetch and patch their game state
  const updateGameState = async (playedCard, ingameMode) => {

    let payload;

    if(!playedCard && ingameMode) {
      // case if ingameMode has been chosen but obviously no card played yet

      payload = JSON.stringify({
        ingameMode: ingameMode.ingameMode,
        userId: myId
      });

    } else if(playedCard && !ingameMode) {
      // case if a card has been played but no ingameMode chosen, only a card played

      payload = JSON.stringify({
        playedCard: playedCard,
        userId: myId
      });

    } else if(!playedCard && !ingameMode) {
      // we utilize this case for when all cards have been played already with the last put request
      // but the new trick has not yet started. we then send a put request such that the game state
      // resets the card on the table and lets the next trick starting player actually start

      payload = JSON.stringify({
        userId: myId
      });
    }

    const response = await api.put(`/games/${gameId}`, payload);
    console.log({newStateInUpdate: response.data});

    // after updating the game state backend-internally, notify everyone to re-fetch the updated state
    stompClient.publish({
      destination: `/app/games/${gameId}/fetch`,
      body: null
    });
  }

  const getPartnerId = (myId, state) => {
    if(myId === state.player0id) {
      return state.player2id;
    } else if(myId === state.player1id) {
      return state.player3id;
    } else if(myId === state.player2id) {
      return state.player0id;
    } else if(myId === state.player3id) {
      return state.player1id;
    }
  }

  const synchronizeMyGameState = newState => {
    console.log({newStateInSynchronize: newState})
    // updates game state
    setGameState({
      ...newState,
      currentIngameMode: newState.currentIngameMode
          ? ingameModes.filter(mode => mode.ingameMode === newState.currentIngameMode)[0]
          : {text: 'Not decided yet', value: questionmark}
    });
    // if the current trick to play is the 0-th trick and the trick has not
    // started yet, we can consider this the case when the round has to start
    if(newState['trickToPlay'] === 0 && !newState['hasTrickStarted']) {
      setStartOfRound(true);
    } else {
      setStartOfRound(false);
    }
  }

  /*
---------------------------------------------------------------------------------------------------------------------
     Constants                                                                                                     */

  const gameId = props.initialGameState.id || sessionStorage.getItem('gameId');
  const myId = JSON.parse(sessionStorage.getItem('user'))?.id;
  const partnerId = getPartnerId(myId, props.initialGameState);
  const myIndex = getMyIndex(props.initialGameState) || Number.parseInt(sessionStorage.getItem('myIndex'), 10);
  const ingameModes = getLabelledIngameModes(props.initialGameState.ingameModes);
  const pointsToWin = props.initialGameState.pointsToWin;


  const stompClient = useStompClient();



  /*
---------------------------------------------------------------------------------------------------------------------
     Hooks                                                                                                         */

  // the actual worker responsible for patching the game state to the true current game state
  useEffect(() => {
    console.log('useEffect start reached');
    // fetches and sets the current game state from our single source of truth, the holy backend
    const fetchAndSet = async () => {
      const response = await api.get(`/games/${gameId}/${myId}`);
      const newGameState = response.data;
      console.log({newGameState});
      // stores these two highly relevant constants in our session storage
      if(!sessionStorage.getItem('gameId')) {
        sessionStorage.setItem('gameId', newGameState.id);
      }
      if(!sessionStorage.getItem('myIndex')) {
        sessionStorage.setItem('myIndex', getMyIndex(newGameState).toString());
      }

      synchronizeMyGameState(newGameState);
    };

    fetchAndSet();

  }, [patchGameStateSwitch])

  // upon notification to re-fetch the updated game state...
  useSubscription(`/games/${gameId}/fetch`, () => {
    console.log('UPDATE');

    // simply trigger above useEffect
    setPatchGameStateSwitch(prev => !prev);
  });




  return (
      <BackgroundContainer>
        <Dialog open={startOfRound && idOfRoundStartingPlayer === myId && cardsPlayed.every(card => card == null)}>
          <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
          <List>
            {ingameModes ? ingameModes.map((mode, index) => (
                <ListItem key={index} button onClick={() => handleIngameModeChosen(mode)}>
                  <div><img src={mode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
                  <ListItemText primary={mode.text} />
                </ListItem>
            )) : <></>}
          </List>
        </Dialog>
        <CurrentModeContainer>
          <Label style={{backgroundColor: "white", textAlign: "center"}}>
            Current Mode:
            <div><img src={currentIngameMode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
            <input style={{textAlign: "center"}} disabled={true} type={"text"} value={currentIngameMode.text} />
          </Label>
        </CurrentModeContainer>
        {(myIndex != null && cardsOfPlayer && cardsPlayed) ?
            <InitDistributionPlus
                cardsInHands={cardsOfPlayer}
                cardsPlayed={cardsPlayed}
                currentIngameMode={currentIngameMode}
                playerStartsTrick={playerStartsTrick}
                updateGameState={(c, m) => updateGameState(c, m)}
                myIndex={myIndex}
            />
            : <></>}
      </BackgroundContainer>
  );
}

export default GamePlus;


















