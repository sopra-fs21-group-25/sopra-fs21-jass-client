import styled from "styled-components";
import React, {useState} from 'react';
import {Button} from "../../../views/design/Button";
import {api} from "../../../helpers/api";
import {GlowButton, IconicInput} from "../../../views/design/ElegantAssets";
import './lobbyAssets.scss';



export const LobbyJassTable = props => {
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleUnsit = async () => {
    await api.put(`/lobbies/${props.lobbyId}/unsit/${user.id}`)

    props.client.publish({
      destination: `/app/lobbies/${props.lobbyId}/fetch`,
      body: ''
    });
  };

  const handleSit = async pos => {
    // only handle sitting at pos if I'm not already sitting somewhere
    if(!props.tableUsers.map(u => u?.id).includes(user.id)) {
      await api.put(`/lobbies/${props.lobbyId}/sit/${user.id}/${pos}`)

      props.client.publish({
        destination: `/app/lobbies/${props.lobbyId}/fetch`,
        body: ''
      });
    }
  };

  return (
      <div className={'jass-table-wrapper'}>
        <div className={'jass-table__grid-root'}>
          <div className={'chair-container top-wrapper'}>
            {props.tableUsers[0] ?
                <div className={'player-wrapper-top'}>
                  <button className={'player-container-top'} onClick={() => props.tableUsers[0].username === user.username && handleUnsit()}>
                    <div className={'avatar-container-top'}>
                      <img className={'avatar-top user-avatar-style'} src={props.tableUsersPictures[0]} alt={''}/>
                    </div>
                    <div className={'text-container-top'}>
                      {props.tableUsers[0].username}
                    </div>
                  </button>
                </div>
                :
                <button className={'top-chair'} onClick={() => handleSit('TOP')}>
                  <div className={'top-chair__text'}>
                    sit
                  </div>
                </button>
            }
          </div>
          <div className={'chair-container bottom-wrapper'}>
            {props.tableUsers[2] ?
                <div className={'player-wrapper-bottom'}>
                  <button className={'player-container-bottom'} onClick={() => props.tableUsers[2].username === user.username && handleUnsit()}>
                    <div className={'avatar-container-bottom'}>
                      <img className={'avatar-bottom user-avatar-style'} src={props.tableUsersPictures[2]} alt={''}/>
                    </div>
                    <div className={'text-container-bottom'}>
                      {props.tableUsers[2].username}
                    </div>
                  </button>
                </div>
                :
                <button className={'bottom-chair'} onClick={() => handleSit('BOTTOM')}>
                  <div className={'bottom-chair__text'}>
                    sit
                  </div>
                </button>
            }
          </div>
          <div className={'chair-container left-wrapper'}>
            {props.tableUsers[1] ?
                <div className={'player-wrapper-left'}>
                  <button className={'player-container-left'} onClick={() => props.tableUsers[1].username === user.username && handleUnsit()}>
                    <div className={'text-container-left'}>
                      {props.tableUsers[1].username}
                    </div>
                    <div className={'avatar-container-left'}>
                      <img className={'avatar-left user-avatar-style'} src={props.tableUsersPictures[1]} alt={''}/>
                    </div>
                  </button>
                </div>
                :
                <button className={'left-chair'} onClick={() => handleSit('LEFT')}>
                  <div className={'left-chair__text'}>
                    sit
                  </div>
                </button>
            }
          </div>
          <div className={'chair-container right-wrapper'}>
            {props.tableUsers[3] ?
                <div className={'player-wrapper-right'}>
                  <button className={'player-container-right'} onClick={() => props.tableUsers[3].username === user.username && handleUnsit()}>
                    <div className={'avatar-container-right'}>
                      <img className={'avatar-right user-avatar-style'} src={props.tableUsersPictures[3]} alt={''}/>
                    </div>
                    <div className={'text-container-right'}>
                      {props.tableUsers[3].username}
                    </div>
                  </button>
                </div>
                :
                <button className={'right-chair'} onClick={() => handleSit('RIGHT')}>
                  <div className={'right-chair__text'}>
                    sit
                  </div>
                </button>
            }
          </div>
          <div className={'jass-table__table-image'}/>
        </div>
      </div>
  );
}

