import React, { Component} from 'react';
import './PlayingCard.css';
import PlayingCardsList from './PlayingCardsList';
import Draggable, {DraggableCore} from 'react-draggable';
import * as ReactDOM from "react-dom"; // Both at the same time


class PlayingCard extends Component {
  constructor(props){
    super(props);

    this.state = {
      flipped : this.props.flipped || this.props.card === 'hide',
      card : this.props.card,
      height : this.props.height,
      flippable : this.props.flippable,
      disabled: this.props.disabled,
      playArea: this.props.playArea,
      elevated : this.props.elevated,
      style : this.props.style,
      position : {x : 0, y : 0},
      draggableDivStyle : {"zIndex": this.props.zIndex},
      prevProps: {}
    }

  }

  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    if (prevProps.flipped !== props.flipped || prevProps.card !== props.card || prevProps.height !== props.height || prevProps.flippable !== props.flippable || prevProps.disabled !== props.disabled || prevProps.elevated !== props.elevated || prevProps.style !== props.style || prevProps.position !== props.position || prevProps.draggableDivStyle !== props.draggableDivStyle || prevProps.playArea !== props.playArea) {
      return {
        flipped : props.flipped || props.card === 'hide',
        card : props.card,
        height : props.height,
        flippable : props.flippable,
        disabled: props.disabled,
        playArea: props.playArea,
        elevated : props.elevated,
        style : props.style,
        position : props.position, //{x : 0, y : 0},
        draggableDivStyle : {"zIndex": props.zIndex},
        prevProps: props
      }
    }
    return {
        prevProps: props
    }
  }

  elevate(percent){
    // console.log(this.state);
    if(this.state.elevated) percent = -percent;
    let style = this.state.style;
    let translateY = style.transform.match(/translateY\((.*?)\)/); //pull out translateY
    if(translateY){
      let newTranslateY = Number(translateY[1].slice(0, -1)) - percent; //add 50%
      style.transform = style.transform.replace(/translateY(.*)/, `translateY(${newTranslateY}%)`)
    } else {
      style.transform += `\ntranslateY(${-percent}%)`
    }
    this.setState({style : style,
                   elevated : !this.state.elevated})
  }

  onClick(){
    this.props.onClick(this.props.card);
    // console.log('position: ', )
  }

  onDragStart(e) {
    this.state.draggableDivStyle = {"zIndex":"999", "position" : "fixed"}

    e.preventDefault(); //fixes desktop drag image issue

    // console.log('style: ', this.state.style);
    if(this.state.style && this.state.style.transform) {
        if(this.state.style.transform.indexOf('rotate') !== -1) {
            // console.log('derotating');
            let transform = this.state.style.transform.slice(0, -1); //copy it
            this.state.style.transform = transform.replace(/rotate(.*)/, 'rotate(0)');
            this.setState(this.state);
        }
        // console.log('************ transforming');
        // let newStyle = {transform :  this.state.style.transform.replace(/rotate(.*)/, 'rotate(0)')};
        this.props.removeCard(this.state.card, this.state.style);
    }
    this.props.onDragStart(this.state.card);
    // console.log('start');
  }

  onDrag() {
    this.props.onDrag(this.state.card);
  }

  overlaps(a, b) {
    // no horizontal overlap
    if (a.x1 >= b.x2 || b.x1 >= a.x2) return false;

    // no vertical overlap
    if (a.y1 >= b.y2 || b.y1 >= a.y2) return false;

    return true;
  }

  getBounds(elem) {
    const bounds = elem.target.getBoundingClientRect() 
    return {x1: bounds.top, y1: bounds.left, x2: bounds.bottom, y2: bounds.right}
  }

  onDrop = (e) => {
    if (this.overlaps(this.getBounds(e), this.state.playArea())) {
      console.log("Overlap!");
    } else {
      console.log("No overlap!")
      this.state.draggableDivStyle = {"zIndex" : this.props.zIndex, "position" : "fixed"};
      this.props.onDragStop(this.state.card);
      this.setState({position: {x : 0, y : 0}})
    }
  }

  getBindingClientRect() {
    return ReactDOM.findDOMNode(this.refs[this.state.card]).getBoundingClientRect()
  }

  render() {
    return (
        <Draggable 
          onStart={this.onDragStart.bind(this)} //bind this from PlayingCard
          onStop={this.onDrop}
          onDrag={this.onDrag.bind(this)}
          position={this.state.position} //resets back to initial position on drag end
          disabled={this.state.disabled}
        >
          <div style={this.state.draggableDivStyle}>
            <img ref={this.state.card}
              style={this.state.style}
              height={this.state.height}
              className='Playing-card'
              src={this.state.flipped === true ? PlayingCardsList.flipped : PlayingCardsList[this.state.card]}
              alt={this.state.flipped === true ? 'Hidden Card' : PlayingCardsList[this.state.card]}
              // onClick={this.props.elevateOnClick ? () => this.elevate(this.props.elevateOnClick) : null}
              onClick={this.onClick.bind(this)}
            />
          </div>
        </Draggable>
      );
    }
  }
/*this.state.flippable ? ()=> {
            this.setState({flipped:this.state.flipped === true ? false : true,
              height: this.state.height,
              card: this.state.card});
          } : null*/

export default PlayingCard;