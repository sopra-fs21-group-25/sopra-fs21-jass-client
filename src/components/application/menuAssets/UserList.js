import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Col, Nav, Row, Tab} from "react-bootstrap";
import {GlowButton, IconicInput} from "../../../views/design/ElegantAssets";
import {api} from "../../../helpers/api";
import {useHistory} from "react-router-dom";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import { Menu, Item, theme, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import * as ReactDOM from "react-dom";

const FRIEND_MENU_ID = 'friend_menu_id';
const USER_MENU_ID = 'user_menu_id';
const appRoot = document.getElementById('root');


export const UserList = () => {

  const [user] = useState(JSON.parse(sessionStorage.getItem('user')));

  const [friendRequests, setFriendRequests] = useState([]);
  const [fetchRequestsSwitch, setFetchRequestsSwitch] = useState(false);

  const [friends, setFriends] = useState([]);
  const [fetchFriendsSwitch, setFetchFriendsSwitch] = useState(false);

  const [remainingUsers, setRemainingUsers] = useState([]);
  const [fetchUsersSwitch, setFetchUsersSwitch] = useState(false);

  const [friendSearch, setFriendSearch] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');

  const history = useHistory();
  const stompClient = useStompClient();

  const {show} = useContextMenu();
  const displayMenu = (event, userId, menuId) => {
    show(event, {
      id: menuId,
      props: {
        userId: userId
      }
    });
  };

  const inputStyle = {
    background: 'transparent',
    borderRadius: 0,
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
    borderBottom: '1px solid rgba(221, 221, 221, .5)',
  };


  // did the user delete the sessionStorage for fun? redirect to login page
  useEffect(() => {if(!user) {history.push('/login')}}, []);

  useEffect(() => {
    const fetchAndSetFriends = async () => {
      const friendResponse = await api.get(`/friends/${user.id}`);
      setFriends(friendResponse.data);
      return friendResponse.data;
    };
    fetchAndSetFriends().then(setFriends => console.log('Fetched and set friends: ', {setFriends}));
  }, [fetchFriendsSwitch]);

  useEffect(() => {
    const fetchAndSetFriendRequests = async () => {
      const friendRequestResponse = await api.get(`/friend_requests/with_username/${user.id}`);
      setFriendRequests(friendRequestResponse.data);
      return friendRequestResponse.data;
    };
    fetchAndSetFriendRequests().then(setRequests => console.log('Fetched and set friend requests: ', {setRequests}));
  }, [fetchRequestsSwitch]);

  useEffect(() => {
    const fetchAndSetRemainingUsers = async () => {
      const usersResponse = await api.get(`/users/not_friends/${user.id}`);
      setRemainingUsers(usersResponse.data);
      return usersResponse.data;
    };
    fetchAndSetRemainingUsers().then(setUsers => console.log('Fetched and set remaining users: ', {setUsers}));
  }, [fetchUsersSwitch]);


  // use the following useEffect to re-fetch friends and users every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setFetchUsersSwitch(prev => !prev);
      setFetchFriendsSwitch(prev => !prev);
    }, 10000);

    // cleanup
    return () => clearInterval(interval);
  }, [])


  useSubscription(`/friend_requests/notify/${user.id}`, msg => {
    console.log({msg: msg.body});
    if(msg.body === 'new-request') {
      setFetchRequestsSwitch(!fetchRequestsSwitch);
    }
    if(msg.body === 'accept-request') {
      setFetchFriendsSwitch(!fetchFriendsSwitch);
      setFetchUsersSwitch(!fetchUsersSwitch);
    }
  });

  useSubscription(`/friends/notify_remove/${user.id}`, () => {
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);
  });


  const acceptFriendRequest = async (reqId, fromId) => {
    await api.post(`/friend_requests/accept/${reqId}`);
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchRequestsSwitch(!fetchRequestsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);

    console.log({fromId});

    stompClient.publish({
      destination: `/app/friend_requests/${fromId}`,
      body: 'accept-request'
    });
  }
  const declineFriendRequest = async reqId => {
    await api.delete(`/friend_requests/decline/${reqId}`);
    setFetchRequestsSwitch(!fetchRequestsSwitch);
  }
  const sendFriendRequest = async toUserId => {
    await api.post(`/friend_requests/${user.id}/${toUserId}`)

    stompClient.publish({
      destination: `/app/friend_requests/${toUserId}`,
      body: 'new-request'
    });
  }

  const removeFriend = async friendId => {
    await api.delete(`/friends/${user.id}/${friendId}`);
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);

    stompClient.publish({
      destination: `/app/friends/notify_remove/${friendId}`
    })
  }



  return (
    <ListWrapper>
      <Tab.Container defaultActiveKey={'global'}>
        <ColStyled>
          <RowStyled>
            <NavStyled>
              {user && user.userType !== 'GuestUser' ?
                  <NavItemStyled>
                    <Nav.Link eventKey={'friends'}>friends</Nav.Link>
                  </NavItemStyled>
              : <></>}
              <NavItemStyled>
                <Nav.Link eventKey={'global'}>global</Nav.Link>
              </NavItemStyled>
            </NavStyled>
          </RowStyled>
          <RowStyled flex={'1 1 auto'}>
            <TabContentStyled>
              <PaneStyled eventKey={'friends'}>
                <PaneContentWrapper>
                  <SearchBarContainer>
                    <IconicInput
                        type={'text'}
                        placeholder={'search friends...'}
                        onChange={e => setFriendSearch(e.target.value)}
                        defaultIcon={'search'}
                        highlightIcon={'search'}
                        defaultIconColor={'rgba(221, 221, 221, 0.5)'}
                        highlightIconColor={'rgba(221, 221, 221, 0.9)'}
                        style={inputStyle}
                    />
                  </SearchBarContainer>
                  <ColumnWrapper>
                    {friendRequests.map((req, index) =>
                      <RequestItem
                          key={index}
                          username={req.fromUsername}
                          accept={() => acceptFriendRequest(req.id, req.fromId)}
                          decline={() => declineFriendRequest(req.id)}
                      />
                    )}
                  </ColumnWrapper>
                  <ColumnWrapper>
                    {friends.filter(friend => {
                      if(!friendSearch) { return true; }
                      const regex = new RegExp(friendSearch, 'i');
                      return !!friend.username.match(regex);
                    }).map((friend, index) =>
                        <div key={index} onContextMenu={e => displayMenu(e, friend.id, FRIEND_MENU_ID)}>
                          <UserItem status={friend.status} username={friend.username}/>
                        </div>
                    )}
                    <Portal>
                      {/*
                      we need to leverage a portal here to ensure correct positioning of the
                      context menu inside the 'relative' positioned pane element
                      */}
                      <Menu id={FRIEND_MENU_ID} theme={theme.dark}>
                        <Item onClick={() => alert('Not implemented yet')}>📨 send message</Item>
                        <Item onClick={e => removeFriend(e.props.userId)}>❌ remove from friends</Item>
                      </Menu>
                    </Portal>
                  </ColumnWrapper>
                </PaneContentWrapper>
                <MessageButton onClick={() => alert('Not implemented yet')}>
                  <i className={'material-icons'}>mail</i>
                </MessageButton>
              </PaneStyled>
              <PaneStyled eventKey={'global'}>
                <PaneContentWrapper>
                  <SearchBarContainer>
                    <IconicInput
                        type={'text'}
                        placeholder={'search online users...'}
                        onChange={e => setGlobalSearch(e.target.value)}
                        defaultIcon={'search_outline'}
                        highlightIcon={'search'}
                        defaultIconColor={'rgba(221, 221, 221, 0.5)'}
                        highlightIconColor={'rgba(221, 221, 221, 0.9)'}
                        style={inputStyle}
                    />
                  </SearchBarContainer>
                  <ColumnWrapper>
                    {remainingUsers.filter(user => {
                      if(!globalSearch) { return true; }
                      const regex = new RegExp(globalSearch, 'i');
                      return !!user.username.match(regex);
                    }).map((globalUser, index) =>
                        <div key={index} onContextMenu={e => displayMenu(e, globalUser.id, USER_MENU_ID)}>
                          <UserItem status={globalUser.status} username={globalUser.username}/>
                        </div>
                    )}
                    <Portal>
                      {/*
                      we need to leverage a portal here to ensure correct positioning of the
                      context menu inside the 'relative' positioned pane element
                      */}
                      <Menu id={USER_MENU_ID} theme={theme.dark}>
                        <Item onClick={e => sendFriendRequest(e.props.userId)}>📜 send friend request</Item>
                      </Menu>
                    </Portal>
                  </ColumnWrapper>
                </PaneContentWrapper>
              </PaneStyled>
            </TabContentStyled>
          </RowStyled>
        </ColStyled>
      </Tab.Container>
    </ListWrapper>
  );
}

