import React, { Component} from 'react';
import './Hand.css';
import PlayingCard from './PlayingCard/PlayingCard';
import ReactDOM from 'react-dom';

class Hand extends Component {
    constructor(props) {
        super(props);
        this.cardStyles = [];

        this.state = {
          cards : this.props.cards,
          cardSize : this.props.cardSize,
          elevated : this.props.elevated,
          layout: this.props.layout,
          disabled: this.props.disabled || false,
          playArea: this.props.playArea,
          prevProps: {},
        };
        this.deadCards = {};
        this.handLength = this.props.cards.length;
        //setup for fanning
    }

    static getDerivedStateFromProps(props, state) {
        const { prevProps } = state;
        if (prevProps.cards !== props.cards || prevProps.cardSize !== props.cardSize || prevProps.elevated !== props.elevated || prevProps.layout !== props.layout || prevProps.disabled !== props.disabled || prevProps.playArea !== props.playArea) {
          return {
            cards: props.cards,
            cardSize : props.cardSize,
            elevated : props.elevated,
            layout: props.layout,
            disabled : props.disabled,
            playArea: props.playArea,
            prevProps: props
          }
        }
        return {
            prevProps: props
        }
    }
    elevateOne(card){

    }

    resetStack(){
        this.over = 50;
    }

    resetSpread(){
        this.initialOver = 110 * (this.handLength - 1);
        this.over = this.initialOver / 2;
    }

    resetFanning(){
        this.curl = Math.pow(this.handLength, 1.30) * 10; //curl of cards in hand
        this.deg = this.props.cards.length > 1 ? -this.handLength * 15 : 0;
        this.degs = this.deg / 2;
        this.initialDown = this.handLength * 7;
        this.down = this.initialDown / 2;
        this.initialOver = this.curl;
        this.over = this.initialOver / 2;
    }

    spreadStyle(num){
        if(num > 0){
            this.over -= this.initialOver / (this.handLength - 1);
        }
        return {
            'zIndex' : num,
            'transform' : `translateX(${(-50 + this.over * -1)}%)`
        }
    }

    fanStyle(num) {
        let overHalf = num > (this.handLength - 1) / 2;
        if (false && process.env.NODE_ENV !== "production") {

        }
        if (num > 0) {
            this.degs -= this.deg / (this.handLength - 1);
            this.down -= this.initialDown / (this.handLength - 1);
            this.over -= this.initialOver / (this.handLength - 1);
        }
        return {
            'zIndex' : num,
            'transform': `translateY(${(overHalf ? -this.down : this.down)}%) 
            translateX(${(-50 + this.over * -1)}%) 
            rotate(${this.degs}deg)` }
    }

    stackStyle(num){
        if(num > 0){
            this.over -= 20 / this.handLength
        }
        return {
            'zIndex' : num,
            'transform' : `translateX(${(this.over * -1)}%)`
        }
    }

    isCardDead(id) {
        return this.deadCards[id] ? this.deadCards[id].dead : false;
    }

    removeCard(id, style) {
        if(!this.isCardDead(id)) {
            this.deadCards[id] = {
                dead : true,
                style : style //should it keep track of its own style?
            };
            if(this.handLength) {
                this.handLength--;
            }
            this.setState(this.state);
        }
    }

    onDrag(key) {

    }

    onClick(key) {

    }

    onDragStop(key) {
        let cardToSpliceInto = this.state.cards[this.indexToInsertInto(key) + 1];
        this.refs[key].state.position = {x : this.refs[key].getBindingClientRect().x, y : this.refs[key].getBindingClientRect().y}
        this.state.cards.splice(this.state.cards.indexOf(key), 1);
        this.state.cards.splice(this.indexToInsertInto(key), 0, key);

        if(this.deadCards[key]) {
            this.deadCards[key].dead = false;
            this.handLength++;
            this.setState(this.state);
        }
    }

    handlePlacingCard(key) {
        this.props.handlePlacingCard(key);
    }

    onDragStart(key) {
        this.removeCard(key, this.refs[key].state.style);
    }

    indexToInsertInto(key) {
        let indexToInsertInto = 0;
        let xPositionOfKey = this.refs[key].getBindingClientRect().x;
        for(let i = 0; i < this.state.cards.length; i++) {
            if(this.state.cards[i] === key) {
                continue;
            }
            if(xPositionOfKey < this.refs[this.state.cards[i]].getBindingClientRect().x) {
                return indexToInsertInto;
            } else {
                indexToInsertInto++;
            }
        }
        return indexToInsertInto;
    }

    render() {
        let index = 0;
        if(this.state.layout === 'fan'){
            this.resetFanning();
            this.styleType = this.fanStyle;
        }
        else if(this.state.layout === 'spread'){
            this.resetSpread();
            this.styleType = this.spreadStyle;
        }else if(this.state.layout === 'stack'){
            this.resetStack();
            this.styleType = this.stackStyle;
        }

        return (
        <div className={'Hand'}
          style={{ 'height': this.state.layout === 'stack' ? this.state.cardSize : this.state.cardSize * 2}} >
          {
              this.state.cards.map((card, index) => {
                  return (
                      <PlayingCard
                        key={card}
                        onDragStart={this.onDragStart.bind(this)}
                        onDragStop={this.onDragStop.bind(this)}
                        onDrag={this.onDrag.bind(this)}
                        handlePlacingCard={this.handlePlacingCard.bind(this)}
                        removeCard={this.removeCard.bind(this)}
                        disabled={this.state.disabled}
                        playArea={this.state.playArea}
                        ref={card}
                        height={this.state.cardSize}
                        card={ card }
                        style={this.isCardDead(card) ? this.deadCards[card].style : this.styleType(index++)} //just give it the current index, PlayingCard.js will fix that
                        flipped={ this.props.hide }
                        elevateOnClick={50}
                        onClick={this.onClick.bind(this)}
                        zIndex={index}
                      />
                  )
              })
          }
          </div>
        )
    }
}
export default Hand;