import React, {useState, useEffect, useRef, useLayoutEffect} from 'react';
import styled from 'styled-components';
import './Hand.css';
import PlayingCard from './PlayingCard/PlayingCard';
import PlayingCardPlus from "./PlayingCard/PlayingCardPlus";
import PlayingCardSpread from "./PlayingCard/PlayingCardSpread";


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


const HandSpread = props => {
  const cardContainerRef = useRef(null);
  const [layoutStyle, setLayoutStyle] = useState({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    paddingTop: `${props.maxDimension * 0.15}px`});

  useLayoutEffect(() => {
    const setDimensions = () => {
      const width = props?.parentXY?.clientHeight;
      const height = props?.parentXY?.clientWidth;
      switch (props.layout) {
        case 'horizontal-lr':
          setLayoutStyle({
            ...layoutStyle,
            width: '100%',
            height: '100%'
          });
          break;
        case 'vertical-bt':
          setLayoutStyle({
            ...layoutStyle,
            width: width,
            height: height,
            left: -width/2,
            top: '50%',
            transform: `translateX(${height/2}px) translateY(-50%) rotateZ(-90deg)`,
          });
          break;
        case 'horizontal-rl':
          setLayoutStyle({
            ...layoutStyle,
            width: '100%',
            height: '100%',
            transform: 'rotateZ(180deg)'
          });
          break;
        case 'vertical-tb':
          setLayoutStyle({
            ...layoutStyle,
            width: width,
            height: height,
            left: -width/2,
            top: '50%',
            transform: `translateX(${height/2}px) translateY(-50%) rotateZ(90deg)`,
          });
          break;
        default:
          setLayoutStyle({
            ...layoutStyle,
            display: 'none'
          });
      }
    }
    setDimensions();

    window.addEventListener('resize', setDimensions);
    return () => window.removeEventListener('resize', setDimensions);
  }, [props.parentXY, props.maxDimension])

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
            if (card === calcHigherCard(card, highestCardOnTable)) {
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
      <div style={layoutStyle}>
        <div
          className={'hand-cards-wrapper'}
          style={{height: props.opponent ? 0.7*props.maxDimension : '90%'}}
          ref={cardContainerRef}
        >
          {!!cardContainerRef.current && props.cards.map((card, index) =>
              <PlayingCardSpread
                  key={index}
                  handlePlacingCard={c => props.handlePlacingCard(c)}
                  disabled={props.disabled || !isCardLegalToPlay(card)}
                  playArea={props.playArea}
                  card={card}
                  index={index}
                  numCards={props.cards.length}
                  handWidth={cardContainerRef.current}
                  opponent={props.opponent}
                  dragCardDims={props.dragCardDims}
              />
          )}
        </div>
      </div>
  );

}

export default HandSpread;