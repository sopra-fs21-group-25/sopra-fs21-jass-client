import styled from "styled-components";
import React, {useState} from 'react';
import {Button} from "../../../views/design/Button";
import {api} from "../../../helpers/api";



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
      <OuterSearchbarContainer>
        <StyledInput
            onChange={e => handleChange(e.target.value)}
            placeholder={'Search users...'}
            value={textInput}
        />
        <SearchListContainer>
          {users.map(user => (
              <LobbySearchListItem
                  key={user.id}
                  user={user}
                  lobbyId={props.lobbyId}
                  lobbyCreator={props.lobbyCreator}
                  client={stompClient}
                  clearList={handleChange}
              />
          ))}
        </SearchListContainer>
      </OuterSearchbarContainer>
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
      <ListItemWrapper>
        <LeftItemComponentContainer>
          {props.user.username}
        </LeftItemComponentContainer>
        <RightItemComponentContainer>
          <InviteButton onClick={() => inviteUser()}>Invite</InviteButton>
        </RightItemComponentContainer>
      </ListItemWrapper>
  );
}

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
      <GridContainer>
        <ButtonContainer id={'top'} position={{col: 2, row: 1}}>
          {
            props.tableUsers[0] ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => props.tableUsers[0].username === user.username && handleUnsit()}
                >{props.tableUsers[0].username}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => handleSit('TOP')}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'bottom'} position={{col: 2, row: 3, }}>
          {
            props.tableUsers[2] ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => props.tableUsers[2].username === user.username && handleUnsit()}
                >{props.tableUsers[2].username}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => handleSit('BOTTOM')}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'left'} position={{col: 1, row: 2}}>
          {
            props.tableUsers[1] ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => props.tableUsers[1].username === user.username && handleUnsit()}
                >{props.tableUsers[1].username}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => handleSit('LEFT')}
                >Sit</Button>
            )
          }
        </ButtonContainer>
        <ButtonContainer id={'right'} position={{col: 3, row: 2}}>
          {
            props.tableUsers[3] ? (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => props.tableUsers[3].username === user.username && handleUnsit()}
                >{props.tableUsers[3].username}</Button>
            ) : (
                <Button
                    style={{display: 'inline-block', width: 'auto'}}
                    onClick={() => handleSit('RIGHT')}
                >Sit</Button>
            )
          }
        </ButtonContainer>

        <Jasstable/>

      </GridContainer>
  );
}

export const LobbyPlayerList = props => {
  const stompClient = props.client;
  const lobbyId = props.lobbyId;


  return (
      <div>
        <ul>
          {props.users ? (
              props.users.map((user, index) =>
                  <LobbyPlayerListItem
                      key={index}
                      user={user}
                      removable={props.permitted && props.creator !== user.username}
                      client={stompClient}
                      lobbyId={lobbyId}
                  />)
          ) : (
              <></>
          )}
        </ul>
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
      <li>
        <ItemContainer>
          <LeftItemComponentContainer>
            {props.user.username}
          </LeftItemComponentContainer>
          <RightItemComponentContainer>
            {props.removable ? (
                <RemoveButton onClick={() => removeUser()}>X</RemoveButton>
            ) : <></>}
          </RightItemComponentContainer>
        </ItemContainer>
      </li>
  );
};

export const LobbyWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 2fr;
  grid-template-rows: 1fr 1fr 5fr 1fr 1fr;
  grid-gap: 1em;
  width: 100%;
  height: 100%;
  margin: 1em;
`;
export const SearchBar = styled.input`
  grid-column: 2;
  grid-row: 1;
  &::placeholder {
    color: rgba(154, 152, 153, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin: 1em;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.8);
  color: black;
`;
export const JassTeppichWrapper = styled.div`
  grid-column: 2;
  grid-row: 3; 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
export const PlayerWrapper = styled.div`
  grid-column: 1;
  grid-row: 2 / 4; 
  width: 100%;
  height: 100%;
  align-self: center;
  background-color: #707070;
  opacity: 80%;
  border: none;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr 9fr;
`;
export const PlayerHeader = styled.div`
  grid-row: 1;
  background-color: #808080;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
`;
export const PlayerListWrapper = styled.div`
  grid-row: 2;
`;
export const ChatWrapper = styled.div`
  grid-column: 3;
  grid-row: 2 / 4; 
  width: 100%;
  height: 100%;
  align-self: center;
  background-color: #add8e6;
  opacity: 80%;
  border: none;
  border-radius: 10px;
`;
export const StartButton = styled.button`
  grid-column: 2;
  grid-row: 5; 
  min-width: 170px;
  width: 50%;
  height: 2em;
  align-self: center;
  justify-self: center;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;
export const BackButton = styled.button`
  grid-column: 1;
  grid-row: 5; 
  min-width: 170px;
  width: 50%;
  height: 2em;
  align-self: center;
  justify-self: start;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;

const StyledInput = styled.input`
  &::placeholder {
    color: rgba(154, 152, 153, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  color: black;
  width: 100%;
`;
const SearchListContainer = styled('div')({
  display: 'block',
  width: '100%',
  maxHeight: '40%',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingLeft: '10px',
  paddingRight: '10px',
  zIndex: 8
});
const OuterSearchbarContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: '30%',
  right: '30%',
  display: 'flex',
  width: '40%',
  maxHeight: '40%',
  justifyContent: 'center',
  flexDirection: 'column',
  marginTop: '20px',
});
const ListItemWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  height: '50px',
  background: 'linear-gradient(0deg, rgba(96,149,147,0.8) 0%, rgba(89,89,89,0.8) 100%)',
  borderBottom: '1px solid #333333'
});
const InviteButton = styled.button`
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 60%;
  height: 60%;
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  background: rgb(90, 90, 90, 1);
  transition: all 0.3s ease;
`;
const ItemContainer = styled('div')({
  display: 'flex',
  width: '100%',
  height: '50px',
  border: '1px solid black',
  background: '#7F8385'
});
const LeftItemComponentContainer = styled('div')({
  display: 'flex',
  width: '70%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '15px',
  color: 'white'
});
const RightItemComponentContainer = styled('div')({
  display: 'flex',
  width: '30%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
});
const RemoveButton = styled.button`
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 60%;
  height: 60%;
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  background: rgb(186, 31, 31, 1);
  transition: all 0.3s ease;
`;
const GridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 8fr 1fr',
  gridTemplateRows: '1fr 8fr 1fr',
  gridGap: '5px',
  width: '100%',
  height: 'auto',
  aspectRatio: '1'
});
const Jasstable = styled('div')({
  gridColumn: 2,
  gridRow: 2,
  background: '#1F7A20',
  border: '1px solid black',
  borderRadius: '5px'
});
const ButtonContainer = styled.div`
  grid-column: ${props => props.position.col || 1};
  grid-row: ${props => props.position.row || 1};
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
  -ms-transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
  transform: ${props => props.id === 'left' ? 'rotate(-90deg)' : (props.id === 'right' ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

