import '../cards/index.css';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import InitDistribution from '../cards/InitDistribution';

import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';

import acorn from "../../views/images/icons/acorn.png";
import rose from "../../views/images/icons/rose.png";
import bell from "../../views/images/icons/bell.png";
import shield from "../../views/images/icons/shield.png";
import undenufe from "../../views/images/icons/undenufe.png";
import obenabe from "../../views/images/icons/obenabe.png";
import slalom from "../../views/images/icons/slalom.png";
import gusti from "../../views/images/icons/gusti.png";
import mary from "../../views/images/icons/mary.png";
import ModalHeader from 'react-bootstrap/esm/ModalHeader';

import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {useStompClient, useSubscription} from 'react-stomp-hooks';

const Container = styled(BaseContainer)`
  color: #ffffff;
  text-align: center;
`;

const CurrentModeContainer = styled(BaseContainer)`
  position: absolute;
  width: 100px;
  height: 200px;
  right: 50px,
  top: 20px,
  background-color: white;
  border-radius: 50%;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const Game = (props) => {
    const gameId = useLocation().state.id; 
    const [gameState, setGameState] = useState(useLocation().state); 
    const [ingameModes, setIngameModes] = useState(useLocation().state.ingameModes); 
    const [startOfRound, setStartOfRound] = useState(true);
    const [openModePopUp, setOpenModePopUp] = useState(false);
    const [currentActingPlayer, setCurrentActingPlayer] = useState(useLocation().state.idOfRoundStartingPlayer);
    const [currentInGameMode, setCurrentInGameMode] = useState({text: "", value: null});
    const user = JSON.parse(sessionStorage.getItem('user'));
    const stompClient = useStompClient();
    const history = useHistory(); 

  const handleClickToOpen = () => {
    setOpenModePopUp(true);
  }
    
  const handleToClose = () => {
    setOpenModePopUp(false);
  }

  const handleListItemClick = async (value) => {
    setOpenModePopUp(false);
    setCurrentInGameMode(value);
    var requestBody = {}; 
    requestBody.ingameMode = value.text.substring(0, value.text.indexOf(" ")); 
    requestBody.userId = user.id; 
    console.log(requestBody);
    var response = await api.put(`/games/${gameId}`, JSON.stringify(requestBody));
    stompClient.publish({
      destination: `/app/games/${gameId}/fetch`, 
      body: null
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    history.push('/login');
  }

  const startRoundPlayer = () => {
    if (JSON.parse(sessionStorage.getItem('user')).id === currentActingPlayer){
      handleClickToOpen();
      setStartOfRound (false);
    }
  }

  const setGameModes = () => {
    var ingameModes_converted = []; 
    var modes = ingameModes;
    for (var ingameMode in modes){
      var mode = {}; 
      mode.text = modes[ingameMode].ingameMode + " " + modes[ingameMode].multiplicator; 
      switch(modes[ingameMode].ingameMode){
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
      }
      ingameModes_converted.push(mode); 
    }

    return ingameModes_converted; 
  }

  const setAttrValues = async (modes) =>{
    var response = await api.get(`/games/${gameId}/${user.id}`);
    if(response.data.currentIngameMode){
        var mode = modes.find((element, index, array) => {
          return element.text.includes(response.data.currentIngameMode);
        });
        setCurrentInGameMode(mode); 
    }
    setCurrentActingPlayer(response.data.idOfRoundStartingPlayer)
    var trickToPlay = response.data.trickToPlay;
    var hasTrickStarted = response.data.hasTrickStarted; 
    if ((trickToPlay == 0) && (!hasTrickStarted)){
      setStartOfRound(true); 
      startRoundPlayer();
    } else {
      setStartOfRound(false);
    }
  }

  useEffect(async () => {
    var modes = setGameModes();
    setIngameModes(modes);
    await setAttrValues(modes); 
  }, []);

  useSubscription(`/games/${gameId}/fetch`, async msg => {
    await setAttrValues(ingameModes); 
  });

    return (
      <BackgroundContainer>
        <Dialog open={openModePopUp} onClose={handleToClose}>
           <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
           <List>
             {ingameModes.map((gameMode, index) => (
               <ListItem button onClick={() => handleListItemClick(gameMode)} key={index}>
                 <div><img src={gameMode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
                 <ListItemText primary={gameMode.text} />

               </ListItem>
             ))}
            </List>
          </Dialog>
          <InitDistribution />
          <CurrentModeContainer>
          <Label>
              Current Mode: 
              <div><img src={currentInGameMode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
              <input disabled = {true} type="text" value={currentInGameMode.text} />
          </Label>
        </CurrentModeContainer>
      </BackgroundContainer>
    );
}
export default withRouter(Game);
