import React, {Component, useEffect, useLayoutEffect, useRef, useState} from 'react';
import './PlayingCard.css';
import PlayingCardsList from './PlayingCardsList';
import Draggable from 'react-draggable';


const PlayingCardSpread = props => {
  const [draggableDivStyle, setDraggableDivStyle] = useState({zIndex: props.index, position: 'absolute'});
  const [layoutParams = {
    handWidth: Number,
    numCards: Number,
    cardWidth: Number,
    index: Number
  }, setLayoutParams] = useState(null);
  const nodeRef = useRef(null);

  useLayoutEffect(() => {
    const setParams = () => {
      setLayoutParams({
        handWidth: props.handWidth.clientWidth,
        numCards: props.numCards,
        cardWidth: nodeRef.current.clientWidth,
        index: props.index
      });
    }
    setParams();
    window.addEventListener('resize', setParams);
    return () => window.removeEventListener('resize', setParams);

  }, [props.numCards, props.index, props.handWidth])

  const onDragStart = e => {
    e.preventDefault();
    setDraggableDivStyle({...draggableDivStyle, zIndex: '999', transform: 'scale(0.5)'});
  }

  const onDragStop = node => {
    if(overlaps(node.getBoundingClientRect(), props.playArea.getBoundingClientRect())) {
      console.log("Overlap!");
      props.handlePlacingCard(props.card);
    } else {
      console.log("No overlap!");
    }
    setDraggableDivStyle({position: 'absolute', zIndex: props.index});
  }

  const overlaps = (bounds1, bounds2) => {
    return !(bounds1.left > bounds2.right || bounds1.right < bounds2.left || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top);
  }

  const calcCardPosition = () => {
    if(!layoutParams) {
      return {x: 0, y: 0};
    }
    const i = layoutParams.index;
    const n = layoutParams.numCards;
    const l = layoutParams.handWidth;
    const w = layoutParams.cardWidth;

    const x = w * ((6/5)*n - (1/5)) - l > 0
        ? (i * (l*n + l - n*w))/(n*n)
        : 0.1*(i*(12-2/(n*n))*w + 5*l - 6*n*w + w);
    return {x: x, y: 0};
  }

  return (
      <Draggable
        onStart={e => onDragStart(e)}
        onStop={(e, data) => onDragStop(data.node)}
        disabled={props.disabled}
        nodeRef={nodeRef}
        position={calcCardPosition()}
      >
        <div
          className={'playing-card-div'}
          style={draggableDivStyle}
          ref={nodeRef}
        >
          <img
            className={props.opponent ? 'playing-card-img-opponent' : 'playing-card-img-player'}
            src={props.card.imageString === 'flipped' ? PlayingCardsList.flipped :
                (props.card.imageString === 'hide' ? '' : PlayingCardsList[props.card.imageString])}
            alt={''}
          />
        </div>
      </Draggable>
  );
}

export default PlayingCardSpread;