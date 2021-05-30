# Group 25 - Jass Game

## Introduction
The goal of this project is to build an application which allows multiple users to play the popular Swiss card game “Jass”. These include registering/logging in as a player, adding friends, creating or joining games, playing different modes of Jass on global or private tables and using the chat functionality to communicate with friends and opponents during the game. Overall the aim is to create a playable “Jass” game, with a playing atmosphere similar to the real world. The external API should be implemented by enabling the user to login with their Google account and use their Google profile picture as an avatar.

## Technologies
* React
* Java Spring Boot
* PostgeSQL
* Heroku: Cloud Application Platform

## High-level components
* [UserList](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/src/components/application/applicationAssets/UserList.js): component, which provides functionality of searching Global Users, adding Friends and communicate with Users by invoking Chat component.
* [Chat](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/src/components/application/applicationAssets/UserChat.js): component, which provides functionality of live communication between two or several users during lobby creation process, being in the game or simply private chatting.  
* [Lobby](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/src/components/application/LobbyPage.js): component, which makes it possible to prepare for the game, adjust in-game characteristics, invite people to the game or remove players from the lobby. 
* [Game](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/src/components/game/GamePlus.js): the most important component, which provides full experience of playing Jass. These include cards dealign, ability to play card, seeing scoreboard and much more.
* [Google Login](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/src/components/login/Login.js): external API, ability to sign in/sign up with your Google account.

## Launch & Deployment
### Frontend
Installing React dependencies:
### `npm install --legacy-peer-deps`
Running the app in the development mode:
### `npm run dev`
Builds the app for production to the `build` folder:
### `npm run build`

### Backend
You can use the local Gradle Wrapper to build the application.

Plattform-Prefix:

-   MAC OS X: `./gradlew`
-   Linux: `./gradlew`
-   Windows: `./gradlew.bat`

Running the app:
### `./gradlew bootRun`
Building the app:
### `./gradlew build`
To set up connection to the database refer to the [application.properties](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-server/blob/master/src/main/resources/application.properties).

### Deployment
Change to the deployment settings of the client [here](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-client/blob/master/.github/workflows/deploy.yml) and deployment settings of the server [here](https://github.com/sopra-fs21-group-25/sopra-fs21-jass-server/blob/master/.github/workflows/deploy.yml). As deployment server we use Heroku.

## Illustrations
### Login Page
On the Login Page User has several options: sign up, sign in, enter as Guest User or login with Google account. 
![alt text](./illustrations/login.png)

### Menu Page
By successful login User is redirected to the Menu Page. On the Menu Page User can go briefly through the Jass rules, add Global Users to friend list, communicating with other users via invoking chat, creating a new game or joining existing one. 
![alt text](./illustrations/menu.png)

### Profile Page
On the Profile Page User can either change his profile picture or his username. 
![alt text](./illustrations/profile.png)

### Lobby Page
On the Lobby page I can take a sit on the particular spot of the table and wait for other players. If I am a creator of the game, I can start the game. 
![alt text](./illustrations/lobby.png)

### Game Page
From the Lobby page, users are redirected to the Game page. On the Game page User can play cards, see scoreboard, experiencing full Jass Game. 
![alt text](./illustrations/game.png)

## Roadmap
:black_square_button: in case of internet failure/one or more inactive users: pause the game<br/>
:black_square_button: in running game: show player's avatars next to their end of the table<br/>
:black_square_button: add 'Merry' in-game mode<br/>
:black_square_button: add 'Gusti' in-game mode<br/>
:black_square_button: add 'Slalom' in-game mode<br/>

## Authors and acknowledgment
- [Gregory Frommelt](https://github.com/fromGreg)
- [Daniil Ratarov](https://github.com/RatarovDaniil)
- [Denys Trieskunov](https://github.com/treskdenis)
- [Laura Vogt](https://github.com/laura-vogt)

## License
We decided not to license our project since our creative work is under exclusive copyright by default. Nobody else can copy, distribute, or modify our work without being at risk of take-downs, shake-downs, or litigation.
