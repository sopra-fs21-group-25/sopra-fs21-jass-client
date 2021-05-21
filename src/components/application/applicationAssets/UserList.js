import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Col, Nav, Row, Tab} from "react-bootstrap";
import {GlowButton, IconicInput} from "../../../views/design/ElegantAssets";
import {api} from "../../../helpers/api";
import {useHistory} from "react-router-dom";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import { Menu, Item, theme, useContextMenu } from 'react-contexify';
import {UserChat} from './UserChat';
import 'react-contexify/dist/ReactContexify.css';
import * as ReactDOM from "react-dom";
import {UserType} from "../../shared/models/UserType";

const FRIEND_MENU_ID = 'friend_menu_id';
const USER_MENU_ID = 'user_menu_id';
const appRoot = document.getElementById('root');


export const UserList = () => {

  const dummyObjects = [
    {user: {id: 0, username: 'albert'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
    {user: {id: 1, username: 'betsy'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
    {user: {id: 2, username: 'colt'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
    {user: {id: 3, username: 'duster'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
    {user: {id: 4, username: 'etienne'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
    {user: {id: 5, username: 'francis'}, messageObj: [
        {
          message: "Lorem ipsum.",
          sentTime: "just now",
          direction: "incoming",
          position: "single"
        },
        {
          message: "sit ament bli bla blup.",
          sentTime: "just now",
          direction: "outgoing",
          position: "single"
        }
      ]},
  ]

  const [thisUser] = useState(JSON.parse(sessionStorage.getItem('user')));

  const [showChat, setShowChat] = useState(false);
  const [userMessageObjPairs, setUserMessageObjPairs] = useState(dummyObjects);
  const [activeChatTab, setActiveChatTab] = useState(null);

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
  const displayMenu = (event, user, menuId) => {
    event.preventDefault();
    if(thisUser.userType !== UserType.GUEST && user.userType !== UserType.GUEST) {
      show(event, {
        id: menuId,
        props: {
          user: user
        }
      });
    }
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
  useEffect(() => {if(!thisUser) {history.push('/login')}}, []);

  useEffect(() => {
    const fetchAndSetFriends = async () => {
      const friendResponse = await api.get(`/friends/${thisUser.id}`);
      setFriends(friendResponse.data);
      return friendResponse.data;
    };
    fetchAndSetFriends().then(setFriends => console.log('Fetched and set friends: ', {setFriends}));
  }, [fetchFriendsSwitch]);

  useEffect(() => {
    const fetchAndSetFriendRequests = async () => {
      const friendRequestResponse = await api.get(`/friend_requests/with_username/${thisUser.id}`);
      setFriendRequests(friendRequestResponse.data);
      return friendRequestResponse.data;
    };
    fetchAndSetFriendRequests().then(setRequests => console.log('Fetched and set friend requests: ', {setRequests}));
  }, [fetchRequestsSwitch]);

  useEffect(() => {
    const fetchAndSetRemainingUsers = async () => {
      const usersResponse = await api.get(`/users/not_friends/${thisUser.id}`);
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


  useSubscription(`/friend_requests/notify/${thisUser.id}`, msg => {
    console.log({msg: msg.body});
    if(msg.body === 'new-request') {
      setFetchRequestsSwitch(!fetchRequestsSwitch);
    }
    if(msg.body === 'accept-request') {
      setFetchFriendsSwitch(!fetchFriendsSwitch);
      setFetchUsersSwitch(!fetchUsersSwitch);
      setFetchRequestsSwitch(!fetchRequestsSwitch);
    }
  });

  useSubscription(`/friends/notify_remove/${thisUser.id}`, () => {
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);
  });


  const acceptFriendRequest = async fromId => {
    await api.post(`/friend_requests/accept/${fromId}/${thisUser.id}`);
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchRequestsSwitch(!fetchRequestsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);

    console.log({fromId});

    stompClient.publish({
      destination: `/app/friend_requests/${fromId}`,
      body: 'accept-request'
    });
  }
  const declineFriendRequest = async fromId => {
    await api.delete(`/friend_requests/decline/${fromId}/${thisUser.id}`);
    setFetchRequestsSwitch(!fetchRequestsSwitch);
  }
  const sendFriendRequest = async toUserId => {
    await api.post(`/friend_requests/${thisUser.id}/${toUserId}`)

    stompClient.publish({
      destination: `/app/friend_requests/${toUserId}`,
      body: 'new-request'
    });
  }
  const removeFriend = async friendId => {
    await api.delete(`/friends/${thisUser.id}/${friendId}`);
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);

    stompClient.publish({
      destination: `/app/friends/notify_remove/${friendId}`
    })
  }


  // triggers chat with a friend when via contextmenu 'send message' is clicked
  const triggerChatWithUser = async user => {
    let activeTab = null;
    if(!userMessageObjPairs.map(pair => pair.user.id).includes(user.id)) {
      // TODO: uncomment and set correct endpoint when backend set up
      /*
      const response = await api.get(`/ENDPOINT`);
      const newUserMessageObjPair = {user: user, messageObj: response.data};
      setUserMessageObjPairs([...userMessageObjPairs, newUserMessageObjPair]);
      activeTab = newUserMessageObjPair;
      */
      alert('Backend is not yet set up for this feature!');
    } else {
      activeTab = userMessageObjPairs.filter(pair => pair.user.id === user.id)[0];
    }
    setShowChat(true);
    openChatTab(activeTab);
  }

  // opens an already present but currently not active chat tab with a friend
  const openChatTab = userMsgObjPair => {
    setActiveChatTab(userMsgObjPair);
  }

  // closes an already present chat tab and in case of closing the active tab no tab becomes active
  const removeUserMessageObjPair = userMsgObjPair => {
    if(activeChatTab?.user.id === userMsgObjPair.user.id) { setActiveChatTab(null) }
    setUserMessageObjPairs(userMessageObjPairs.filter(pair => pair.user.id !== userMsgObjPair.user.id));
  }




  return (
    <ListWrapper>
      <UserChat
          isOpen={showChat}
          activeTab={activeChatTab}
          allTabs={userMessageObjPairs}
          closeTab={removeUserMessageObjPair}
          openTab={openChatTab}
      />
      <ListInner>
        <Tab.Container defaultActiveKey={'global'}>
          <ColStyled>
            <RowStyled>
              <NavStyled>
                {thisUser && thisUser.userType !== 'GuestUser' ?
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
                              accept={() => acceptFriendRequest(req.fromId)}
                              decline={() => declineFriendRequest(req.fromId)}
                          />
                      )}
                    </ColumnWrapper>
                    <ColumnWrapper>
                      {friends.filter(friend => {
                        if(!friendSearch) { return true; }
                        const regex = new RegExp(friendSearch, 'i');
                        return !!friend.username.match(regex);
                      }).map((friend, index) =>
                          <div key={index} onContextMenu={e => displayMenu(e, friend, FRIEND_MENU_ID)}>
                            <UserItem status={friend.status} username={friend.username}/>
                          </div>
                      )}
                      <Portal>
                        {/*
                      we need to leverage a portal here to ensure correct positioning of the
                      context menu inside the 'relative' positioned pane element
                      */}
                        <Menu id={FRIEND_MENU_ID} theme={theme.dark}>
                          <Item onClick={e => triggerChatWithUser(e.props.user)}>📨 send message</Item>
                          <Item onClick={e => removeFriend(e.props.user.id)}>❌ remove from friends</Item>
                        </Menu>
                      </Portal>
                    </ColumnWrapper>
                  </PaneContentWrapper>
                </PaneStyled>
                <PaneStyled eventKey={'global'}>
                  <PaneContentWrapper>
                    <SearchBarContainer>
                      <IconicInput
                          type={'text'}
                          placeholder={'search online users...'}
                          onChange={e => setGlobalSearch(e.target.value)}
                          defaultIcon={'search'}
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
                          <div key={index} onContextMenu={e => displayMenu(e, globalUser, USER_MENU_ID)}>
                            <UserItem status={globalUser.status} username={globalUser.username}/>
                          </div>
                      )}
                      <Portal>
                        {/*
                      we need to leverage a portal here to ensure correct positioning of the
                      context menu inside the 'relative' positioned pane element
                      */}
                        <Menu id={USER_MENU_ID} theme={theme.dark}>
                          <Item onClick={e => sendFriendRequest(e.props.user.id)}>🕊️ send friend request</Item>
                        </Menu>
                      </Portal>
                    </ColumnWrapper>
                  </PaneContentWrapper>
                </PaneStyled>
                <MessageButton glow={showChat} onClick={() => setShowChat(!showChat)}>
                  <i className={'material-icons'}>{showChat ? 'drafts' : 'mail'}</i>
                </MessageButton>
              </TabContentStyled>
            </RowStyled>
          </ColStyled>
        </Tab.Container>
      </ListInner>
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
 
  
  &:hover {
    background: rgba(195, 195, 195, 0.6);
  }

  & > div.status-box {
    height: 100%;
    width: 10%;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.status === 'ONLINE' ? '#048e11' : '#bf0101'};
    pointer-events: none;
  }
  
  & > div.username-box {
    height: 100%;
    width: 75%;
    font-family: 'Saira', sans-serif;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    pointer-events: none;
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
  --glowTL: -2px -2px 5px rgba(221, 221, 221, 0.3);
  --glowTR: 2px -2px 5px rgba(221, 221, 221, 0.3);
  --glowBL: -2px 2px 5px rgba(221, 221, 221, 0.3);
  --glowBR: 2px 2px 5px rgba(221, 221, 221, 0.3);
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
  text-shadow: ${props => props?.glow && 'var(--glowTL), var(--glowTR), var(--glowBL), var(--glowBR)'};
`;

const TabContentStyled = styled(Tab.Content)`
  position: relative;
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

const ListInner = styled.div`
  height: 100%;
  width: 100%;
  display: block;
  overflow: hidden;

  border: 1px solid #dddddd;
  border-radius: 5px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
`;

const ListWrapper = styled.div`
  grid-column: 2;
  grid-row: 2;

  position: relative;
  aspect-ratio: 2/3;
  height: 90%;
  align-self: center;
  justify-self: end;
  margin-right: 5%;
  display: block;
  z-index: 38;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

