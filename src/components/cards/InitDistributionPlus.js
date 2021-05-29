import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import '../game/gameAssets/gameStyles.scss';
import {GlowButton} from "../../views/design/ElegantAssets";
import HandSpread from "./PlayingCard/Hand/HandSpread";
import PlayingCardsList from "./PlayingCard/Hand/PlayingCard/PlayingCardsList";
import {UserListContext} from "../../App";
import {api} from "../../helpers/api";
import {UserType} from "../shared/models/UserType";
import guestIcon from '../../views/images/icons/guest-icon.svg';
import {convertBase64DataToImageUrl} from "../../helpers/utilityFunctions";




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
  const [maxCardsContainerHeight, setMaxCardsContainerHeight] = useState(0);
  const [myTurn, setMyTurn] = useState(false);

  const refPlayArea = useRef(null);
  const refTableCardDim = useRef(null);
  const refAHandContainer = useRef(null);
  const refBHandContainer = useRef(null);
  const refCHandContainer = useRef(null);
  const refDHandContainer = useRef(null);

  const {profilePictureCollection, setProfilePictureCollection} = useContext(UserListContext);

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
    setMyTurn(false);

    const cardToBeNotifiedAbout = {...card};
    delete cardToBeNotifiedAbout.imageString;
    props.updateGameState(cardToBeNotifiedAbout, null);
  }

  useLayoutEffect(() => {
    const fetchProfilePictures = async () => {
      const newProfilePictures = {...profilePictureCollection};
      let collectionChange = false;

      for(let i=0; i<4; i++) {
        if(!profilePictureCollection[props.playerIds[i]]) {
          collectionChange = true;
          const type = (await api.get(`/users/${props.playerIds[i]}`)).data.userType;
          if(type === UserType.GUEST) {
            newProfilePictures[props.playerIds[i]] = guestIcon;
          } else {
            newProfilePictures[props.playerIds[i]] = convertBase64DataToImageUrl((await api.get(`/files/${props.playerIds[i]}`)).data);
          }
        }
      }

      if(collectionChange) {
        setProfilePictureCollection(newProfilePictures);
      }
    }

    void fetchProfilePictures();
  }, [props.playerIds])

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
      playerB: Array(props.amountOfCardsHeldByPlayers[(myIndex + 1) % 4]).fill({imageString: 'flipped'}),
      playerC: Array(props.amountOfCardsHeldByPlayers[(myIndex + 2) % 4]).fill({imageString: 'flipped'}),
      playerD: Array(props.amountOfCardsHeldByPlayers[(myIndex + 3) % 4]).fill({imageString: 'flipped'})
    });

    updateMyTurn();

  }, [props]);

  useLayoutEffect(() => {
    const setMax = () => {
      setMaxCardsContainerHeight(Math.min(
          refBHandContainer.current.clientWidth,
          refCHandContainer.current.clientHeight,
          refDHandContainer.current.clientWidth
      ));
    };
    setMax();

    window.addEventListener('resize', setMax);
    return () => window.removeEventListener('resize', setMax);
  }, [refBHandContainer, refCHandContainer, refDHandContainer])

  return (
    <div className={'middle-column-wrapper'}>
        <div className={'action-wrapper'}>
          <div className={'next-trick-button-wrapper'}>
            {!!props.playerStartsTrick[myIndex] && !props.cardsPlayed.includes(null) &&
              <GlowButton onClick={() => triggerNextTrick()} style={{height: '100%', width: '100%', minWidth: 0, fontSize: 'inherit'}}>
                {props.trickToPlay === 0 ? 'next round' : 'next trick'}
              </GlowButton>
            }
          </div>
          <div className={'action__inner'} ref={refPlayArea}>
            <div className={'action-spot-A'}>
              {!!cardsOnTable?.playerA &&
                <div className={'action-spot-image-wrapper'}>
                  <img
                    ref={refTableCardDim}
                    style={{
                      opacity: PlayingCardsList[cardsOnTable.playerA.imageString] ? 1 : 0,
                      boxShadow: props.playerStartsTrick[myIndex] && !props.cardsPlayed.includes(null) ? '0 0 8px 10px rgba(255,240,150, 0.7)' : '0 0 0 transparent'
                    }}
                    className={'action-spot-image-layout'}
                    src={PlayingCardsList[cardsOnTable.playerA.imageString]}
                    alt={''}
                  />
                </div>
              }
            </div>
            <div className={'action-spot-B'}>
              {!!cardsOnTable?.playerB &&
                <div className={'action-spot-image-wrapper'}>
                  <img
                      style={{
                        display: PlayingCardsList[cardsOnTable.playerB.imageString] ? 'inline' : 'none',
                        boxShadow: props.playerStartsTrick[(myIndex + 1) % 4] && !props.cardsPlayed.includes(null) ? '0 0 8px 10px rgba(255,240,150, 0.7)' : '0 0 0 transparent'
                      }}
                      className={'action-spot-image-layout'}
                      src={PlayingCardsList[cardsOnTable.playerB.imageString]}
                      alt={''}
                  />
                </div>
              }
            </div>
            <div className={'action-spot-C'}>
              {!!cardsOnTable?.playerC &&
                <div className={'action-spot-image-wrapper'}>
                  <img
                      style={{
                        display: PlayingCardsList[cardsOnTable.playerC.imageString] ? 'inline' : 'none',
                        boxShadow: props.playerStartsTrick[(myIndex + 2) % 4] && !props.cardsPlayed.includes(null) ? '0 0 8px 10px rgba(255,240,150, 0.7)' : '0 0 0 transparent'
                      }}
                      className={'action-spot-image-layout'}
                      src={PlayingCardsList[cardsOnTable.playerC.imageString]}
                      alt={''}
                  />
                </div>
              }
            </div>
            <div className={'action-spot-D'}>
              {!!cardsOnTable?.playerD &&
                <div className={'action-spot-image-wrapper'}>
                  <img
                      style={{
                        display: PlayingCardsList[cardsOnTable.playerD.imageString] ? 'inline' : 'none',
                        boxShadow: props.playerStartsTrick[(myIndex + 3) % 4] && !props.cardsPlayed.includes(null) ? '0 0 8px 10px rgba(255,240,150, 0.7)' : '0 0 0 transparent'
                      }}
                      className={'action-spot-image-layout'}
                      src={PlayingCardsList[cardsOnTable.playerD.imageString]}
                      alt={''}
                  />
                </div>
              }
            </div>
          </div>
        </div>
        <div className={'player-hands-container__A'} ref={refAHandContainer}>
          {!!(refPlayArea.current && cardsOnTable && cardsInHands && refTableCardDim.current) && !!maxCardsContainerHeight &&
            <HandSpread
              disabled={!myTurn}
              layout={'horizontal-lr'}
              playArea={refPlayArea.current}
              handlePlacingCard={c => handlePlacingCard(c)}
              cards={cardsInHands.playerA}
              cardsPlayed={cardsOnTable}
              maxDimension={maxCardsContainerHeight}
              opponent={false}
              dragCardDims={{width: refTableCardDim.current.clientWidth, height: refTableCardDim.current.clientHeight}}
            />
          }
        </div>
        <div className={'player-hands-container__B'} ref={refBHandContainer}>
          {!!cardsInHands && !!maxCardsContainerHeight &&
            <HandSpread
              disabled={true}
              layout={'vertical-bt'}
              cards={cardsInHands.playerB}
              maxDimension={maxCardsContainerHeight}
              parentXY={refBHandContainer.current}
              opponent={true}
            />
          }
        </div>
        <div className={'player-hands-container__C'} ref={refCHandContainer}>
          {!!cardsInHands && !!maxCardsContainerHeight &&
            <HandSpread
              disabled={true}
              layout={'horizontal-rl'}
              cards={cardsInHands.playerC}
              maxDimension={maxCardsContainerHeight}
              parentXY={refCHandContainer.current}
              opponent={true}
            />
          }
        </div>
        <div className={'player-hands-container__D'} ref={refDHandContainer}>
          {!!cardsInHands && !!maxCardsContainerHeight &&
            <HandSpread
              disabled={true}
              layout={'vertical-tb'}
              cards={cardsInHands.playerD}
              maxDimension={maxCardsContainerHeight}
              parentXY={refDHandContainer.current}
              opponent={true}
            />
          }
        </div>
        <div className={'player-name-display-container__A'}>
          <div className={'player-display__A' + (props.currentlyActingPlayerIndex === myIndex ? ' acting-highlight' : '')}>
            <div className={'icon-wrapper__generic'}>
              <img
                className={'user-avatar-style'}
                src={profilePictureCollection[props.playerIds[myIndex]]}
                alt={guestIcon}
              />
            </div>
            <div className={'name-wrapper__generic'}>
              {props.playerUsernames[myIndex]}
            </div>
          </div>
        </div>
        <div className={'player-name-display-container__B'}>
          <div className={'player-display-helper__B'}>
            <div className={'player-display__B' + (props.currentlyActingPlayerIndex === (myIndex+1)%4 ? ' acting-highlight' : '')}>
              <div className={'icon-wrapper__generic'}>
                <img
                  className={'user-avatar-style'}
                  src={profilePictureCollection[props.playerIds[(myIndex + 1) % 4]]}
                  alt={guestIcon}
                />
              </div>
              <div className={'name-wrapper__generic'}>
                {props.playerUsernames[(myIndex + 1) % 4]}
              </div>
            </div>
          </div>
        </div>
        <div className={'player-name-display-container__C'}>
          <div className={'player-display__C' + (props.currentlyActingPlayerIndex === (myIndex+2)%4 ? ' acting-highlight' : '')}>
            <div className={'icon-wrapper__generic'}>
              <img
                className={'user-avatar-style'}
                src={profilePictureCollection[props.playerIds[(myIndex + 2) % 4]]}
                alt={guestIcon}
              />
            </div>
            <div className={'name-wrapper__generic'}>
              {props.playerUsernames[(myIndex + 2) % 4]}
            </div>
          </div>
        </div>
        <div className={'player-name-display-container__D'}>
          <div className={'player-display-helper__D'}>
            <div className={'player-display__D' + (props.currentlyActingPlayerIndex === (myIndex+3)%4 ? ' acting-highlight' : '')}>
              <div className={'icon-wrapper__generic'}>
                <img
                  className={'user-avatar-style'}
                  src={profilePictureCollection[props.playerIds[(myIndex + 3) % 4]]}
                  alt={guestIcon}
                />
              </div>
              <div className={'name-wrapper__generic'}>
                {props.playerUsernames[(myIndex + 3) % 4]}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default InitDistributionPlus;