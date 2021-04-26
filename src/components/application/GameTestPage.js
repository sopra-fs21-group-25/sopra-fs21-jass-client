import React from 'react';
import {withRouter} from "react-router-dom";
import {BackgroundContainer, JassboardContainer, TextContainer, InnerContainer, Container, CheckboxContainerColumn, CheckboxContainerRow} from "../../helpers/layout";

import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
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

const optionsIngameModes = [
  { value: 'acorn', label: <div><img src={acorn} height={'20px'} width={'20px'} margin={'5px'}/>Acorn</div> },
  { value: 'rose', label: <div><img src={rose} height={'20px'} width={'20px'}/>Rose</div> },
  { value: 'bell', label: <div><img src={bell} height={'20px'} width={'20px'}/>Bell</div> },
  { value: 'shield', label: <div><img src={shield} height={'20px'} width={'20px'}/>Shield</div> },
  { value: 'undenufe', label: <div><img src={undenufe} height={'20px'} width={'20px'}/>Undenufe</div> },
  { value: 'obenabe', label: <div><img src={obenabe} height={'20px'} width={'20px'}/>Obenabe</div> },
  { value: 'slalom', label: <div><img src={slalom} height={'20px'} width={'20px'}/>Slalom</div> },
  { value: 'gusti', label: <div><img src={gusti} height={'20px'} width={'20px'}/>Gusti</div> },
  { value: 'mary', label: <div><img src={mary} height={'20px'} width={'20px'}/>Mary</div> }
];


class GameTestPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      gameModes: [{text :'acorn', value: acorn}, {text: 'rose', value: rose}]
    };
    this.handleClickToOpen = this.handleClickToOpen.bind(this);
    this.handleToClose = this.handleToClose.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }  

  handleClickToOpen(){
    this.setState({open: true});
  }
    
  handleToClose(){
    this.setState({open: false});
  }

  handleListItemClick(value){
    this.setState({open: false});
  };

  render() {
    return (
      <div stlye={{}}>
      <h4>How to create Dialog Box in ReactJS?</h4>
      <Button variant="outlined" color="primary" 
              onClick={this.handleClickToOpen}>
        Open Demo Dialog
      </Button>
      <Dialog open={this.state.open} onClose={this.handleToClose}>
        <DialogTitle>{"Please choose in-game mode"}</DialogTitle>
        <List>
          {this.state.gameModes.map((gameMode) => (
            <ListItem button onClick={() => this.handleListItemClick(gameMode)} key={gameMode.text}>
              <div><img src={gameMode.value} height={'20px'} width={'20px'} margin={'5px'}/></div>
              <ListItemText primary={gameMode.text} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
    )
  }

}

export default withRouter(GameTestPage);