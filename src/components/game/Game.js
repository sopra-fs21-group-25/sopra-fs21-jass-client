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

const Container = styled(BaseContainer)`
  color: #ffffff;
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

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null, 
      openModePopUp: false,
      gameModes: [], 
      currentPlayer: null,  
      startOfRound: true, 
      user: null, 
      currentGameMode: {suit: null, value: null}, 
      lobbyId: 'ac0735eb-b60d-44f8-b02a-0a4878659b92'
    };
    this.handleClickToOpen = this.handleClickToOpen.bind(this);
    this.handleToClose = this.handleToClose.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }  
 
  handleClickToOpen(){
    this.setState({openModePopUp: true});
  }
    
  handleToClose(){
    this.setState({openModePopUp: false});
  }

  handleListItemClick(value){
    this.setState({openModePopUp: false});
  };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.history.push('/login');
  }

  startRoundPlayer(){
    if (this.state.startOfRound){
      this.handleClickToOpen();
    }
  }

  async setGameModes(){
    var ingameModes = this.state.gameModes; 
    var response = await api.get(`/lobbies/${this.state.lobbyId}`);
    for (var ingameMode in response.data.ingameModes){
      var mode = {}; 
      mode.text = response.data.ingameModes[ingameMode].ingameMode + "        " + response.data.ingameModes[ingameMode].multiplicator; 
      switch(response.data.ingameModes[ingameMode].ingameMode){
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
      ingameModes.push(mode); 
    }

    return ingameModes; 
  }

  async componentDidMount() {
    var modes_1 = [{text :'acorn', value: acorn}, {text: 'rose', value: rose}];
    var modes = await this.setGameModes();
    this.setState({gameModes: modes});
    this.setState({user: JSON.parse(localStorage.getItem('user'))}, async function () {
      this.startRoundPlayer();
    });
  }

  render() {
    return (
      <BackgroundContainer>
        <Dialog open={this.state.openModePopUp} onClose={this.handleToClose}>
           <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
           <List>
             {this.state.gameModes.map((gameMode) => (
               <ListItem button onClick={() => this.handleListItemClick(gameMode)} key={gameMode.text}>
                 <div><img src={gameMode.value} height={'30px'} width={'40px'} margin={'5px'}/></div>
                 <ListItemText primary={gameMode.text} />

               </ListItem>
             ))}
            </List>
          </Dialog>
          <InitDistribution />
      </BackgroundContainer>
    );
  }
}

export default withRouter(Game);
