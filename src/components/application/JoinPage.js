import styled from "styled-components";
import React, {useState, useEffect} from "react";
import {BackgroundContainer} from "../../helpers/layout";
import {api} from "../../helpers/api";
import {Col, Nav, Tab} from "react-bootstrap";
import LobbyList from "./assets/LobbyList";
import LobbyListItem from "./assets/LobbyListItem";
import './css/joinPage.css';
import {Spinner} from "../../views/design/Spinner";

const OuterWrapper = styled('div')({
  display: 'block',
  width: '80%',
  height: '96%',
});

const InnerWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
});

const listBoxStyle = {
  borderLeft: '1px solid black',
  borderRight: '1px solid black',
  borderBottom: '1px solid black',
  borderTop: '5px solid black',
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  background: 'linear-gradient(0deg, rgba(46,46,46,1) 0%, rgba(0,83,16,1) 27%, rgba(192,201,194,1) 100%)',
  overflowX: 'hidden',
  overflowY: 'auto'
}


const JoinPage = () => {
  const [user, setUser] = useState({userType: 'GuestUser'});
  const [lobbies, setLobbies] = useState([]);

  const myId = JSON.parse(sessionStorage.getItem('user')).id;

  useEffect(() => {
    fetchUser().then(value => console.log(value));  // use .then() for callback logging

    fetchLobbies().then(lobbies => setLobbies(lobbies)); // set initially fetched lobbies

    const interval = setInterval(() => {
      fetchLobbies().then(fetchedLobbies => {
        if(lobbies != fetchedLobbies) {
          setLobbies(fetchedLobbies);   // only refresh lobby-list if the has been changes
        }
      });
    }, 10000); // refresh lobbies every 10 seconds

    return () => clearInterval(interval); // clear interval on unmount

  }, [])  // empty dependencies indicate to fetch only once on component mount
  const fetchUser = async () => {
    try {
      const response = await api.get(`users/${myId}`);

      setUser(response.data);
      return response.data;   // only for callback reasons, e.g. console logging

    } catch(error) {
      alert("Could not fetch current user");
    }
  }
  const fetchLobbies = async () => {
    try {
      const response = await api.get(`/lobbies/accessible/${myId}`);

      return response.data;

    } catch (error) {
      alert("No lobbies to fetch");
    }
  }





  return (
      <BackgroundContainer>
        <OuterWrapper>
          <Tab.Container id={'lobbyTypeTabs'} defaultActiveKey={'public'} style={{height: '100%'}}>
            <Col style={{height: 'inherit', padding: 0}}>
              <Nav justify={true} variant={'tabs'}>
                {user.userType !== 'GuestUser' &&
                  <Nav.Item>
                    <Nav.Link eventKey={'friends'}>Friends' Tables</Nav.Link>
                  </Nav.Item>
                }
                <Nav.Item>
                  <Nav.Link eventKey={'public'}>Public Tables</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content style={{height: 'inherit'}}>
                  <Tab.Pane transition={false} eventKey={'friends'} style={{height: 'inherit'}}>
                    <InnerWrapper>
                      <Tab.Container id={'modeTabsFriendsTab'} defaultActiveKey={'schieber'} style={{height: '100%', padding: 0}}>
                        <Col style={{height: 'inherit', padding: 0}}>
                          <Nav justify={true} variant={'tabs'}>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'schieber'}>Schieber</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'coiffeur'} disabled>Coiffeur</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'bieter'} disabled>Bieter</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'sidi'} disabled>2er Sidi</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content style={{height: 'inherit'}}>
                            <Tab.Pane eventKey={'schieber'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                <LobbyList id={'friendsSchieberList'}>
                                  {!lobbies ? <Spinner/> :
                                    lobbies.filter(lobby => lobby.lobbyType === 'friends').map(lobby => {
                                      console.log({lobby});
                                      return <LobbyListItem key={lobby.id} lobby={lobby}/>;
                                    })
                                  }
                                </LobbyList>
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'coiffeur'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up Coiffeur availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'bieter'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up Bieter availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'sidi'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up 2er Sidi availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Tab.Container>
                    </InnerWrapper>
                  </Tab.Pane>
                  <Tab.Pane transition={false} eventKey={'public'} style={{height: 'inherit'}}>
                    <InnerWrapper>
                      <Tab.Container id={'modeTabsPublicTab'} defaultActiveKey={'schieber'} style={{height: '100%', padding: 0}}>
                        <Col style={{height: 'inherit', padding: 0}}>
                          <Nav justify={true} variant={'tabs'}>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'schieber'}>Schieber</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'coiffeur'} disabled>Coiffeur</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'bieter'} disabled>Bieter</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link style={{borderRadius: 0}} eventKey={'sidi'} disabled>2er Sidi</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content style={{height: 'inherit'}}>
                            <Tab.Pane eventKey={'schieber'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                <LobbyList id={'publicSchieberList'}>
                                  {!lobbies ? <Spinner/> :
                                      lobbies.map(lobby => {
                                        console.log({lobby});
                                        return <LobbyListItem key={lobby.id} lobby={lobby}/>;
                                      })
                                  }
                                </LobbyList>
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'coiffeur'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up Coiffeur availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'bieter'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up Bieter availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                            <Tab.Pane eventKey={'sidi'} style={{height: 'inherit'}}>
                              <InnerWrapper style={listBoxStyle}>
                                {/* set up 2er Sidi availability before implementing */}
                              </InnerWrapper>
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Tab.Container>
                    </InnerWrapper>
                  </Tab.Pane>
              </Tab.Content>
            </Col>
          </Tab.Container>
        </OuterWrapper>
      </BackgroundContainer>
  );
}

export default JoinPage;




