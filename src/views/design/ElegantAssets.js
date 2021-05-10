import React, {useEffect, useRef} from 'react';
import styled from 'styled-components';



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
    left: `calc(50% - (Max(100%, 15rem) / 2) + 0.6rem)`,
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

  useEffect(() => {
    console.log({inputRef})
  })

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
          ref={inputRef}
      />
    </div>
  );
}




/* Not exported ...*/

const StylishInput = styled.input`
  border: 1px solid rgba(221, 221, 221, .5);
  font-size: 1.2rem;
  font-family: 'Saira', sans-serif;
  font-weight: 400;
  padding: .25em 0 .3125em 18%;
  height: 2.5rem;
  text-align: left;
  color: rgba(221, 221, 221, .5);
  border-radius: .4rem;
  background: rgba(0, 0, 0, 0.65);
  transition: all .100s;
  width: 100%;
  max-width: 15rem;
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