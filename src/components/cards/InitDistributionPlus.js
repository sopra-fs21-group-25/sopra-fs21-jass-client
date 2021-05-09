import React, {Component, createRef, useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import Hand from "./PlayingCard/Hand/Hand";
import PlayingCardPlus from "./PlayingCard/Hand/PlayingCard/PlayingCardPlus";
import { Button } from '../../views/design/Button';
import './css/init.css';
import HandPlus from "./PlayingCard/Hand/HandPlus";


const InitContainer = styled.div`
  display: grid;
  grid-template-columns: 10% 5% auto 5% 10%;
  grid-template-rows: 15% auto 15%;
  height: 100%;
  width: 100%;
`;

const PlayerHandsContainer = styled.div`
  grid-column: ${props => props.player === 'B' ? '5' : (props.player === 'D' ? '1' : '3')};
  grid-row: ${props => props.player === 'A' ? '3' : (props.player === 'C' ? '1' : '2')};
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    ${props => props.player === 'A' ?
            css`
              height: 70% !important;
            ` : props.player === 'B' ?
                    css`
                      -webkit-transform: rotate(90deg);
                      -moz-transform: rotate(90deg);
                      -o-transform: rotate(90deg);
                      -ms-transform: rotate(90deg);
                      transform: rotate(90deg);
                      height: 0px !important;
                    ` : props.player === 'C' ?
                            css`
                              height: 0px !important;
                            ` : 
                            css`
                              -webkit-transform: rotate(270deg);
                              -moz-transform: rotate(270deg);
                              -o-transform: rotate(270deg);
                              -ms-transform: rotate(270deg);
                              transform: rotate(270deg);
                              height: 0px !important;
                            `}
  };
`;

const PlayerCardSpot = styled.div`
  grid-column: ${props => props?.player === 'B' ? '3' : props?.player === 'D' ? '1' : '2'};
  grid-row: ${props => props.player === 'A' ? '3' : props.player === 'C' ? '1' : '2'};
  justify-content: ${props => props.player === 'B' ? 'flex-start' : props.player === 'D' ? 'flex-end' : 'center'};
  align-items: ${props => props.player === 'A' ? 'flex-start' : props.player === 'C' ? 'flex-end' : 'center'};
  display: none;
  & > div {
    ${props => props.player === 'A' ?
            css`` : props.player === 'B' ?
                    css`
                      -webkit-transform: rotate(90deg);
                      -moz-transform: rotate(90deg);
                      -o-transform: rotate(90deg);
                      -ms-transform: rotate(90deg);
                      transform: rotate(90deg) !important;
                    ` : props.player === 'C' ?
                            css`
                              margin-top: auto;
                            ` :
                            css`
                              -webkit-transform: rotate(90deg);
                              -moz-transform: rotate(90deg);
                              -o-transform: rotate(90deg);
                              -ms-transform: rotate(90deg);
                              transform: rotate(90deg) !important;
                            `}
  };
`;

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
  };
  return result.concat(`${card.suit.toLowerCase()}s`)
};



