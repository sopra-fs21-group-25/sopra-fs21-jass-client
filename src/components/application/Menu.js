import React from 'react';
import styled from 'styled-components';
import { UserType } from '../shared/models/UserType';
import {BackgroundContainer, BackgroundContainerNoImage, LargeButtonContainer} from "../../helpers/layout";
import {Background} from "../../views/design/background/Background";
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import FriendList from "../../components/application/FriendList"
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import './css/menu.css';
import {InvitationInjector} from "./assets/InvitationInjector";

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: '2%',
  width: props => props.width || '100%',
  height: props => props.height || '100%',
  borderTop: props => props.borderTop || null,
  borderBottom: props => props.borderBottom || null
});

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(154, 152, 153, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.8);
  color: black;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const FriendsContainer = styled('div')({
  float: 'right',
  marginRight: '5%',
  padding: '5%',
  paddingTop: '0'
});

const GametableButtonContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '1%',
  maxHeight: '200px',
  width: '30%',
  minWidth: '240px'
});


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.stompClient = props.stompClient;
    this.state = {
      user: null,
      users: []
    };
  }


  async logout() {
    /** uncomment the following, when the backend is set up accordingly **/
    /*try {
      // request a user status update of myself ONLINE -> OFFLINE
      const myToken = localStorage.removeItem('token');
      const requestBody = JSON.stringify(myToken);
      const response = await api.put('/logout', requestBody);

      // add http.status handlers below...


      // remove token from localStorage and push login page
      localStorage.removeItem('token');
      this.props.history.push('login');

    } catch (error) {
      alert(`Something went wrong while trying to logout:\n${handleError(error)}`);
    }*/
  }

  async componentDidMount() {
    this.setState({user: JSON.parse(sessionStorage.getItem('user'))}, async function () {
      const response = await api.get('/availableusers/' + this.state.user.id);
      this.setState({
        users: response.data
      }, console.log(this.state));
    });
  }

  filterMainSearch() {
    var input = document.getElementById("mainSearch");
    var filter = input.value.toUpperCase();
    var div = document.getElementsByClassName("list-container")[0];
    var a = div.getElementsByTagName("li");
    for (var i = 0; i < a.length; i++) {
      var txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  async sendFriendRequest(request_to) {
    const response = await api.post('/friend_requests/' + this.state.user.id, {"id": request_to});
  }

  render() {
    return (
        <Background>
          <BackgroundContainerNoImage style={{flexDirection: 'row'}}>
            <InvitationInjector userId={this.state.user?.id}/>
            <Container width={'35%'}>
              <GametableButtonContainer>
                <LargeButtonContainer>
                  <Button onClick={() => this.props.history.push('/create')}>
                    Create Game Table
                  </Button>
                </LargeButtonContainer>
                <LargeButtonContainer>
                  <Button
                      onClick={() =>
                          this.props.history.push({
                                pathname: '/join',
                                state: {user: this.state.user}
                              }
                          )}
                  >
                    Join Game Table
                  </Button>
                </LargeButtonContainer>
              </GametableButtonContainer>
            </Container>
            <Container width={'25%'}>
              <Form>
                <InputField
                    placeholder={'Search users...'}
                    id="mainSearch"
                    onKeyUp={this.filterMainSearch}
                />
                <div className="list-container">
                  <h2 style={{borderBottom: "1px solid black"}}>All users</h2>
                  <ul>
                    {this.state.users.map((user, index) => {
                      return  <li key={index}>
                        <ContextMenuTrigger id={index.toString()}>
                          <a title="user">
                            {user.status == 'ONLINE' && <div className='circle-green float-child-1'></div>}
                            {user.status == 'OFFLINE' && <div className='circle-red float-child-1'></div>}
                            <div>{user.username}</div>
                          </a>
                        </ContextMenuTrigger>
                        <ContextMenu id={index.toString()}>
                          <MenuItem onClick={()=>this.sendFriendRequest(user.id)}>
                            <span>Send friend request</span>
                          </MenuItem>
                          <MenuItem>
                            <span>Invite to the game</span>
                          </MenuItem>
                        </ContextMenu>
                      </li>
                    })}
                  </ul>
                </div>
              </Form>
            </Container>
            <Container width={'40%'}>
              <FriendList></FriendList>
            </Container>
          </BackgroundContainerNoImage>
        </Background>
    );
  }
}

export default withRouter(Menu);