// used to render contextmenu correctly with its fixed position
// relative to the app root DOM node instead of the relative
// positioned tab pane node
const Portal = props => {
  const [divEle] = useState(document.createElement('div'));
  useEffect(() => {
    appRoot.appendChild(divEle);

    const removeChild = () => { appRoot.removeChild(divEle); }

    window.addEventListener('beforeunload', removeChild);
    return () => window.removeEventListener('beforeunload', removeChild);
  }, []);
  return ReactDOM.createPortal(
      props.children,
      divEle)
}

const RequestItem = props => {
  return (
    <RequestItemWrapper>
      <div className={'button-box'}>
        <IconButton className={'material-icons'} accept={true} onClick={() => props.accept()}>
          check_circle
        </IconButton>
        <IconButton className={'material-icons'} decline={true} onClick={() => props.decline()}>
          cancel
        </IconButton>
      </div>
      <div className={'username-box'}>
        accept friend request from <span style={{fontWeight: 600, paddingLeft: '0.3rem'}}> {props.username}</span>?
      </div>
    </RequestItemWrapper>
  );
}

const UserItem = props => {
  return (
    <UserItemWrapper status={props.status}>
      <div className={'material-icons status-box'}>
        circle
      </div>
      <div className={'username-box'}>
        {props.username}
      </div>
    </UserItemWrapper>
  );
}

