import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';
import flyingCards from '../images/interfaceImages/flying-cards.jpg';
import plankSharp from '../images/interfaceImages/wooden-plank-BW-sharp.jpg';
import texture from '../images/interfaceImages/texture.jpg';





export const GlowButton = styled.button`
  display: block;
  text-align-all: center;
  font-size: 1.2rem;
  font-family: 'KoHo', sans-serif;
  height: 2.5rem;
  min-width: 10rem;
  width: ${props => props.width || null};
  color: #dddddd;
  text-decoration: none;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(221, 221, 221, 0.8);
  background: rgba(0, 0, 0, 0.8);
  &:hover {
    box-shadow: 1px 1px 25px 10px rgba(221, 221, 221, 0.4);
    &:disabled {
      box-shadow: 1px 1px 10px 3px rgba(221, 221, 221, 0.4);
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(120deg, transparent, rgba(221, 221, 221, 0.4), transparent);
    transition: all 650ms;
  }
  &:hover:enabled::before {
    left: 100%;
  }
  &:disabled {
    border: 1px solid rgba(200, 200, 200, 0.5);
    color: rgba(221, 221, 221, 0.4);
  }
`;

export const IconicInput = props => {

  const inputRef = useRef(null);

  const iconStyleDefault = {
    color: props.defaultIconColor || '#222222',
    position: 'absolute',
    top: '0.5rem',
    left: '0.6rem',
    width: '2.5rem',
    height: 'auto'
  }
  const iconStyleHighlight = {
    color: props.highlightIconColor || '#444444',
    position: 'absolute',
    top: '0.5rem',
    left: '0.6rem',
    width: '2.5rem',
    height: 'auto',
    transform: 'scale(1.1)',
    textShadow: '-2px 2px 5px rgba(221, 221, 221, 0.3), -2px -2px 5px rgba(221, 221, 221, 0.3), 2px -2px 5px rgba(221, 221, 221, 0.3), 2px 2px 5px rgba(221, 221, 221, 0.3)'
  }

  return (
    <div style={{position: 'relative'}}>
      <i
          className={'material-icons'}
          style={(inputRef.current?.value) ? iconStyleHighlight : iconStyleDefault}
      >{(inputRef.current?.value) ? props.highlightIcon : props.defaultIcon}</i>
      <StylishInput
          type={props.type}
          placeholder={props.placeholder}
          onChange={props.onChange}
          style={props.style}
          ref={inputRef}
      />
    </div>
  );
}

export const FloatingContainer = styled.div`
  position: absolute;
  bottom: 5vh;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  z-index: -4;
  animation: 8s infinite alternate floating;
  
  @keyframes floating {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-0.4rem);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

export const MenuGrid = styled.div`
  display: grid;
  position: fixed;
  top: 0;
  left: 0;
  grid-template-columns: 6fr 4fr;
  grid-template-rows: 1fr 9fr;
  width: 100vw;
  height: 100vh;
  background: url(${texture}) no-repeat 50% 65%;
  background-size: cover;
  //background: linear-gradient(0deg, rgba(70,70,70,1) 0%, rgba(221,221,221,1) 100%);
  z-index: -5;
`;

export const MorphingBanner = styled.div`
  position: absolute;
  display: block;
  z-index: -4;
  top: 5%;
  left: 40%;
  height: 100vh;
  width: 35vw;
  background: url(${flyingCards}) no-repeat center/cover;
  opacity: 0.85;
  animation: 12s linear 0s infinite normal patient-motion;
  
  @keyframes patient-motion {
    0% {
      transform: translate3d(0, 0, 0,);
    }
    20% {
      transform: translate3d(-0.5%, -1%, 0);
    }
    40% {
      transform: translate3d(-0.3%, 0, 0);
    }
    60% {
      transform: translate3d(0%, 1%, 0);
    }
    80% {
      transform: translate3d(0.3%, 0.5%, 0);
    }
    100% {
      transform: translate3d(0, 0, 0);
    }
  }
`;

export const MenuHeader = props => {

  return (
    <MainDiv>
      <SideButtonWrapper pos={'left'}>
        <GlowButton onClick={() => props.onClickProfile()}>
          {props.user?.username}'s profile
        </GlowButton>
      </SideButtonWrapper>
      <GameButtonWrapper>
        <GlowButton style={{height: '3rem', width: '15rem', fontSize: '1.5rem'}} onClick={() => props.onClickCreate()}>
          create game
        </GlowButton>
        <GlowButton style={{height: '3rem', width: '15rem', fontSize: '1.5rem'}} onClick={() => props.onClickJoin()}>
          join game
        </GlowButton>
      </GameButtonWrapper>
      <SideButtonWrapper pos={'right'}>
        <GlowButton onClick={() => props.onClickLogout()}>
          logout
        </GlowButton>
      </SideButtonWrapper>
    </MainDiv>
  );
}




/*--------------------------------------------- MenuHeader Components ---------------------------------------------*/
const MainDiv = styled.div`
    grid-column: 1 / span 3;
    grid-row: 1;

    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr;
    grid-column-gap: 10%;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 0 0 85% 85%/30%;
    background: url(${plankSharp}) no-repeat center/cover, radial-gradient(100% 100% at top, #323232FF 0%, #000000 100%) no-repeat center/cover;
    background-blend-mode: multiply;
`;

const GameButtonWrapper = styled.div`
    grid-column: 2;
    grid-row: 1;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`;

const SideButtonWrapper = styled.div`
    grid-column: ${props => props?.pos === 'right' ? 3 : 1};
    grid-row: 1;
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;
/*-----------------------------------------------------------------------------------------------------------------*/



/*--------------------------------------------- IconicInput Component ---------------------------------------------*/
const StylishInput = styled.input`
  border: 1px solid rgba(221, 221, 221, .5);
  font-size: 1.2rem;
  font-family: 'Saira', sans-serif;
  font-weight: 400;
  padding: .25em 0 .3125em 3.1rem;
  height: 2.5rem;
  text-align: left;
  color: rgba(221, 221, 221, .5);
  border-radius: .4rem;
  background: rgba(0, 0, 0, 0.65);
  transition: all .100s;
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    color: rgba(255, 255, 255, .9);
    border-color: rgba(255, 255, 255, .75);
  }

  &.keyup {
    color: white;
    border-color: white;
    text-shadow: 0 0 .125em white;
    box-shadow: 0 0 .25em white, inset 0 0 .25em white;
  }
  
  &::-webkit-input-placeholder {
    color: rgba(255,255,255,0.6);
    text-shadow: 0 0 0.125rem transparent;
    transition: all 0.25s;
    font-size: 1.1rem;
    font-family: 'Saira', sans-serif;
    font-weight: 300;
    font-style: italic;
  }
  
  &:focus::-webkit-input-placeholder {
    opacity: 0.5;
  }
  
  &::-moz-placeholder {
    color: rgba(255,255,255,0.6);
    text-shadow: 0 0 0.125rem transparent;
    transition: all 0.25s;
    font-size: 1.1rem;
    font-family: 'Saira', sans-serif;
    font-weight: 300;
    font-style: italic;
  }

  &:focus::-moz-placeholder {
    opacity: 0.5;
  }
  
  &:-ms-input-placeholder {
    color: rgba(255,255,255,0.6);
    text-shadow: 0 0 0.125rem transparent;
    transition: all 0.25s;
    font-size: 1.1rem;
    font-family: 'Saira', sans-serif;
    font-weight: 300;
    font-style: italic;
  }
  
  &:focus:-ms-input-placeholder {
    opacity: 0.5;
  }
`;
/*-----------------------------------------------------------------------------------------------------------------*/