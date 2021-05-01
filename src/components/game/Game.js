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
  const dummyGame = JSON.parse({
      "id": "723379bb-b79f-455c-b489-ca05b9c08c28",
      "player0id": "7ed67864-91d8-4ddb-902a-4cf146135e48",
      "player1id": "c7b4b8af-66eb-4194-be32-523e500245d0",
      "player2id": "6a744346-d20a-4e2b-82b2-ae8985f0ddb2",
      "player3id": "5fb2010f-a6cd-47c3-9467-955b3a65ff94",
      "pointsToWin": 2500,
      "ingameModes": [
        {
          "ingameMode": "ACORN",
          "multiplicator": 1
        },
        {
          "ingameMode": "ROSE",
          "multiplicator": 1
        },
        {
          "ingameMode": "BELL",
          "multiplicator": 1
        },
        {
          "ingameMode": "SHIELD",
          "multiplicator": 1
        },
        {
          "ingameMode": "UNDENUFE",
          "multiplicator": 1
        },
        {
          "ingameMode": "OBENABE",
          "multiplicator": 1
        }
      ],
      "weisAllowed": false,
      "crossWeisAllowed": false,
      "weisAsk": null,
      "pointsTeam0_2": 0,
      "pointsTeam1_3": 0,
      "trickToPlay": 0,
      "playerStartsTrick": [
        true,
        false,
        false,
        false
      ],
      "cardsPlayed": [
        null,
        null,
        null,
        null
      ],
      "hasTrickStarted": false,
      "idOfRoundStartingPlayer": "7ed67864-91d8-4ddb-902a-4cf146135e48",
      "currentIngameMode": null,
      "cardsOfPlayer": [
        {
          "suit": "BELL",
          "rank": "EIGHT",
          "trumpf": false
        },
        {
          "suit": "BELL",
          "rank": "SEVEN",
          "trumpf": false
        },
        {
          "suit": "SHIELD",
          "rank": "ACE",
          "trumpf": false
        },
        {
          "suit": "BELL",
          "rank": "TEN",
          "trumpf": false
        },
        {
          "suit": "ACORN",
          "rank": "SEVEN",
          "trumpf": false
        },
        {
          "suit": "SHIELD",
          "rank": "NINE",
          "trumpf": false
        },
        {
          "suit": "ROSE",
          "rank": "SEVEN",
          "trumpf": false
        },
        {
          "suit": "ROSE",
          "rank": "TEN",
          "trumpf": false
        },
        {
          "suit": "BELL",
          "rank": "UNDER",
          "trumpf": false
        }
      ]
    });

  const myId = JSON.parse(sessionStorage.getItem('user')).id;
  const player0id = useLocation().state.player0id;
  const player1id = useLocation().state.player1id;
  const player2id = useLocation().state.player2id;
  const player3id = useLocation().state.player3id;
  const [myIndex, setMyIndex] = useState(null);

  const [ingameModes, setIngameModes] = useState(useLocation().state.ingameModes);
  const [startOfRound, setStartOfRound] = useState(true);
  const [openModePopUp, setOpenModePopUp] = useState(false);
  const [currentActingPlayer, setCurrentActingPlayer] = useState(useLocation().state.idOfRoundStartingPlayer);
  const [currentInGameMode, setCurrentInGameMode] = useState({text: "", value: ""});
  const stompClient = useStompClient();
  const history = useHistory();

  useEffect(() => {
    switch(myId) {
      case player0id: {
        setMyIndex(0);
        break;
      };
      case player1id: {
        setMyIndex(1);
        break;
      };
      case player2id: {
        setMyIndex(2);
        break;
      };
      case player3id: {
        setMyIndex(3);
        break;
      }
    }
  }, [])

  // connect() {
  //   var socket = new SockJS('/games');
  //   this.stompClient = Stomp.over(socket);
  //   this.stompClient.connect({}, function (frame) {
  //     this.stompClient.subscribe(`/games/${this.state.id}/currentMode`, function (currentMode) {
  //       this.setState({currentInGameMode: currentMode});
  //     });
  //   });
  //  }

  const sendCurrentMode = () => {
    //stompClient.send(`/games/${this.state.id}/currentMode`, {}, this.state.currentInGameMode);
    // stompClient.publish({
    //   destination: `/app/lobbies/${this.state.thisLobby.id}/table`,
    //   body: currentInGameMode
    // });
   }

  // getRandomInt(max) {
  //   return Math.floor(Math.random() * max);
  // }

  const endRound = () => {
    setStartOfRound(true); 
  }

  const endTurn = () => {
    // var id_of_player = state.usersInLobby.indexOf(state.currentActingPlayer);
    // this.state.currentActingPlayer = this.state.usersInLobby[(id_of_player + 1) % 4];
  }

  const handleClickToOpen = () => {
    setOpenModePopUp(true);
  }
    
  const handleToClose = () => {
    setOpenModePopUp(false);
  }

  const handleListItemClick = (value) => {
    setOpenModePopUp(false);
    setCurrentInGameMode(value);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    history.push('/login');
  }



  const startRoundPlayer = () => {
    if (startOfRound && (JSON.parse(sessionStorage.getItem('user')).id === currentActingPlayer)){
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

  useEffect(() => {
    var modes = setGameModes();
    setIngameModes(modes);
    startRoundPlayer();
  }, [])

    return (
      <BackgroundContainer>
        <Dialog open={openModePopUp} onClose={handleToClose}>
           <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
           <List>
             {ingameModes.map((gameMode) => (
               <ListItem key={gameMode.text} button onClick={() => handleListItemClick(gameMode)} key={gameMode.text}>
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
              <input disabled={true} type={"text"} value={currentInGameMode.text} />
          </Label>
        </CurrentModeContainer>
      </BackgroundContainer>
    );
}
export default withRouter(Game);