const UserItemWrapper = styled.div`
  height: 80px;
  width: 100%;
  display: flex;
  box-shadow: inset 0 5px 8px -6px rgb(52, 52, 52), inset 0 -5px 8px -6px rgb(52, 52, 52);
  background: rgba(175, 175, 175, 0.6);

  & > div.status-box {
    height: 100%;
    width: 10%;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.status === 'ONLINE' ? '#048e11' : '#bf0101'};
  }
  
  & > div.username-box {
    height: 100%;
    width: 75%;
    font-family: 'Saira', sans-serif;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
  }
`;

const IconButton = styled.button`
  border: 0;
  background: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: ${props => props.accept ? '#02560A' : props.decline ? '#5E0712' : 'black'};
`;

const RequestItemWrapper = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  box-shadow: inset 0 5px 8px -6px rgb(52, 52, 52), inset 0 -5px 8px -6px rgb(52, 52, 52);
  background: rgba(80, 80, 80, 0.3);


  & > div.button-box {
    height: 100%;
    width: 25%;
    display: flex;
    justify-content: space-evenly;
  }

  & > div.username-box {
    height: 100%;
    width: 75%;
    font-family: 'Saira', sans-serif;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
  }
`;

const ColumnWrapper = styled.div`
  flex: 0 1 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
`

const SearchBarContainer = styled.div`
  flex: 0 1 auto;
  height: 60px;
  margin: 0 1rem 0 1rem;
`;

const PaneContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  
  overflow-x: hidden;
  overflow-y: auto;
`;

const MessageButton = styled(GlowButton)`
  position: absolute;
  bottom: 1%;
  left: 1%;
  width: 2.5rem;
  height: 2rem;
  min-width: 0;
  background: rgba(75, 115, 120, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContentStyled = styled(Tab.Content)`
  width: 100%;
  height: 100%;
`;

const ColStyled = styled(Col)`
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const PaneStyled = styled(Tab.Pane)`
  position: relative;
  width: 100%;
  height: 100%;
`;

const RowStyled = styled(Row)`
  width: 100%;
  margin: 0;
  padding: 0;
  flex: ${props => `${props?.flex}` || '0 1 auto'};
`;

const NavStyled = styled(Nav)`
  width: 100%;
  background: rgba(0, 0, 0, 0);
  flex-wrap: nowrap;
  border-bottom: 1px solid rgba(189, 189, 189, 0.6);
  box-shadow: 0 5px 15px 0 rgba(221,221,221,0.4);
`;

const NavItemStyled = styled(Nav.Item)`
  width: 100%;
  overflow: hidden;
  
  & > a.nav-link {
    text-align: center;
    color: rgba(221, 221, 221, 0.55);
    font-family: 'KoHo', sans-serif;
    font-weight: 400;
    font-size: 1rem;
    background: rgb(0, 0, 0, 0.8);
  }

  & > a.nav-link.active {
    font-weight: 700;
    background: rgb(0, 0, 0, 0.8) linear-gradient(0, rgba(221,221,221,0.4), transparent);
    background-blend-mode: screen;
    color: rgb(221, 221, 221);
  }
`;

const ListWrapper = styled.div`
  grid-column: 2;
  grid-row: 2;

  aspect-ratio: 2/3;
  height: 90%;
  align-self: center;
  justify-self: end;
  margin-right: 5%;
  overflow: hidden;
  display: block;

  border: 1px solid #dddddd;
  border-radius: 5px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
`;

