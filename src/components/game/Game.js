import React from 'react';
import '../cards/index.css';
import styled from 'styled-components';
import { BackgroundContainer, BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
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

import SockJS from "sockjs-client"
import * as Stomp from 'stompjs';

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

class Game extends React.Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   users: null, 
    //   openModePopUp: false,
    //   gameModes: [], 
    //   currentPlayer: null,  
    //   startOfRound: true, 
    //   user: null, 
    //   currentGameMode: {suit: null, value: null}, 
    //   lobbyId: 'ff5a8b43-edce-4acd-9b17-cb670c853f91'
    // };
    this.state = this.props.location.state.gameInfo; 
    this.state.startOfRound = true;
    this.state.openModePopUp = false;
    this.state.currentActingPlayer = this.state.usersInLobby[this.getRandomInt(4)];
    this.state.currentInGameMode = {text: "", value: ""};
    this.handleClickToOpen = this.handleClickToOpen.bind(this);
    this.handleToClose = this.handleToClose.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.state.userName = JSON.parse(localStorage.getItem('user')).username;
    this.stompClient = this.props.location.state.stompClient;
  }  
  
  connect() {
    var socket = new SockJS('/games');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, function (frame) {
      this.stompClient.subscribe(`/games/${this.state.id}/currentMode`, function (currentMode) {
        this.setState({currentInGameMode: currentMode});
      });
    });
   }

  sendCurrentMode() {
    //stompClient.send(`/games/${this.state.id}/currentMode`, {}, this.state.currentInGameMode);
    this.stompClient.publish({
      destination: `/app/lobbies/${this.state.thisLobby.id}/table`,
      body: this.state.currentInGameMode
    });
   }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  async endRound() {
    await this.setState({startOfRound: true});
  }

  async endTurn(){
    var id_of_player = this.state.usersInLobby.indexOf(this.state.currentActingPlayer);
    this.state.currentActingPlayer = this.state.usersInLobby[(id_of_player + 1) % 4];
  }
  
  setCurrentActingPlayer(player){
    this.setState({currentActingPlayer: player});
  }

  handleClickToOpen(){
    this.setState({openModePopUp: true});
  }
    
  handleToClose(){
    this.setState({openModePopUp: false});
  }

  handleListItemClick(value){
    this.setState({openModePopUp: false, currentInGameMode: value});
  };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.history.push('/login');
  }

  startRoundPlayer(){
    if (this.state.startOfRound && (this.state.userName === this.state.currentActingPlayer)){
      this.handleClickToOpen();
      this.setState({startOfRound: false});
    }
  }

  setGameModes(){
    var ingameModes_converted = []; 
    //var response = await api.get(`/lobbies/${this.state.lobbyId}`);
    var modes = this.state.ingameModes;
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
  async componentWillMount(){  
  }

  async componentDidMount() {
    this.connect();
    var modes = this.setGameModes();
    this.setState({ingameModes: modes});
    this.setState({user: JSON.parse(localStorage.getItem('user'))}, async function () {
      console.log(localStorage.getItem('user'));
      this.startRoundPlayer();
    });
  }

  render() {
    return (
      <BackgroundContainer>
        <Dialog open={this.state.openModePopUp} onClose={this.handleToClose}>
           <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
           <List>
             {this.state.ingameModes.map((gameMode) => (
               <ListItem button onClick={() => this.handleListItemClick(gameMode)} key={gameMode.text}>
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
              <div><img src={this.state.currentInGameMode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
              <input disabled = "true" type="text" value={this.state.currentInGameMode.text} />
          </Label>
        </CurrentModeContainer>
      </BackgroundContainer>
    );
  }
}

export default withRouter(Game);
