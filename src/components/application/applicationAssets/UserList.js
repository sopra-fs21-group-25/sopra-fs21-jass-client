import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Col, Nav, Row, Tab} from "react-bootstrap";
import {GlowButton, IconicInput} from "../../../views/design/ElegantAssets";
import {api} from "../../../helpers/api";
import {useHistory} from "react-router-dom";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {Item, Menu, theme, useContextMenu} from 'react-contexify';
import {UserChat} from './UserChat';
import 'react-contexify/dist/ReactContexify.css';
import * as ReactDOM from "react-dom";
import {UserType} from "../../shared/models/UserType";
import {convertBase64DataToImageUrl} from "../../../helpers/convertBase64DataToImage";
import guestIcon from '../../../views/images/icons/guest-icon.svg';

const FRIEND_MENU_ID = 'friend_menu_id';
const USER_MENU_ID = 'user_menu_id';
const appRoot = document.getElementById('root');


export const UserList = () => {
  const [thisUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const profilePictureCollection = useRef({});

  const [showChat, setShowChat] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState(null);
  const [chatData = [{
    chatPartnerId: String,
    chatPartnerUsername: String,
    messageData: [{
      senderId: String,
      senderUsername: String,
      timestamp: Date,
      text: String
    }]
  }], setChatData] = useState([]);


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
      const fetchedFriends = (await api.get(`/friends/${thisUser.id}`)).data;
      for(let f of fetchedFriends) {
        if(!profilePictureCollection.current[f.id]) {
          profilePictureCollection.current[f.id] =
              f.userType === UserType.GUEST ?
                  guestIcon :
                  convertBase64DataToImageUrl((await api.get(`/files/${f.id}`)).data);
        }
      }
      setFriends(fetchedFriends);
      return fetchedFriends;
    };
    fetchAndSetFriends().then(fetchedFriends => console.log('Fetched and set friends: ', {fetchedFriends}));
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
      const fetchedUsers = (await api.get(`/users/not_friends/${thisUser.id}`)).data;
      for(let u of fetchedUsers) {
        if(!profilePictureCollection[u.id]) {
          profilePictureCollection.current[u.id] =
              u.userType === UserType.GUEST ?
                  guestIcon :
                  convertBase64DataToImageUrl((await api.get(`/files/${u.id}`)).data);
        }
      }
      setRemainingUsers(fetchedUsers);
      return fetchedUsers;
    };
    fetchAndSetRemainingUsers().then(fetchedUsers => console.log('Fetched and set remaining users: ', {fetchedUsers}));
  }, [fetchUsersSwitch]);

  // use the following useEffect to re-fetch friends and users every 10 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setFetchUsersSwitch(prev => !prev);
    }, 10000);

    // cleanup
    return () => clearInterval(interval);
  }, [])


  useSubscription(`/friend_requests/notify/${thisUser.id}`, msg => {
    if(msg.body === 'new-request') {
      setFetchRequestsSwitch(!fetchRequestsSwitch);
    }
    if(msg.body === 'accept-request') {
      setFetchFriendsSwitch(!fetchFriendsSwitch);
      setFetchUsersSwitch(!fetchUsersSwitch);
      setFetchRequestsSwitch(!fetchRequestsSwitch);
    }
  });

  useSubscription(`/friends/notify_remove/${thisUser.id}`, msg => {
    const updatedFriends = friends.filter(f => f.id !== msg.body);
    setFriends(updatedFriends);
    setFetchUsersSwitch(!fetchUsersSwitch);
  });

  useSubscription(`/messages/outgoing/${thisUser.id}`, async msg => {
    const dto = JSON.parse(msg.body);
    const messageDataObj = convertChatMessageDTOtoMessageDataObj(dto);
    const chatPartnerId = getChatPartnerIdFromChatMessageDTO(dto);

    const chatDataObjIndex = chatData.findIndex(data => data.chatPartnerId === chatPartnerId);
    let chatDataObj = chatDataObjIndex !== -1 ? chatData[chatDataObjIndex] : undefined;

    if(chatDataObj) {
      const newChatData = [...chatData];
      newChatData.splice(
          chatDataObjIndex,
          1,
          {...chatDataObj, messageData: [...chatDataObj.messageData, messageDataObj]}
      );
      setChatData(newChatData);
    } else {
      chatDataObj = await fetchChatDataObjByChatPartnerId(chatPartnerId);
      setChatData([...chatData, chatDataObj]);
    }
  });



  const acceptFriendRequest = async fromId => {
    await api.post(`/friend_requests/accept/${fromId}/${thisUser.id}`);
    setFetchFriendsSwitch(!fetchFriendsSwitch);
    setFetchRequestsSwitch(!fetchRequestsSwitch);
    setFetchUsersSwitch(!fetchUsersSwitch);

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
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    setFetchUsersSwitch(!fetchUsersSwitch);

    stompClient.publish({
      destination: `/app/friends/notify_remove/${friendId}`,
      body: thisUser.id
    })
  }



  // triggers chat with a friend when via contextmenu 'send message' is clicked
  const triggerChatWithUser = async chatPartner => {
    let activeTab = chatData.find(data => data.chatPartnerId === chatPartner.id);
    if(!activeTab) {
      const chatDataObj = await fetchChatDataObjByChatPartnerId(chatPartner.id);
      setChatData([...chatData, chatDataObj]);
      activeTab = chatDataObj;
    }
    openChatTab(activeTab);
    setShowChat(true);
  }

  const fetchChatDataObjByChatPartnerId = async chatPartnerId => {
    try {
      const data = (await api.get(`/messages/bidirectional/${thisUser.id}/${chatPartnerId}`)).data;
      const chatPartnerUsername = (await api.get(`/users/${chatPartnerId}`)).data.username;
      return {
        chatPartnerId: chatPartnerId,
        chatPartnerUsername: chatPartnerUsername,
        messageData: data.length ? data.map(d => convertChatMessageDTOtoMessageDataObj(d)) : []
      };
    } catch(error) {
      alert(`Something went wrong on the server side: ${error}`);
    }
  }

  // opens an already present but currently not active chat tab with a friend
  const openChatTab = chatDataObj => {
    setActiveChatTab(chatDataObj);
  }

  // closes an already present chat tab and in case of closing the active tab no tab becomes active
  const removeChatDataObj = chatDataObj => {
    const activeIndex = chatData.findIndex(data => data.chatPartnerId === chatDataObj.chatPartnerId);
    if(activeChatTab.chatPartnerId === chatDataObj.chatPartnerId) {
      if(chatData.length > 1) {
        setActiveChatTab(activeIndex === 0 ? chatData[1] : chatData[activeIndex - 1]);
      } else {
        setActiveChatTab(null);
      }
    }
    const newChatData = [...chatData];
    newChatData.splice(activeIndex, 1);
    setChatData(newChatData);
  }



  const convertChatMessageDTOtoMessageDataObj = dto => {
    return {
      senderId: dto.senderId,
      senderUsername: dto.senderUsername,
      timestamp: new Date(dto.timestamp),
      text: dto.text
    };
  }
  const getChatPartnerIdFromChatMessageDTO = dto => {
    return dto?.senderId === thisUser.id ? dto?.environmentId : dto?.senderId;
  }
  const appendMessageToActiveChat = messageDataObj => {
    const chatDataObjIndex = chatData.findIndex(data => data.chatPartnerId === activeChatTab.chatPartnerId);
    const chatDataObj = chatData[chatDataObjIndex];
    const newChatData = [...chatData];
    newChatData.splice(
        chatDataObjIndex,
        1,
        {...chatDataObj, messageData: [...chatDataObj.messageData, messageDataObj]}
    );
    setChatData(newChatData);
  };

  return (
    <ListWrapper>
      <UserChat
          isOpen={showChat}
          activeTab={activeChatTab}
          allTabs={chatData}
          closeTab={removeChatDataObj}
          openTab={openChatTab}
          appendMessage={appendMessageToActiveChat}
          stompClient={stompClient}
          user={thisUser}
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
                            <UserItem
                              userId={friend.id}
                              status={friend.status}
                              username={friend.username}
                              profilePicture={profilePictureCollection.current[friend.id]}
                            />
                          </div>
                      )}
                      <Portal>
                        {/*
                      we need to leverage a portal here to ensure correct positioning of the
                      context menu inside the 'relative' positioned pane element
                      */}
                        <Menu id={FRIEND_MENU_ID} theme={theme.dark}>
                          <Item onClick={e => triggerChatWithUser(e.props.user)}>💬 open chat</Item>
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
                            <UserItem
                              userId={globalUser.id}
                              status={globalUser.status}
                              username={globalUser.username}
                              profilePicture={profilePictureCollection.current[globalUser.id]}/>
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
    <UserItemWrapper status={props.status} style={{padding: "2%"}}>
      <div className={'material-icons status-box'}>
        circle
      </div>
      <div style={{width: "3.5rem", height: "3.5rem", marginRight: "5%"}}>
        <img alt={guestIcon}
             style={{borderRadius: "50%", maxWidth: "100%", maxHeight: "100%", width: "100%", height: "auto"}}
             src={props.profilePicture}
        />
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
  z-index: 40;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
`;

