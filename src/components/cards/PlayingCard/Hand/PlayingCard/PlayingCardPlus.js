import React, {Component, useEffect, useRef, useState} from 'react';
import './PlayingCard.css';
import PlayingCardsList from './PlayingCardsList';
import Draggable from 'react-draggable';
import * as ReactDOM from "react-dom"; // Both at the same time


const PlayingCardPlus = props => {
  const [style, setStyle] = useState(props.style);
  const [draggableDivStyle, setDraggableDivStyle] = useState({zIndex: props.style?.zIndex, position: 'fixed'});
  const [position, setPosition] = useState({x: 0, y: 0});

  const nodeRef = useRef(null);



  const onDragStart = e => {
    setDraggableDivStyle({zIndex: '999', position: 'fixed'});

    e.preventDefault();

    if(style && style.transform) {
      if (style.transform.indexOf('rotate') !== -1) {
        const transform = style.transform.slice(0, -1).replace(/rotate(.*)/, 'rotate(0)');
        setStyle({...style, transform: transform});
      }
    }
  }

  const onDragStop = e => {
    if(overlaps(e.target.getBoundingClientRect(), props.playArea)) {
      console.log("Overlap!");
      props.handlePlacingCard(props.card);
    } else {
      console.log("No overlap!");
      setDraggableDivStyle({...draggableDivStyle, zIndex: props.style.zIndex});
      setPosition({x: 0, y: 0});
    }
  }

  const overlaps = (bounds1, bounds2) => {
    if(bounds1.left > bounds2.right || bounds1.right < bounds2.left || bounds1.top > bounds2.bottom || bounds1.bottom < bounds2.top) {
      return false;
    }

    return true;
  }


  return (
    <Draggable
        onStart={e => onDragStart(e)}
        onStop={e => onDragStop(e)}
        disabled={props.disabled}
        nodeRef={nodeRef}
        position={position}
    >
      <div style={draggableDivStyle} ref={nodeRef}>
        <img
          style={style}
          height={props.height}
          className={'Playing-card'}
          src={props.card.imageString === 'flipped' ? PlayingCardsList.flipped :
              (props.card.imageString === 'hide' ? '' : PlayingCardsList[props.card.imageString])}
          alt={''}
        />
      </div>
    </Draggable>

  );
}

export default PlayingCardPlus;