import React, { Component } from 'react';
import PlayingCardsList from "./PlayingCard/Hand/PlayingCard/PlayingCardsList";
import Hand from "./PlayingCard/Hand/Hand";
import PlayingCard from "./PlayingCard/Hand/PlayingCard/PlayingCard";
import './css/init.css';


const parseCardToImageString = card => {
  let result;

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

    return result.concat(`${card.suit.toLowerCase()}s`)
  }
}


class InitDistribution extends Component {
  constructor() {
    super();
    this.used = {};
    this.allCards = this.randomHand(36);

    this.state = {
      currentlyInPlay : {
        playerA: "flipped", 
        playerB: "flipped", 
        playerC: "flipped", 
        playerD: "flipped",
      },
      hands: {
        playerA: this.allCards.slice(0, 9), 
        playerB: this.allCards.slice(9, 18), 
        playerC: this.allCards.slice(18, 27), 
        playerD: this.allCards.slice(27, 36),
      }
    };

    this.refPlayArea = React.createRef();
    this.refASpot = React.createRef();
    this.refBSpot = React.createRef();
    this.refCSpot = React.createRef();
    this.refDSpot = React.createRef();
    this.getPlayAreaBounds = this.getPlayAreaBounds.bind(this);
  }

  randomHand = (size) => {
    var cardList = Object.keys(PlayingCardsList);
    var hand = [];
    var used = this.used;
    for(var i = 0; i < size; i++) {
      var card = Math.floor(Math.random()*Object.keys(PlayingCardsList).length);
      // console.log("card: ", card);
      while(used[card] || cardList[card] == 'flipped') {
        card = Math.floor(Math.random()*Object.keys(PlayingCardsList).length);
      }
      used[card] =  true;
      hand.push(cardList[card]);
    }
    this.used = used;

    return hand;
  };

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
        playerB: this.state.currentlyInPlay.playerB, 
        playerC: this.state.currentlyInPlay.playerC, 
        playerD: this.state.currentlyInPlay.playerD,
      },
      hands: {
        playerA: current_cards, 
        playerB: this.state.hands.playerB, 
        playerC: this.state.hands.playerC, 
        playerD: this.state.hands.playerD,
      }
    });
  }

  render() {
    return (
        <div className="initContainer">
          <div className="playerA">
            <Hand 
              hide={false} 
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
