import styled from "styled-components";
import background from '../views/images/interfaceImages/woodWall.png';
import restaurant from '../views/images/interfaceImages/resti.jpg';
import register from '../views/images/interfaceImages/register2.png';

export const DESKTOP_WIDTH = 1160;
export const SMALL_LAPTOPS_WIDTH = 970;
export const TABLETS_WIDTH = 750;
export const SMALL_WIDTH = 768;

export const BaseContainer = styled('div')({
  width: '100%',
  marginLeft: 'auto',
  paddingLeft: '15px',
  marginRight: 'auto',
  paddingRight: '15px',
});

export const BackgroundContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover'
});

export const BackgroundContainerLogin = styled('div')({
  display: 'flex',
  alignItems: 'top',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${restaurant})`,
  backgroundSize: 'cover'
});

export const BackgroundContainerRegister = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundImage: `url(${register})`,
  backgroundSize: 'cover'
});

export const LargeButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '5px',
  boxSizing: 'border-box'
});