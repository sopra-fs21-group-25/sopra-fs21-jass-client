import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import './Hand.css';
import PlayingCard from './PlayingCard/PlayingCard';
import PlayingCardPlus from "./PlayingCard/PlayingCardPlus";


const HandContainer = styled.div`
  height: ${props => props?.layout === 'stack' ? props?.cardSize : props?.cardSize * 2};
  & div {
    position: absolute;
  };
`;

const calcHigherCardHighToLow = (card, other) => {
  switch(card.rank) {
    case 'SIX':
      return other;
    case 'SEVEN':
      return other.rank === 'SIX' ? card : other;
    case 'EIGHT':
      return ['SIX', 'SEVEN'].includes(other.rank) ? card : other;
    case 'NINE':
      return ['SIX', 'SEVEN', 'EIGHT'].includes(other.rank) ? card : other;
    case 'TEN':
      return ['SIX', 'SEVEN', 'EIGHT', 'NINE'].includes(other.rank) ? card : other;
    case 'UNDER':
      return ['SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN'].includes(other.rank) ? card : other;
    case 'OBER':
      return ['SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'UNDER'].includes(other.rank) ? card : other;
    case 'KING':
      return ['SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'UNDER', 'OBER'].includes(other.rank) ? card : other;
    case 'ACE':
      return ['SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'UNDER', 'OBER', 'KING'].includes(other.rank) ? card : other;
  }
}
const calcHigherCard = (card, other) => {
  if(card.imageString === 'hide') {
    return other;
  }
  if(other.imageString === 'hide') {
    return card;
  }

  if(!card.isTrumpf && other.isTrumpf) {
    return other;
  } else if(card.isTrumpf && !other.isTrumpf) {
    return card;
  } else if(!card.isTrumpf && ! !other.isTrumpf) {
    return calcHigherCardHighToLow(card, other);
  } else {
    if(card.rank === 'UNDER') {
      return card;
    } else if(card.rank === 'NINE') {
      return other.rank === 'UNDER' ? other : card;
    } else if(other.rank === 'UNDER' || other.rank === 'NINE') {
      return other;
    } else {
      return calcHigherCardHighToLow(card, other);
    }
  }
}


const HandPlus = props => {

  const cardStyleParams = useRef({
    initialOver: 0,
    over: 0,
    curl: 0,
    deg: 0,
    degs: 0,
    initialDown: 0,
    down: 0,
    handLength: props.cards.length
  });


  const resetStack = () => {
    cardStyleParams.current.over = 50;
  }
  const stackStyle = num => {
    if (num > 0) {
      cardStyleParams.current.over -= 20 / cardStyleParams.current.handLength;
    }
    return {
      zIndex: num,
      transform: `translateX(${(cardStyleParams.current.over * -1)}%)`
    }
  }

  const resetSpread = () => {
    cardStyleParams.current.initialOver = 110 * (cardStyleParams.current.handLength - 1);
    cardStyleParams.current.over = cardStyleParams.current.initialOver / 2;
  }
  const spreadStyle = num => {
    if (num > 0) {
      cardStyleParams.current.over -= cardStyleParams.current.initialOver / (cardStyleParams.current.handLength - 1);
    }
    return {
      zIndex: num,
      transform: `translateX(${(-50 + cardStyleParams.current.over * -1)}%)`
    }
  }

  const resetFanning = () => {
    cardStyleParams.current.curl = Math.pow(cardStyleParams.current.handLength, 1.30) * 10;
    cardStyleParams.current.deg = props.cards.length > 1 ? -15 * cardStyleParams.current.handLength : 0;
    cardStyleParams.current.degs = cardStyleParams.current.deg / 2;
    cardStyleParams.current.initialDown = cardStyleParams.current.handLength * 7;
    cardStyleParams.current.down = cardStyleParams.current.initialDown / 2;
    cardStyleParams.current.initialOver = cardStyleParams.current.curl;
    cardStyleParams.current.over = cardStyleParams.current.initialOver / 2;
  }
  const fanStyle = num => {
    let overHalf = num > (cardStyleParams.current.handLength - 1) / 2;

    if (num > 0) {
      cardStyleParams.current.degs -= cardStyleParams.current.deg / (cardStyleParams.current.handLength - 1);
      cardStyleParams.current.down -= cardStyleParams.current.initialDown / (cardStyleParams.current.handLength - 1);
      cardStyleParams.current.over -= cardStyleParams.current.initialOver / (cardStyleParams.current.handLength - 1);
    }
    return {
      zIndex: num,
      transform: `translateY(${(overHalf ? -cardStyleParams.current.down : cardStyleParams.current.down)}%) 
      translateX(${(-50 + cardStyleParams.current.over * -1)}%) 
      rotate(${cardStyleParams.current.degs}deg)`
    }
  }


  const resetStyle = () => {
    if (props.layout === 'fan') {
      return resetFanning();
    } else if (props.layout === 'spread') {
      return resetSpread();
    } else {
      return resetStack();
    }
  }

  const getStyleType = num => {
    if (props.layout === 'fan') {
      return fanStyle(num);
    } else if (props.layout === 'spread') {
      return spreadStyle(num);
    } else {
      return stackStyle(num);
    }
  }

  const isCardLegalToPlay = card => {
    if (Object.values(props.cardsPlayed).every(c => c.imageString === 'hide')) {
      // no cards played yet, if I start, then every card is legal to play
      return true;
    } else if (Object.values(props.cardsPlayed).every(c => c.imageString !== 'hide')) {
      // all cards played already, the trick has finished and no card is legal to play
      return false;
    } else {

      // Under of trump color is always allowed to be played
      if (card.isTrumpf && card.rank === 'UNDER') {
        return true;
      }

      // the trick is running, hence I must determine which card was the starting one
      let trickStartingCard;
      if (props.cardsPlayed.playerB.imageString !== 'hide') {
        trickStartingCard = props.cardsPlayed.playerB;
      } else if (props.cardsPlayed.playerC.imageString !== 'hide') {
        trickStartingCard = props.cardsPlayed.playerC;
      } else {
        trickStartingCard = props.cardsPlayed.playerD;
      }


      if (trickStartingCard.suit === card.suit) {
        return true;
      } else {
        // I attempt to not serve the suit that's been dealt

        if (!card.isTrumpf) {
          for (let c of props.cards) {
            if (c.suit === trickStartingCard.suit && !(c.isTrumpf && c.rank === 'UNDER')) {
              return false;
            }
          }
          return true;
        } else {
          let highestCardOnTable = {imageString: 'hide'};
          for (let c of Object.values(props.cardsPlayed)) {
            highestCardOnTable = calcHigherCard(c, highestCardOnTable);
          }
          if (highestCardOnTable.isTrumpf) {
            if (card == calcHigherCard(card, highestCardOnTable)) {
              return true;
            } else {
              for (let c of props.cards) {
                if (!c.isTrumpf) {
                  return false;
                }
              }
              return true;
            }
          } else {
            return true;
          }
        }
      }
    }
  }


  return (
      <HandContainer layout={props.layout} cardSize={props.cardSize}>
        {props.layout ? resetStyle(props.layout) : <></>}
        {props.cards.map((card, index) =>
            <PlayingCardPlus
                key={index}
                handlePlacingCard={c => props.handlePlacingCard(c)}
                disabled={props.disabled || !isCardLegalToPlay(card)}
                playArea={props.playArea}
                height={props.cardSize}
                card={card}
                elevateOnClick={50}
                style={getStyleType(index)}
            />
        )
        }
      </HandContainer>
  );

}

export default HandPlus;