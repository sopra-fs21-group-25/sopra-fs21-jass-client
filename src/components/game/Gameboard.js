import React from 'react';
import Deck from './Deck';


export const Gameboard = () => {
  const deck = new Deck();

  deck.initialize();

  return null;
}