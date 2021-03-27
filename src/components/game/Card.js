import React from "react";


const cardImages = [
  { src: './images/eichel6.gif' },
  { src: './images/eichel7.gif' },
  { src: './images/eichel8.gif' },
  { src: './images/eichel9.gif' },
  { src: './images/eichel10.gif' },
  { src: './images/eichelUnder.gif' },
  { src: './images/eichelOber.gif' },
  { src: './images/eichelKoenig.gif' },
  { src: './images/eichelAss.gif' },
  { src: './images/rosen6.gif' },
  { src: './images/rosen7.gif' },
  { src: './images/rosen8.gif' },
  { src: './images/rosen9.gif' },
  { src: './images/rosen10.gif' },
  { src: './images/rosenUnder.gif' },
  { src: './images/rosenOber.gif' },
  { src: './images/rosenKoenig.gif' },
  { src: './images/rosenAss.gif' },
  { src: './images/schellen6.gif' },
  { src: './images/schellen7.gif' },
  { src: './images/schellen8.gif' },
  { src: './images/schellen9.gif' },
  { src: './images/schellen10.gif' },
  { src: './images/schellenUnder.gif' },
  { src: './images/schellenOber.gif' },
  { src: './images/schellenKoenig.gif' },
  { src: './images/schellenAss.gif' },
  { src: './images/schilten6.gif' },
  { src: './images/schilten7.gif' },
  { src: './images/schilten8.gif' },
  { src: './images/schilten9.gif' },
  { src: './images/schilten10.gif' },
  { src: './images/schiltenUnder.gif' },
  { src: './images/schiltenOber.gif' },
  { src: './images/schiltenKoenig.gif' },
  { src: './images/schiltenAss.gif' }
];



class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sprite: null,
      suit: null,
      rank: null,
      trump: null
    }
  }


  playCard() {

  }



  componentDidMount() {

  }

}

export default Card
