import React, {useState} from 'react';
import styled from 'styled-components';
import rose from "../../../views/images/icons/rose.png";
import shield from "../../../views/images/icons/shield.png";
import acorn from "../../../views/images/icons/acorn.png";
import bell from "../../../views/images/icons/bell.png";



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
      // CARD IMAGE HERE
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