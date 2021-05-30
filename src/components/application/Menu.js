import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import {useHistory, withRouter} from 'react-router-dom';
import './css/menu.css';
import {InvitationInjector} from "./menuAssets/InvitationInjector";
import {MenuGrid, MenuHeader} from "../../views/design/ElegantAssets";
import {RuleFramer, RuleItem} from "./menuAssets/JassEncyclopaedia";
import {UserList} from "./applicationAssets/UserList";



const Menu = () => {
  const [user] = useState(JSON.parse(sessionStorage.getItem('user')));
  const history = useHistory();


  /* add beforeunload event listener.
  What I actually wanted to achieve was for a user to get logged
  out once he closes the tab or the browser and stay logged in
  if he only refreshes or navigates. However this behaviour is
  not that easily achievable even though the W3C recommends
  the High Resolution Time Level 2 API
  (see https://www.w3.org/TR/hr-time-2/#sec-performance) to track
  navigation types. But even then, if we would completely want to
  rely on that API, we could not track if a client e.g. powers off
  its device by force and hence could not handle him being logged
  out correctly.
  Thus we need to establish another mechanic to log out a client
  properly in the backend. So I came up with another idea which
  we might want to consider as an issue for this project:
  Utilize cookies and stomp. Once a user logs in and gets redirected
  to the menu, he receives a cookie from the backend. The frontend
  must validate this cookie on a new page render and since the
  cookie may expire, the user shall be logged out in case of
  expiration. However, in order to advertise truthful online-status
  information for a specific user, we might utilize the TCP connection
  established by stomp such that in case the client's TCP connection
  with the backend gets teared down, his status is then set to
  offline in the backend. Once that client re-establishes his TCP
  connection, his cookie gets validated once again and if the cookie
  hasn't expired by then and only then does the backend set his
  status to online again, otherwise he gets logged out.
  -- I will leave this here as a note for myself and my project group.
   */
  useEffect(() => {

    // alerts user before page unloads (tab/browser close or refresh) to cancel unload if desired
    const onBeforeUnload = event => {
      event.preventDefault();
      return event.returnValue = '';
    };

    // event listener...
    window.addEventListener('beforeunload', onBeforeUnload);

    // ...aaaand clean it up
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [])

  const logout = async () => {
    /** uncomment the following, when the backend is set up accordingly **/
    try {
      // request a user status update of myself ONLINE -> OFFLINE
      const myToken = user.token;
      await api.put(`/users/logout/${myToken}`);

      // add http.status handlers here...

      // remove token from localStorage and sessionStorage and push login page
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      history.push('login');

    } catch (error) {
      alert(`Something went wrong while trying to logout:\n${handleError(error)}`);
    }
  }


  return (
      <MenuGrid>
        <InvitationInjector userId={user?.id}/>
        <MenuHeader
            user={user}
            onClickProfile={() => history.push("/profile")}
            onClickCreate={() => history.push('/create')}
            onClickJoin={() => history.push({pathname: '/join', state: {user: user}})}
            onClickLogout={() => logout()}
        />
        <RuleFramer>
          <RuleItem heading={'Introduction to Jass'}>
            <div style={{textDecoration: 'underline'}}>Origin</div>
            The game «Jass» is not only a traditional Swiss card game, but is even seen as a national game in
            Switzerland. Originally, it comes from the Netherlands and was brought to Switzerland by Swiss soldiers in
            the end of the 18th century. The first written prove of Swiss peasants playing Jass is from 1796. The game
            became more popular among Switzerland in the 19th century.
            <div style={{textDecoration: 'underline'}}>Card deck</div>
            A Jass card deck consists of 36 different cards. The designs and suits of the cards vary, depending on the
            area of Switzerland. In the west and south of Switzerland, the French cards are used. In the northeast of
            Switzerland, Jass is played with the Swiss German cards. Those cards have the following four suits: bells
            (symbol), shields (symbol), acorns (symbol) and roses (symbol). These are the type of cards that we use in
            our Stübli. There are nine cards of each suit. These are the nine existing cards using the example of the
            shields (the first one being the highest):
            Ace (card), King (card), Ober (card), Under (card), Banner (card), 9 (card), 8 (card), 7 (card), 6 (card).
            The ace of shields is the trickiest card to recognize, since the shield motive on the ace looks a bit
            different from the other shield cards. The King, Ober and Under are identified by the words “KÖNIG”, “OBER”
            and “UNDER” printed on the cards.
            <div style={{textDecoration: 'underline'}}>Jass games</div>
            There are a number of different Jass Games you can play with the cards. Examples being the Bieter-Jass, Coiffeur-Jass, Sidi-Jass or the Schieber-Jass.
            Our Stübli is designed to play the Schieber-Jass (usually referred to as just “Schieber”). The Schieber is
            characterized by a traditional number of four players, of which two play as a team against the opponent two
            players. The teams take turn to choose the in-game mode. Contrary to other Jass games, the team members can
            freely choose any mode they would like to play each turn. The goal of the game is to reach a certain amount
            of points before the opponent team does.
          </RuleItem>
          <RuleItem heading={'How the Schieber works'}>
            <div style={{textDecoration: 'underline'}}>How to sit and distribute the cards</div>
            The players always sit opposite to their partners. Each round, all 36 cards are being distributed equally
            among the four players. The cards are always distributed anticlockwise. The dealer needs to give three cards
            at the time starting with the player on his right, ending with themselves. The dealer switches after every
            game always being the person who chose the mode for the previous game. The first hand can be dealt by any
            player.
            <div style={{textDecoration: 'underline'}}>Starting card</div>
            Usually, the four players agree on a starting card together, before they start to distribute the cards.
            Whoever gets this certain agreed card in the very first round, has the privilege to start the game.
            <div style={{textDecoration: 'underline'}}>Starting a round</div>
            Starting the game means to choose a game mode to be played for the next round, meaning the next nine tricks.
            The player whose turn it is to pick the mode always has the option to choose himself or to shove. If they
            shove, their partner must pick the mode to be played. Regardless of which scenario takes place, the player
            who was initially supposed to pick the game mode starts the round by placing the first card.
          </RuleItem>
          <RuleItem>
            <div style={{textDecoration: 'underline'}}>Tricks</div>
            Every round consists of nine tricks. In every trick, each player is obligated to give one card. The cards
            are given by the players in the same order as they sit, going anticlockwise. The player deciding the game
            mode can start placing the very first card. After that, always the player that wins the trick can place the
            first card of the next trick.
            <div style={{textDecoration: 'underline'}}>Winning a trick</div>
            Whoever plays the highest card of the trick wins the trick. Winning a trick means that the points of the four lying cards belong to the team that won the trick.
            <div style={{textDecoration: 'underline'}}>Finishing a round</div>
            After a round is finished, all the points made in the round get counted and added to the teams’ score. The points get multiplied by the factor the game mode is worth.
            The very last trick of the round gives an extra 5 points to the team that wins the last trick. The points made in a round always add up to a total of 157 points.
            <div style={{textDecoration: 'underline'}}>Finishing a game</div>
            Before the game starts, the players agree upon a number of points that the winner team must reach. Usually
            this number is between 1’000 and 5’000 points. The team that reaches this number first, wins the game. A lot
            of times, this happens in the middle of a round. The players are then allowed to call the win and end the
            game if they want. Whichever team calls the win first, wins.
          </RuleItem>
          <RuleItem heading={'The different game modes'}>
            <div style={{textDecoration: 'underline'}}>Obenabe</div>
            Obenabe is the classical game mode where the order of the cards is exactly how indicated above (Ace, King,
            Ober, Under, Banner, 9, 8, 7, 6). If I start the trick with an ace, I know that I am going to win the trick.
            This game mode is ideal to pick if your hand consists of mostly high cards (Aces, Kings and Obers) or if you
            have a street of a suit starting from an ace (for example acorn Ace, King, Ober, Under, Banner).
            <div style={{textDecoration: 'underline'}}>Undenufe</div>
            If the game mode Undenufe is chosen, the card that is usually the lowest, becomes the highest and vice
            versa: 6, 7, 8, 9, Banner, Under, Ober, King, Ace. This game mode is ideal to pick if your hand consists of
            mostly low cards (6s, 7s and 8s) or if you have a street of a suit starting from a 6 (for example acorn 6,
            7, 8, 9, Banner).
            <div style={{textDecoration: 'underline'}}>Trump</div>
            Any suit can be chosen to be the trump suit. The trump suit is higher than any other suit. For example, if
            acorn gets picked to be the trump suit, the acorn 6 is considered higher than the rose ace. Within the
            trump suit, the order remains the same as for Obenabe, with the exception that the Under is the very highest
            card (and is called Puur), followed by the nine (called Näll). Thereafter the order follows as usual. In all
            the three other suits that are not trump, the ace remains the highest card. This game mode is ideal to pick
            if you have a potential Puur and Näll and other high trump cards next to a few other high cards (for example
            acorn Under, 9, King, 7, rose Ace, shield Ace, King, Under).
          </RuleItem>
          <RuleItem>
            <div style={{textDecoration: 'underline'}}>Slalom</div>
            Slalom is a mixture between Obenabe and Undenufe. The player who’s turn it is to choose the game mode can
            decide whether he wants to start the first trick with Obenabe or Undenufe. Thereafter Obenabe and Undenufe
            are played alterning. Meaning one trick the ace is the highest card, the next one the 6 is being the highest
            card etc. If a player shoves to his partner, who chooses Slalom, the player who shoved still needs to decide
            whether to start with Obenabe or Undenufe. This game mode is ideal to pick if you have some high cards, but
            also the same number of low cards (for example acorn Ace, King, Under, 6, rose Ace, Ober, 7, 6, shield 6).
            Playing them alternating allows you to win as many tricks as possible.
            <div style={{textDecoration: 'underline'}}>Gusti</div>
            Gusti is similar to Slalom, just that Obenabe is played for the first five tricks and Undenufe for the
            last four tricks. This game mode is ideal to pick if you have a high number of high cards, but also very few
            low cards that you would like to make use of (for example acorn Ace, King, Ober, rose Ace, shield Ace, 7,
            6).
            <div style={{textDecoration: 'underline'}}>Mary</div>
            Mary is similar to Gusti, just that Undenufe is played for the first five tricks and Obenabe for the last
            four tricks. This game mode is ideal to pick if you have a high number of los cards, but also very few high
            cards that you would like to make use of (for example acorn 6, 7, 8, rose 6, shield 6, King, Ace).
          </RuleItem>
          <RuleItem heading={'Points of the cards'}>
            <div style={{textDecoration: 'underline'}}>General system</div>
            For every round there is a total of 157 points to be split between the two teams. Depending on the game mode
            that gets picked, the points of the cards vary.
            For the game modes Obenabe, Guschti and Slalom (starting with Obenabe), the points are given to the cards
            the following way: Ace – 11 points, King – 4 points, Ober – 3 points, Under – 2 points, Banner – 10 points,
            9 – 0 points, 8 – 8 points, 7 – 0 points, 6 – 0 points.
            For the game modes Undenufe, Mary and Slalom (starting with Undenufe), the points are given the same way, just that the 6 is worth 11 points and the ace 0 points.
            If a suit is chosen to be the trump suit, the trump cards have the following point system: Under (Puur) – 20 points, 9 (Näll) – 14 points, King – 4 points, Ober – 3 points,
            Under – 2 points, Banner – 10 points, 8 – 0 points, 7 – 0 points, 6 – 0 points.
            All the other suits that are not trump are counted the same way as Obenabe, just that the 8 is worth no points.
            <div style={{textDecoration: 'underline'}}>Multiplicators</div>
            Before the game is started, the players agree upon the multiplicators associated to the different game modes. A typical example would be the following:
            Acorn, Rose – 1x;
            Bell, Shield – 2x;
            Obenabe, Undenufe – 3x;
            Gusti, Mary, Slalom – 4x;
            These multiplicators mean that the final score of one round is multiplied with the corresponding
            multiplicator of the game mode chosen. For example, if I have played Bell and scored a 83 points with my
            partner, I would multiply my score by two and get a total of 166 points added to my score.
          </RuleItem>
          <RuleItem heading={'Additional Jass Rules'}>
            <div style={{textDecoration: 'underline'}}>Serve the suit dealt</div>
            The most central rule of the game is that you have to serve the suit that was dealt. Meaning that the first player of the trick decides which suit all the following players have to play.
            If you do not have any card of the dealt suit anymore, you can give a card of any suit you would like. This card is lower than the dealt card and never wins the trick.
            Example: The rose Under is dealt. The other three players play the rose 8, rose 7 and the acorn ace. The rose Under wins the trick.
            The only situation in which you can win a trick by not serving the suit that is dealt is if you play a trump card. The trump card always wins.
            Example: Acorn is trump. The rose ace is dealt. The other three players play the rose banner, rose 7 and the acorn 6. The acorn 6 wins the trick.
            This rule also applies to the trump suit. If the first player of the trick deals a trump card, all the other players need to serve, namely give a trump card (if they have one).
            The only exception to the rule is the Puur (trump Under). This card, you do never have to serve!
            Example 1: Acorn is trump. The acorn king is dealt. I have the acorn 7 and the acorn Under. I can play either card if I want to, but I cannot give a card of a different suit.
            Example 2: Acorn is trump. The acorn king is dealt. I only have the acorn Under. I can play it if I want to, but I do not have to. I can give a card of a different suit.
          </RuleItem>
          <RuleItem>
            <div style={{textDecoration: 'underline'}}>Match</div>
            If a team makes all nine tricks of the round, they make a so-called match. The team does not only get all
            the usual 157 points of the round, but also a bonus of 100 points, which adds up to a total of 257 points.
            Additionally, those 257 points get multiplied by the corresponding multiplicator decided on in the beginning
            of the game.
            <div style={{textDecoration: 'underline'}}>Undertrumping rule</div>
            If a trump card is dealt by the first player of the trick, all other players need to serve with a trump card
            as usual. In this case, the players can (or even have to) serve any trump card, no matter if it is higher or
            lower than the dealt card. However, if the card dealt is no card of trump suit and another player plays a
            card of trump suit, then any player following up is disallowed to play a card of trump suit that is lower
            than the trump card already played. This rule has only one exception: If the player following up does have only
            trump cards left in their hand, they are allowed to play any of them (i.e. they are then also not obliged to play
            a higher trump card as the one already played).
            <div style={{textDecoration: 'underline'}}>Weis and Stöck</div>
            There are two other concepts which are possible to integrate in Jass but not necessary for playing the game itself,
            they are called "Weis" and "Stöck". Since this application is not yet as far to support those concepts, their explanation
            is omitted here.
          </RuleItem>
        </RuleFramer>
        <UserList onMountOpen={true}/>
      </MenuGrid>
  );
}

export default Menu;