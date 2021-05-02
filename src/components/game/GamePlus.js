import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {useStompClient, useSubscription} from 'react-stomp-hooks';
import '../cards/index.css';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import InitDistribution from '../cards/InitDistribution';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import acorn from "../../views/images/icons/acorn.png";
import rose from "../../views/images/icons/rose.png";
import bell from "../../views/images/icons/bell.png";
import shield from "../../views/images/icons/shield.png";
import undenufe from "../../views/images/icons/undenufe.png";
import obenabe from "../../views/images/icons/obenabe.png";
import slalom from "../../views/images/icons/slalom.png";
import gusti from "../../views/images/icons/gusti.png";
import mary from "../../views/images/icons/mary.png";
import {map} from "react-bootstrap/ElementChildren";



const CurrentModeContainer = styled(BaseContainer)`
  position: absolute;
  width: 100px;
  height: 200px;
  right: 50px,
  top: 20px,
  background-color: white;
  border-radius: 50%;
  text-align: center;
`;

const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-transform: uppercase;
`;



const Game = props => {
  const [cardsOfPlayer, setCardsOfPlayer] = useState(useLocation().state?.cardsOfPlayer);
  const [trickToPlay, setTrickToPlayer] = useState(useLocation().state?.trickToPlay);
  const [playerStartsTrick, setPlayerStartsTrick] = useState(useLocation().state?.playerStartsTrick);
  const [cardsPlayed, setCardsPlayed] = useState(useLocation().state?.cardsPlayer);
  const [hasTrickStarted, setHasTrickStarted] = useState(useLocation().state?.hasTrickStarted);
  const [idOfRoundStartingPlayer, setIdOfRoundStartingPlayer] = useState(useLocation().state?.idOfRoundStartingPlayer);



  const gameId = useLocation().state?.id || sessionStorage.getItem('gameId');
  const myId = JSON.parse(sessionStorage.getItem('user'))?.id;
  const myIndex = getMyIndex(useLocation().state) || sessionStorage.getItem('myIndex');



  useEffect(async () => {
    const response = await fetchGame();
    if(!sessionStorage.getItem('gameId')) {
      sessionStorage.setItem('gameId', response.data.id);
    }
    if(!sessionStorage.getItem('myIndex')) {
      sessionStorage.setItem('myIndex', getMyIndex(response.data));
    }
  }, [])


  const fetchGame = async () => {
    const response = await api.get(`/games/${gameId}/${myId}`);
    return response.data;
  }

  const getMyIndex = state => {
    if(state == null) return null;

    return Object.entries(state)
        .filter(([key, val]) => (val === myId && key.substring(0, 6) === 'player'))
        .map(([key, val]) => parseInt(key.charAt(6), 10))[0]
  }



}




















