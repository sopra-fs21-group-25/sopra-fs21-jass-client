import React from 'react';
import styled from 'styled-components';
import { UserType } from '../shared/models/UserType';
import {BackgroundContainer, LargeButtonContainer} from "../../helpers/layout";
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import {withRouter} from 'react-router-dom';



const FriendsContainer = styled('div')({
  float: 'right',
  marginRight: '5%',
  padding: '5%',
  paddingTop: '0'
});

const CreationButtonContainer = styled('div')({
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
      friends: null,
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
      <BackgroundContainer>

        <CreationButtonContainer>
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
        </CreationButtonContainer>

      </BackgroundContainer>
    );
  }
}

export default withRouter(Menu);


