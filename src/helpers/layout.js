import styled from "styled-components";
import background from '../views/images/interfaceImages/woodWall.png';
import restaurant from '../views/images/interfaceImages/resti.jpg';
import register from '../views/images/interfaceImages/register2.png';
import jassboard from "../views/images/interfaceImages/jasstafel.svg";

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

/**
 * Different container components
 */
export const JassboardContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'top',
  width: '100%',
  aspectRatio: '755/509',
  backgroundImage: `url(${jassboard})`,
  backgroundSize: 'cover',
  padding: '6%'
});

export const Container = styled('div')({
  display: 'flex',
  flexDirection: props => props.flexDirection || 'row',
  alignItems: props => props.alignItems || 'center',
  justifyContent: props => props.justifyContent || 'center',
  width: props => props.width || '100%',
  height: props => props.height || '100%',
  borderTop: props => props.borderTop || null,
  borderBottom: props => props.borderBottom || null,
  overflowY: 'auto',
  overflowX: 'hidden'
});

export const InnerContainer = styled('div')({
  display: 'flex',
  flexDirection: props => props.flexDirection || 'column',
  justifyContent: props => props.justifyContent || 'top',
  alignItems: props => props.alignItems || 'stretch',
  width: props => props.width || '50%',
  height: props => props.height || '100%',
  borderRight: props => props.borderRight || null,
  borderLeft: props => props.borderLeft || null,
  marginLeft: props => props.marginLeft || null,
  marginRight: props => props.marginRight || null
});

export const TextContainer = styled('div')({
  fontSize: '14pt',
  textAlign: 'center',
  color: '#9A9899',
  fontWeight: '700',
  marginTop: props => props.marginTop || '15px',
  marginBottom: props => props.marginBottom || '10px'
});

export const CheckboxContainerColumn = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  margin: '5px',
  fontSize: '14pt',
  textAlign: 'center',
  color: '#9A9899',
  fontWeight: '700',
});

export const CheckboxContainerRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '60%',
  fontSize: '14pt',
  textAlign: 'center',
  color: '#9A9899',
  fontWeight: '700',
});