const InitDistributionPlus = props => {


  const [cardsInHands, setCardsInHands] = useState(null);
  const [cardsOnTable, setCardsOnTable] = useState(null);

  const [myTurn, setMyTurn] = useState(false);

  const refPlayArea = useRef(null);
  const playArea = useRef(null);
  const refASpot = useRef(null);
  const refBSpot = useRef(null);
  const refCSpot = useRef(null);
  const refDSpot = useRef(null);

  const myIndex = props.myIndex;


  const updateMyTurn = () => {
    const prevPlayerHasPlayed = !!props.cardsPlayed[(myIndex + 3) % 4];
    const meHaveNotPlayedYet = !props.cardsPlayed[myIndex];
    const meStartCurrentTrick = !!props.playerStartsTrick[myIndex];
    const trickNotFinishedYet = !!props.cardsPlayed.includes(null);

    if (trickNotFinishedYet && meHaveNotPlayedYet && (prevPlayerHasPlayed || meStartCurrentTrick)) {
      setMyTurn(true);
    } else {
      setMyTurn(false);
    }
  }

  const triggerNextTrick = () => {
    props.updateGameState(null, null);
  }

  const handlePlacingCard = card => {
    refASpot.current.style.display = 'flex';

    setMyTurn(false);

    const cardToBeNotifiedAbout = {...card};
    delete cardToBeNotifiedAbout.imageString;
    props.updateGameState(cardToBeNotifiedAbout, null);
  }

  useEffect(() => {
    playArea.current = refPlayArea.current.getBoundingClientRect();
  }, []);

  // update cardsOnTable
  useEffect(() => {
    // retrieve the actual cards played by each player from the current game state
    const cardA = props.cardsPlayed[myIndex];
    const cardB = props.cardsPlayed[(myIndex + 1) % 4];
    const cardC = props.cardsPlayed[(myIndex + 2) % 4];
    const cardD = props.cardsPlayed[(myIndex + 3) % 4];

    // set the cards on the table, where each card has an additional attribute
    // imageString to retrieve the correct card image
    setCardsOnTable({
      playerA: cardA ? {...cardA, imageString: parseCardToImageString(cardA)} : {imageString: 'hide'},
      playerB: cardB ? {...cardB, imageString: parseCardToImageString(cardB)} : {imageString: 'hide'},
      playerC: cardC ? {...cardC, imageString: parseCardToImageString(cardC)} : {imageString: 'hide'},
      playerD: cardD ? {...cardD, imageString: parseCardToImageString(cardD)} : {imageString: 'hide'},
    });

    setCardsInHands({
      playerA: props.cardsInHands.map(card => ({...card, imageString: parseCardToImageString(card)})),
      playerB: Array(9).fill({imageString: 'flipped'}),
      playerC: Array(9).fill({imageString: 'flipped'}),
      playerD: Array(9).fill({imageString: 'flipped'})
    });

    // update the refs to place the cards correctly
    if (cardA) { refASpot.current.style.display = 'flex'; }
    if (cardB) { refBSpot.current.style.display = 'flex'; }
    if (cardC) { refCSpot.current.style.display = 'flex'; }
    if (cardD) { refDSpot.current.style.display = 'flex'; }

    updateMyTurn();

  }, [props]);


  return (
      <InitContainer>
        <PlayerHandsContainer player={'A'}>
          {refPlayArea && refPlayArea.current && cardsOnTable && cardsInHands ?
              <HandPlus
                  disabled={!myTurn}
                  layout={"spread"}
                  playArea={playArea.current}
                  handlePlacingCard={c => handlePlacingCard(c)}
                  cards={cardsInHands.playerA}
                  cardsPlayed={cardsOnTable}
                  myIndex={myIndex}
                  cardSize={100}/>
              : <></>}
        </PlayerHandsContainer>
        {cardsInHands ?
            <>
              <PlayerHandsContainer player={'B'}>
                <HandPlus disabled={true} layout={"fan"} cards={cardsInHands.playerB} cardSize={100}/>
              </PlayerHandsContainer>

              <PlayerHandsContainer player={'C'}>
                <HandPlus disabled={true} layout={"fan"} cards={cardsInHands.playerC} cardSize={100}/>
              </PlayerHandsContainer>

              <PlayerHandsContainer player={'D'}>
                <HandPlus disabled={true} layout={"fan"} cards={cardsInHands.playerD} cardSize={100}/>
              </PlayerHandsContainer>
            </>
            : <></>}


        <div className="actionContainer">
          <div className="actionChildContainer" ref={refPlayArea}>
            <div className="nextTrickButton">
              {props.playerStartsTrick[myIndex] && !props.cardsPlayed.includes(null)
                  ? <Button onClick={() => triggerNextTrick()}>
                    Next trick
                  </Button>
                  : <></>
              }
            </div>
            <PlayerCardSpot player={'A'} ref={refASpot}>
              {cardsOnTable ?
                  <PlayingCardPlus
                      key={"playerA"}
                      disabled={true}
                      height={100}
                      card={cardsOnTable.playerA}
                      elevateOnClick={50}
                  />
                  : <></>}
            </PlayerCardSpot>
            <PlayerCardSpot player={'B'} ref={refBSpot}>
              {cardsOnTable ?
                  <PlayingCardPlus
                      key={"playerB"}
                      disabled={true}
                      height={100}
                      card={cardsOnTable.playerB}
                      elevateOnClick={50}
                  />
                  : <></>}
            </PlayerCardSpot>
            <PlayerCardSpot player={'C'} ref={refCSpot}>
              {cardsOnTable ?
                  <PlayingCardPlus
                      key={"playerC"}
                      disabled={true}
                      height={100}
                      card={cardsOnTable.playerC}
                      elevateOnClick={50}
                  />
                  : <></>}
            </PlayerCardSpot>
            <PlayerCardSpot player={'D'} ref={refDSpot}>
              {cardsOnTable ?
                  <PlayingCardPlus
                      key={"playerD"}
                      disabled={true}
                      height={100}
                      card={cardsOnTable.playerD}
                      elevateOnClick={50}
                  />
                  : <></>}
            </PlayerCardSpot>
          </div>
        </div>
      </InitContainer>
  );
}

export default InitDistributionPlus;