let PlayingCardsList = {};
let suits = ['bells', 'shields', 'roses', 'acorns'];
let faces = ['banner', 'under', 'ober', 'konig', 'as'];

let addSuits = (i, PlayingCardsList) => {
	for(let suit of suits){
		PlayingCardsList[i + suit] = require('../../../../../views/images/cards/' + i + suit + '.svg').default;
	}
}

for(let i = 6; i <= 9; i++){
	addSuits(i, PlayingCardsList);
}

for(let i of faces){
	addSuits(i, PlayingCardsList);
}
PlayingCardsList.flipped = require('../../../../../views/images/cards/back.svg').default;

export default PlayingCardsList;