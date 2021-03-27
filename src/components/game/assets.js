

export const NUM_OF_CARDS = gameMode => {
  switch(gameMode) {
    case 'schieber':
      return 9;
    case 'coiffeur':
      return 9;
    case 'bieter':
      return undefined; //Since the amount of cards depends on the current round, I need to figure the logic out first
    case 'sidi':
      return 16;
    default:
      return undefined;
  }
}


export const SUITS = {
  ACORN: 'acorn',
  ROSE: 'rose',
  SHIELD: 'shield',
  BELL: 'bell'
}

export const RANKS = {
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  JACK: 11,
  QUEEN: 12,
  KING: 13,
  ACE: 14
}



