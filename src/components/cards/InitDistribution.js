import React, { Component } from 'react';
import PlayingCardsList from "./PlayingCard/Hand/PlayingCard/PlayingCardsList";
import Hand from "./PlayingCard/Hand/Hand";
import PlayingCard from "./PlayingCard/Hand/PlayingCard/PlayingCard";
import './css/init.css';


const parseCardToImageString = card => {
  let result = '';

  switch(card.rank) {
    case 'SIX': {
      result = '6';
      break;
    };
    case 'SEVEN': {
      result = '7';
      break;
    };
    case 'EIGHT': {
      result = '8';
      break;
    };
    case 'NINE': {
      result = '9';
      break;
    };
    case 'TEN': {
      result = 'banner';
      break;
    };
    case 'UNDER': {
      result = 'under';
      break;
    };
    case 'OBER': {
      result = 'ober';
      break;
    };
    case 'KING': {
      result = 'konig';
      break;
    };
    case 'ACE': {
      result = 'as';
      break;
    };
  }
  return result.concat(`${card.suit.toLowerCase()}s`)
}


class InitDistribution extends Component {
  constructor(props) {
    super(props);
    this.used = {};

    this.state = {
      currentPlayerSit: null,
      currentlyInPlay : {
        playerA: "flipped", 
        playerB: "flipped", 
        playerC: "flipped", 
        playerD: "flipped",
      },
      hands: {
        playerA: this.props.gameState.cardsOfPlayer.map(x => parseCardToImageString(x)), 
        playerB: Array(9).fill('flipped'), 
        playerC: Array(9).fill('flipped'), 
        playerD: Array(9).fill('flipped'),
      },
      gameState: this.props.gameState,
      cardsMapping: Object.fromEntries(this.props.gameState.cardsOfPlayer.map(x => [parseCardToImageString(x), x])),
      myTurn: false,
      myIndex: this.props.myIndex,
      prevProps: {},
    };

    this.refPlayArea = React.createRef();
    this.refASpot = React.createRef();
    this.refBSpot = React.createRef();
    this.refCSpot = React.createRef();
    this.refDSpot = React.createRef();
    this.getPlayAreaBounds = this.getPlayAreaBounds.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    if (prevProps.gameState !== props.gameState || prevProps.myIndex !== props.myIndex) {
      return {
        gameState: props.gameState,
        myIndex: props.myIndex,
        prevProps: props
      }
    }
    return {
        prevProps: props
    }
  }

  componentDidMount() {
    if (this.state.gameState.cardsPlayed[(this.state.myIndex + 3) % 4] || this.state.gameState.playerStartsTrick[this.state.myIndex]) {
      this.setState({myTurn: true});
    }

    this.setState({
      currentlyInPlay: {
        playerA: this.state.gameState.cardsPlayed[this.state.myIndex] ? parseCardToImageString(this.state.gameState.cardsPlayed[this.state.myIndex]) : 'flipped', 
        playerB: this.state.gameState.cardsPlayed[(this.state.myIndex + 1) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 1) % 4]) : 'flipped', 
        playerC: this.state.gameState.cardsPlayed[(this.state.myIndex + 2) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 2) % 4]) : 'flipped', 
        playerD: this.state.gameState.cardsPlayed[(this.state.myIndex + 3) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 3) % 4]) : 'flipped',
      }
    }, () => {
      if (this.state.currentlyInPlay.playerA != 'flipped') {
        this.refASpot.current.style.display = "flex";
      }
      if (this.state.currentlyInPlay.playerB != 'flipped') {
        this.refBSpot.current.style.display = "flex";
      }
      if (this.state.currentlyInPlay.playerC != 'flipped') {
        this.refCSpot.current.style.display = "flex";
      }
      if (this.state.currentlyInPlay.playerC != 'flipped') {
        this.refCSpot.current.style.display = "flex";
      }
    });
  }

  getPlayAreaBounds = () => {
    const playArea = this.refPlayArea.current;
    const bounds =  playArea.getBoundingClientRect();
    return {x1: bounds.top, y1: bounds.left, x2: bounds.bottom, y2: bounds.right}
  }

  handlePlacingCard(key) {
    var current_cards = [...this.state.hands.playerA];
    var delete_idx = current_cards.indexOf(key);
    current_cards.splice(delete_idx, 1);

    this.refASpot.current.style.display = "flex";
    this.setState({
      currentlyInPlay: {
        playerA: key, 
        playerB: this.state.gameState.cardsPlayed[(this.state.myIndex + 1) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 1) % 4]) : 'flipped', 
        playerC: this.state.gameState.cardsPlayed[(this.state.myIndex + 2) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 2) % 4]) : 'flipped', 
        playerD: this.state.gameState.cardsPlayed[(this.state.myIndex + 3) % 4] ? parseCardToImageString(this.state.gameState.cardsPlayed[(this.state.myIndex + 3) % 4]) : 'flipped',
      },
      hands: {
        playerA: current_cards, 
        playerB: this.state.hands.playerB, 
        playerC: this.state.hands.playerC, 
        playerD: this.state.hands.playerD,
      },
      myTurn: false,
    });
    this.props.updateGameState(this.state.cardsMapping[key]);
  }

  render() {
    return (
        <div className="initContainer">
          <div className="playerA">
            <Hand 
              hide={false}
              disabled={!this.state.myTurn}
              layout={"spread"} 
              playArea={this.getPlayAreaBounds}
              handlePlacingCard={this.handlePlacingCard.bind(this)} 
              cards={this.state.hands.playerA} 
              cardSize={ 100 }/>
          </div>
          
          <div className="playerB">
            <Hand hide={true} disabled={true} layout={"spread"} cards={this.state.hands.playerB} cardSize={ 100 }/>          
          </div>
          
          <div className="playerC">
            <Hand hide={true} disabled={true} layout={"spread"} cards={this.state.hands.playerC} cardSize={ 100 }/>
          </div>
          
          <div className="playerD">
            <Hand hide={true} disabled={true} layout={"spread"} cards={this.state.hands.playerD} cardSize={ 100 }/> 
          </div>

          <div className="actionContainer">
            <div className="actionChildContainer" ref={this.refPlayArea}>
              <div className="playerAcardSpot" ref={this.refASpot}>
                <PlayingCard
                  key={"playerA"}
                  disabled={true}
                  height={100}
                  card={this.state.currentlyInPlay.playerA}
                  elevateOnClick={50}
                />
              </div>
              <div className="playerCcardSpot" ref={this.refCSpot}>
                <PlayingCard
                  key={"playerC"}
                  disabled={true}
                  height={100}
                  card={this.state.currentlyInPlay.playerC}
                  elevateOnClick={50}
                />
              </div>
              <div className="playerBcardSpot" ref={this.refBSpot}>
                <PlayingCard
                  key={"playerB"}
                  disabled={true}
                  height={100}
                  card={this.state.currentlyInPlay.playerB}
                  elevateOnClick={50}
                />
              </div>
              <div className="playerDcardSpot" ref={this.refDSpot}>
                <PlayingCard
                  key={"playerD"}
                  disabled={true}
                  height={100}
                  card={this.state.currentlyInPlay.playerD}
                  elevateOnClick={50}
                />
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default InitDistribution;
