import React, {useEffect, useState} from 'react';
import {BackgroundContainer, BaseContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {useStompClient, useSubscription} from 'react-stomp-hooks';
import {useHistory} from "react-router-dom";
import '../cards/index.css';
import styled from 'styled-components';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import './gameAssets/gameStyles.scss';

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
import {Spinner} from "../../views/design/Spinner";
import {DialogContent} from "@material-ui/core";
import {UserList} from "../application/applicationAssets/UserList";
import {GroupChat} from "../application/lobbyAssets/GroupChat";


const CurrentModeContainer = styled(BaseContainer)`
  position: absolute;
  left: 3em;
  top: 3em;

`;

const ScoreContainer = styled(BaseContainer)`
  position: absolute;
  width: 200px;
  height: 400px;
  right: 50px;
  top: 20px;
  background-color: transparent;
  text-align: center;
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
    currentIngameMode,
    playerUsernames,
    playerCardsAmount
  }, setGameState] = useState({...props.initialGameState, currentIngameMode: {text: 'not decided yet', value: questionmark}, pointsTeam0_2: 0, pointsTeam1_3: 0});

  const [startOfRound, setStartOfRound] = useState(false);

  const [showScoreDialog, setShowScoreDialog] = useState(false); 

  const [gameEnded, setGameEnded] = useState(false);

  const [patchGameStateSwitch, setPatchGameStateSwitch] = useState(false);

  const [endGameText, setEndGameText] = useState("");

  const [{canShove, gotShoved}, setShovingState] = useState({canShove: false, gotShoved: false});

  const [slalomTrigger, setSlalomTrigger] = useState(false);
  
  const history = useHistory();
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

    return [...modes].map(mode => {
      mode.text = `${mode.ingameMode} x${mode.multiplicator}`;

      switch (mode.ingameMode) {
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
  }

  // handles the put request and stomp notifications if the player who chooses the
  // ingameMode at round start has actually chosen an ingameMode
  const handleIngameModeChosen = async ingameMode => {
    if(gotShoved) {
      stompClient.publish({
        destination: `/app/games/${gameId}/shove/notify/${partnerId}`,
        body: JSON.stringify(ingameMode.ingameMode)
      });
    } else {
      if(ingameMode.ingameMode === 'SLALOM') {
        setSlalomTrigger(true);
      } else {
        await updateGameState(null, ingameMode);
      }
    }
    setStartOfRound(false);
    setShovingState({canShove: false, gotShoved: false});
  }

  const handleDoShove = () => {
    setStartOfRound(false);
    stompClient.publish({
      destination: `/app/games/${gameId}/shove/notify/${partnerId}`,
      body: JSON.stringify("choose")
    })
  }

  const handleScoreDialogClose = () => {
    setShowScoreDialog(false);
  }

  const handleEndDialogClose = () => {
    try {
      api.put(`/games/${gameId}/close`);
    }  
    finally {
      history.push('/menu');
    }
  }
  // triggers update of game state in backend and notifies all players to re-fetch and patch their game state
  const updateGameState = async (playedCard, ingameMode, startRoundHighOrLow) => {

    let payload;
    console.log({ingameMode});
    if(!playedCard && ingameMode) {
      // case if ingameMode has been chosen but obviously no card played yet

      // startRoundHighOrLow is set iff Slalom has been chosen and Obe or Unde has been chosen
      if(startRoundHighOrLow) {
        payload = JSON.stringify({
          ingameMode: ingameMode.ingameMode,
          userId: myId,
          lowOrHigh: startRoundHighOrLow
        });
      } else {
        payload = JSON.stringify({
          ingameMode: ingameMode.ingameMode,
          userId: myId
        });
      }


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
      body: ''
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

  const getCurrentlyActingPlayerIndex = () => {
    let i=0;
    for(i; i<4; i++) {
      if(playerStartsTrick[i]) {
        break;
      }
    }
    if(cardsPlayed.every(c => c == null) || !cardsPlayed.every(c => c == null)) {
      return i;
    }
    // at least one card and not all 4 cards have been played at this point,
    // i.e. the variable i must store the player's index who played the first
    // card this trick. So we set j = i, set i to the next index and then we
    // check until we find the first player who has not yet played a card
    const j = i;
    i = (i+1)%4;
    for(i; i !== j; i = (i+1)%4) {
      if(cardsPlayed[i] == null) {
        return i;
      }
    }

    // something went wrong
    return -1;
  }

  const synchronizeMyGameState = newState => {
    console.log({newStateInSynchronize: newState})
    // updates game state
    setGameState({
      ...newState,
      currentIngameMode: newState.currentIngameMode
          ? ingameModes.filter(mode => mode.ingameMode === newState.currentIngameMode)[0]
          : {text: 'not decided yet', value: questionmark},
      pointsTeam0_2: newState.pointsTeam0_2, 
      pointsTeam1_3: newState.pointsTeam1_3
    });
    // if the current trick to play is the 0-th trick and the trick has not
    // started yet, we can consider this the case when the round has to start
    if(newState['trickToPlay'] === 0 && !newState['hasTrickStarted']) {
      if (newState.pointsTeam0_2 >= newState.pointsToWin){
        setGameEnded(true);
        setEndGameText(`${scoreText[myIndex % 2]} won the game!`); 
      } else if  (newState.pointsTeam1_3 >= newState.pointsToWin){
        setGameEnded(true);
        setEndGameText(`${scoreText[1 - myIndex % 2]} won the game!`);
      } else {
        setStartOfRound(true);
        setShowScoreDialog(true);
        if(newState['idOfRoundStartingPlayer'] === myId && newState['cardsPlayed'].every(card => card == null)) {
          setShovingState({canShove: true, gotShoved: false});
        }
      }
    } else {
      setStartOfRound(false);
      setShowScoreDialog(false);
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
  const scoreText = ["Your team", "Opponent team"];

  /*
---------------------------------------------------------------------------------------------------------------------
     Hooks                                                                                                         */

  // the actual worker responsible for patching the game state to the true current game state
  useEffect(() => {
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

    void fetchAndSet();
  }, [patchGameStateSwitch])

  // upon notification to re-fetch the updated game state...
  useSubscription(`/games/${gameId}/fetch`, () => {
    console.log('UPDATE');

    // simply trigger above useEffect
    setPatchGameStateSwitch(prev => !prev);
  });

  useSubscription(`/games/${gameId}/shove/receive/${myId}`, msg => {
    console.log({msg});
    void (async data => {
      if(data === 'choose') {
        setShovingState({canShove: false, gotShoved: true});
      } else {
        setShovingState({canShove: false, gotShoved: false});
        if(data === 'SLALOM') {
          setSlalomTrigger(true);
        } else {
          await updateGameState(null, {ingameMode: data});
        }
      }
    })(JSON.parse(msg.body));
  });




  return (
      <BackgroundContainer>
        <Dialog open={gameEnded}>
          <DialogTitle>{`${endGameText}`}</DialogTitle>
          <List>
            <ListItem>
              <ListItemText primary={`${scoreText[myIndex % 2]}: ${pointsTeam0_2} points`}/>
            </ListItem>
            <ListItem>
              <ListItemText primary={`${scoreText[1 - myIndex % 2]}: ${pointsTeam1_3} points`}/>
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={handleEndDialogClose} color="primary">
              Back to main menu
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showScoreDialog && startOfRound}>
          <DialogTitle>{"Team points"}</DialogTitle>
          <List>
            <ListItem>
              <ListItemText primary={`${scoreText[myIndex % 2]}: ${pointsTeam0_2}`}/>
            </ListItem>
            <ListItem>
              <ListItemText primary={`${scoreText[1 - myIndex % 2]}: ${pointsTeam1_3}`}/>
            </ListItem>
          </List>
          <DialogActions>
            <Button onClick={handleScoreDialogClose} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={(!showScoreDialog && startOfRound && idOfRoundStartingPlayer === myId && cardsPlayed.every(card => card == null)) || gotShoved}>
          <DialogTitle>{gotShoved ? 'Your partner has shoved! Please choose in-game mode' : 'Please choose in-game mode'}</DialogTitle>
          <List>
            {ingameModes ?
                <>
                  {ingameModes.map((mode, index) => (
                    <ListItem key={index} button onClick={() => handleIngameModeChosen(mode)}>
                      <div><img src={mode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
                      <ListItemText primary={mode.text} />
                    </ListItem>
                  ))}
                  {canShove ?
                    <ListItem button onClick={() => handleDoShove()}>
                      <ListItemText primary={'Shove'}/>
                    </ListItem>
                  :<></>}
                </>
            :<></>}
          </List>
        </Dialog>
        <Dialog open={canShove && !startOfRound}>
          <DialogTitle>Waiting for your partner</DialogTitle>
        </Dialog>
        <Dialog open={slalomTrigger}>
         <DialogTitle>Start Slalom Obe (high to low) or Unde (low to high)?</DialogTitle>
         <List>
           <ListItem button onClick={() => {
             void updateGameState(null, {ingameMode: 'SLALOM'}, 'OBE');
             setSlalomTrigger(false);
           }}>
             <ListItemText primary={'Obe (high to low)'}/>
           </ListItem>
           <ListItem button onClick={() => {
             void updateGameState(null, {ingameMode: 'SLALOM'}, 'UNDE');
             setSlalomTrigger(false);
           }}>
             <ListItemText primary={'Unde (low to high'}/>
           </ListItem>
         </List>
        </Dialog>
        {(myIndex != null && cardsOfPlayer && cardsPlayed) ?
              <div className={'init-container'}>
                <InitDistributionPlus
                    cardsInHands={cardsOfPlayer}
                    cardsPlayed={cardsPlayed}
                    currentIngameMode={currentIngameMode}
                    playerStartsTrick={playerStartsTrick}
                    updateGameState={(c, m) => updateGameState(c, m)}
                    myIndex={myIndex}
                    trickToPlay={trickToPlay}
                    amountOfCardsHeldByPlayers={playerCardsAmount}
                    playerIds={[
                      props.initialGameState.player0id,
                      props.initialGameState.player1id,
                      props.initialGameState.player2id,
                      props.initialGameState.player3id
                    ]}
                    playerUsernames={playerUsernames}
                    currentlyActingPlayerIndex={getCurrentlyActingPlayerIndex()}
                />
                <GroupChat
                    refactoredStyle={{gridRow: 1}}
                    type={'game'}
                    environmentId={gameId}
                    client={stompClient}
                    myId={myId}
                    myUsername={playerUsernames[myIndex]}
                />
                <div className={'game-information-wrapper'}>
                  <div className={'game-information__inner-wrapper-root'}>
                    <div className={'game-information__current-mode-header'}>
                      <div className={'current-mode__title-wrapper'}>
                        <div>
                          current mode:
                        </div>
                        <div>
                          <img
                            style={{background: 'rgba(240,240,240,0.8)'}}
                            className={'user-avatar-style'}
                            src={currentIngameMode.value}
                            alt={questionmark}
                          />
                        </div>
                      </div>
                      <div className={'current-mode__mode-declaration'}>
                        {currentIngameMode.text}
                      </div>
                    </div>
                    <div className={'game-information__score-body'}>
                     <div className={'score-title'}>
                       team points
                     </div>
                      <div className={'team-score-wrapper'}>
                        <div className={'team-score-column'}>
                          <div className={'team-declaration-title'}>
                            your team
                          </div>
                          <div className={'team-points-entry'}>
                            {myIndex % 2 === 0 ? pointsTeam0_2 : pointsTeam1_3}
                          </div>
                        </div>
                        <div className={'team-score-column'}>
                          <div className={'team-declaration-title'}>
                            opponent
                          </div>
                          <div className={'team-points-entry'}>
                            {myIndex % 2 === 1 ? pointsTeam0_2 : pointsTeam1_3}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            : <></>}
        <UserList onMountOpen={false}/>
      </BackgroundContainer>
  );
}

export default GamePlus;


















