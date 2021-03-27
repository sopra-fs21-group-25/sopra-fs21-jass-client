import { SUITS, RANKS } from './assets';

class Deck {
  constructor() {
    this.cards = [];
  }



  initialize() {
    let suits = Object.values(SUITS);
    let ranks = Object.values(RANKS);

    console.log(suits);
    console.log(ranks);

    this.cards = suits.map(suit => ranks.map(rank => [suit,rank])).reduce((acc, next) => acc.concat(next));

    console.log(this.cards);
  }

  shuffle() {

  }


}

export default Deck;