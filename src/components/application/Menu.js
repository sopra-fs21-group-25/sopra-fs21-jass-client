import React from 'react';
import styled from 'styled-components';
import { UserType } from '../shared/models/UserType';
import {BackgroundContainer, LargeButtonContainer} from "../../helpers/layout";
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import {Friend} from "../shared/models/Friend";

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
    this.state = {
      users: null,
      userId: null,
      userType: null,
      friends: [],
      friendRequests: null,
      gameInvitations: null
    }
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
    try {
      const response = await api.get(JSON.stringify('/users'));

      for(let user of response.data) {
        if(user.token == localStorage.getItem('token')) {
          this.setState({
            users: response.data,
            userId: user.id,
            // userType ????
            friends: user.friends,
            friendRequests: user.friendRequests,
            gameInvitations: user.gameInvitations
          })
        }
      }
    } catch (error) {
      //alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <BackgroundContainer style={{flexDirection: 'row'}}>
        <Container width={'35%'}>
          <GametableButtonContainer>
            <LargeButtonContainer>
              <Button onClick={() => this.props.history.push('/create')}>
                Create Game Table
              </Button>
            </LargeButtonContainer>
            <LargeButtonContainer>
              <Button>
                Join Game Table
              </Button>
            </LargeButtonContainer>
          </GametableButtonContainer>
        </Container>
        <Container width={'25%'}>
          <Form>
            <InputField
              placeholder={'Search users...'}
            />
          </Form>
        </Container>
        <Container width={'40%'}>
          <FriendsContainer>
            {this.state.friends?.map(friend =>
              <Friend
                key={friend.username}
                user={friend}
              />
            )}
          </FriendsContainer>
        </Container>


      </BackgroundContainer>
    );
  }
}

export default withRouter(Menu);


