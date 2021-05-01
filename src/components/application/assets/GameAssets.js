import React, {useState} from 'react';
import styled from 'styled-components';
import rose from "../../../views/images/icons/rose.png";
import shield from "../../../views/images/icons/shield.png";
import acorn from "../../../views/images/icons/acorn.png";
import bell from "../../../views/images/icons/bell.png";

import a6 from "../../../views/images/cards/eichel6.gif";
import a7 from "../../../views/images/cards/eichel7.gif";
import a8 from "../../../views/images/cards/eichel8.gif";
import a9 from "../../../views/images/cards/eichel9.gif";
import a10 from "../../../views/images/cards/eichel10.gif";
import aUnder from "../../../views/images/cards/eichelUnder.gif";
import aOber from "../../../views/images/cards/eichelOber.gif";
import aKing from "../../../views/images/cards/eichelKoenig.gif";
import aAce from "../../../views/images/cards/eichelAss.gif";
import r6 from "../../../views/images/cards/rosen6.gif";
import r7 from "../../../views/images/cards/rosen7.gif";
import r8 from "../../../views/images/cards/rosen8.gif";
import r9 from "../../../views/images/cards/rosen9.gif";
import r10 from "../../../views/images/cards/rosen10.gif";
import rUnder from "../../../views/images/cards/rosenUnder.gif";
import rOber from "../../../views/images/cards/rosenOber.gif";
import rKing from "../../../views/images/cards/rosenKoenig.gif";
import rAce from "../../../views/images/cards/rosenAss.gif";
import b6 from "../../../views/images/cards/schellen6.gif";
import b7 from "../../../views/images/cards/schellen7.gif";
import b8 from "../../../views/images/cards/schellen8.gif";
import b9 from "../../../views/images/cards/schellen9.gif";
import b10 from "../../../views/images/cards/schellen10.gif";
import bUnder from "../../../views/images/cards/schellenUnder.gif";
import bOber from "../../../views/images/cards/schellenOber.gif";
import bKing from "../../../views/images/cards/schellenKoenig.gif";
import bAce from "../../../views/images/cards/schellenAss.gif";
import s6 from "../../../views/images/cards/schilten6.gif";
import s7 from "../../../views/images/cards/schilten7.gif";
import s8 from "../../../views/images/cards/schilten8.gif";
import s9 from "../../../views/images/cards/schilten9.gif";
import s10 from "../../../views/images/cards/schilten10.gif";
import sUnder from "../../../views/images/cards/schiltenUnder.gif";
import sOber from "../../../views/images/cards/schiltenOber.gif";
import sKing from "../../../views/images/cards/schiltenKoenig.gif";
import sAce from "../../../views/images/cards/schiltenAss.gif";

const GameTableGrid = styled('div')({
  position: 'fixed',
  zIndex: '-1',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'grid',
  gridTemplateColumns: '1fr 30% 1fr',
  gridTemplateRows: '1fr 30% 1fr',
  backgroundColor: '#175e20',
  border: '5px solid #152a05',
  borderRadius: '10px',
  aspectRatio: '1/1',
  height: '50%'
});

const IconWrapper = styled('div')({
  maxWidth: props => props.scaleFactor == undefined ? '100%' : `${props.scaleFactor * 100}%`,
  maxHeight: props => props.scaleFactor == undefined ? '100%' : `${props.scaleFactor * 100}%`,
  aspectRatio: '1/1',
  gridColumn: props => props.col,
  gridRow: props => props.row,
  alignSelf: props => props.row == 1 ? 'start' : 'end',
  justifySelf: props => props.col == 1 ? 'start' : 'end'
});

const TableIcon = styled('img')({
  maxWidth: props => props.scaleFactor == undefined ? '100%' : `${props.scaleFactor * 100}%`,
  maxHeight: props => props.scaleFactor == undefined ? '100%' : `${props.scaleFactor * 100}%`,
  transform: props => `rotate(${props.rot}deg)`
/*  alignSelf: props => props.col == 1 && props.row == 1 ? 'start' : (props.col == 3 && props.row == 1 ? 'start' : (props.col == 1 && props.row == 3 ? 'end' : 'end')),
  alignItems: props => props.col == 1 && props.row == 1 ? 'start' : (props.col == 3 && props.row == 1 ? 'end' : (props.col == 1 && props.row == 3 ? 'start' : 'end')),*/
/*  marginTop: props => props.col == 1 && props.row == 1 ? '5%' : (props.col == 3 && props.row == 1 ? '5%' : (props.col == 1 && props.row == 3 ? '0%' : '0%')),
  marginLeft: props => props.col == 1 && props.row == 1 ? '5%' : (props.col == 3 && props.row == 1 ? '0%' : (props.col == 1 && props.row == 3 ? '5%' : '0%')),
  marginRight: props => props.col == 1 && props.row == 1 ? '0%' : (props.col == 3 && props.row == 1 ? '5%' : (props.col == 1 && props.row == 3 ? '0%' : '5%')),
  marginBottom: props => props.col == 1 && props.row == 1 ? '0%' : (props.col == 3 && props.row == 1 ? '0%' : (props.col == 1 && props.row == 3 ? '5%' : '5%'))*/
});

const CardWrapper = styled('div')({

});

const TableCard = styled('img')({
  maxWidth: '50%',
  maxHeight: '50%',
  zIndex: '1',
  gridColumn: props => props.col,
  gridRow: props => props.row,
  transform: props => props.row == 2 ? 'rotate(90deg)' : 'rotate(0deg)',
  alignSelf: props => props.row == 1 ? 'end' : (props.row == 3 ? 'start' : 'center'),
  justifySelf: props => props.col == 1 ? 'end' : (props.col == 3 ? 'start' : 'center'),
});

export const GameTable = () => {
  const [cardTop, setCardTop] = useState({suit: 'ACORN', rank: 'TEN'});

  const viewCard = card => {
    if(card.suit === 'ACORN' && card.rank === 'TEN') {
      return a10;
    }
  }

  return (
      <GameTableGrid>
        <TableCard col={2} row={1} src={viewCard(cardTop)}/>
        <TableCard col={3} row={2} src={viewCard(cardTop)}/>
        <TableCard col={2} row={3} src={viewCard(cardTop)}/>
        <TableCard col={1} row={2} src={viewCard(cardTop)}/>

        <IconWrapper col={1} row={1} scaleFactor={0.7}>
          <TableIcon src={rose}/>
        </IconWrapper>
        <IconWrapper col={3} row={1} scaleFactor={0.7}>
          <TableIcon src={shield} rot={45}/>
        </IconWrapper>
        <IconWrapper col={1} row={3} scaleFactor={0.7}>
          <TableIcon src={acorn} rot={45}/>
        </IconWrapper>
        <IconWrapper col={3} row={3} scaleFactor={0.7}>
          <TableIcon src={bell} rot={180}/>
        </IconWrapper>
      </GameTableGrid>
  );
}