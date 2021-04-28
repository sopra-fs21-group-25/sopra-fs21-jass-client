import React, { Component } from 'react';
import PlayingCardsList from "./PlayingCard/Hand/PlayingCard/PlayingCardsList";
import Hand from "./PlayingCard/Hand/Hand";

import './css/init.css';

class InitDistribution extends Component {
  constructor() {
    super();
    // this.state = {
    //   layout: "spread",
    //   handSize: "9" 
    // }
    this.used = {}
    this.hand = this.randomHand("36");
  }

  randomHand = (size) => {
    var cardList = Object.keys(PlayingCardsList);
    var hand = [];
    var used = this.used;
    for(var i = 0; i < size; i++) {
      var card = Math.floor(Math.random()*Object.keys(PlayingCardsList).length);
      console.log("card: ", card);
      while(used[card] || cardList[card] == 'flipped') {
        card = Math.floor(Math.random()*Object.keys(PlayingCardsList).length);
      }
      used[card] =  true;
      hand.push(cardList[card]);
    }
    this.used = used;
    return hand;
  };

  render() {
    return (
        <div className="initContainer">
          <div className="playerA">
            <Hand hide={false} layout={"spread"} cards={this.hand.slice(0, 9)} cardSize={ 100 }/>
          </div>
          
          <div className="playerB">
            <Hand hide={true} layout={"spread"} cards={this.hand.slice(9, 18)} cardSize={ 100 }/>          
          </div>
          
          <div className="playerC">
            <Hand hide={true} layout={"spread"} cards={this.hand.slice(18, 27)} cardSize={ 100 }/>
          </div>
          
          <div className="playerD">
            <Hand hide={true} layout={"spread"} cards={this.hand.slice(27, 36)} cardSize={ 100 }/> 
          </div>

          <div className="actionContainer">
          </div>
        </div>
    );
  }
}

export default InitDistribution;