export const LobbySearchbar = props => {
  const [users, setUsers] = useState([]);
  const [textInput, setTextInput] = useState('');
  const stompClient = props.client;


  const handleChange = val => {
    if(val === '') {

      // no text-input then set users to default and text-field empty
      setTextInput('');
      setUsers([]);
    } else {

      // update text-field
      setTextInput(val);

      // construct regex to match input-text with username; Note: 'i' flag indicates case-insensitive
      const regex = new RegExp(val, 'i');

      // filter list of users by leveraging matching the regex;
      // Note: string.match(regexp) returns null iff no match hence double logical NOT returns true if match
      const filteredUsers = props.users.filter(u => !!u.username.match(regex));

      // set users to filtered users
      setUsers(filteredUsers);
    }
  }

  return (
      <div className={'searchbar__content-wrapper'}>
        <div className={'searchbar__input-wrapper'}>
          <IconicInput
              type={'text'}
              onChange={e => handleChange(e.target.value)}
              placeholder={'search users...'}
              value={textInput}
              defaultIcon={'search'}
              highlightIcon={'search'}
              defaultIconColor={'rgba(221, 221, 221, 0.5)'}
              highlightIconColor={'rgba(221, 221, 221, 0.9)'}
              style={{marginBottom: 0}}
          />
        </div>
        <div className={'searchbar__list-wrapper'}>
          <div className={'searchbar__list-container'}>
            {users.map(user => (
                <LobbySearchListItem
                    key={user.id}
                    user={user}
                    lobbyId={props.lobbyId}
                    lobbyCreator={props.lobbyCreator}
                    client={stompClient}
                    clearList={() => handleChange('')}
                />
            ))}
          </div>
        </div>
      </div>
  );

}
const LobbySearchListItem = props => {
  const stompClient = props.client;


  const inviteUser = () => {
    console.log({props})
    stompClient.publish({
      destination: `/app/lobbies/invite/${props.user.id}`,
      body: JSON.stringify({
        lobbyId: props.lobbyId,
        lobbyCreator: props.lobbyCreator
      })
    });

    props.clearList('');
  }

  return (
      <div className={'searchbar__list-item-wrapper'}>
        <div className={'searchbar__list-item-left-container'}>
          {props.user.username}
        </div>
        <div className={'searchbar__list-item-right-container'}>
          <button className={'searchbar__invite-button'} onClick={() => inviteUser()}>invite</button>
        </div>
      </div>
  );
}

export const LobbyPlayerList = props => {
  return (
      <div className={'player-list-wrapper'}>
        <div className={'player-list__inner-wrapper-root'}>
          <div className={'player-list__inner-header'}>
            Users in Lobby
          </div>
          <div className={'player-list__inner-body'}>
            {props.users ? (
                props.users.map((user, index) =>
                    <LobbyPlayerListItem
                        key={index}
                        user={user}
                        removable={props.permitted && props.creator !== user.username}
                        client={props.client}
                        lobbyId={props.lobbyId}
                    />)
            ) : (
                <></>
            )}
          </div>
        </div>
      </div>
  );
}
const LobbyPlayerListItem = props => {

  const removeUser = () => {
    props.client.publish({
      destination: `/app/lobbies/${props.lobbyId}/kicked/${props.user.id}`,
      data: null
    })
  };

  return (
      <div className={'player-list__list-item-wrapper'}>
        <div className={'player-list__list-item-left-container'}>
          {props.user.username}
        </div>
        <div className={'player-list__list-item-right-container'}>
          {props.removable ?
            <button className={'player-list__remove-button'} onClick={() => removeUser()}>❌</button>
          :<></>}
        </div>
      </div>
  );
}
