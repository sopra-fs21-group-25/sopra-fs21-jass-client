import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

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

const LeftItemComponentContainer = styled('div')({
  display: 'flex',
  width: '70%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: '15px',
  color: 'white',
});

const RightItemComponentContainer = styled('div')({
  display: 'flex',
  width: '30%',
  height: 'inherit',
  alignItems: 'center',
  justifyContent: 'center',
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

const LobbySearchListItem = props => {
  const stompClient = props.client;


  const inviteUser = () => {
    stompClient.publish({
      destination: `/app/lobbies/invite/${props.user.id}`,
      body: `${props.lobbyId}`
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
                  client={stompClient}
                  clearList={handleChange}
              />
          ))}
        </SearchListContainer>
      </OuterSearchbarContainer>
  );

}
