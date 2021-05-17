import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { BackgroundContainerLogin} from "../../helpers/layout";
import {Background} from "../../views/design/background/Background";
import {UserType} from "../shared/models/UserType";
import {IconicInput, GlowButton} from "../../views/design/ElegantAssets";

const Title = styled.div`
  font-size: 20vmin;
  color: #dddddd;
  font-family: 'Satisfy', cursive;
  display: flex;
  flex-direction: column;
`;

const TitleSaliSpan = styled.span`
  font-weight: 600;
  font-size: 0.8em;
  padding-right: 10%;
  color: #dddddd;
`

const TitleStubliSpan = styled.span`
  font-weight: 700;
  font-size: 1.2em;
  padding-left: 10%;
  transform: translateY(-25%);
  text-shadow: -0.08em 0.08em 0.01em #494949;
`




const TitleBox = styled.div`
  grid-column: 1 / span 3;
  grid-row: 1;  
  align-self: end;
  justify-self: center;
`;


const RegisterBox = styled.div`
  grid-column: 1;
  grid-row: 2 ;
  align-self: end;
  padding-bottom: 35%;
  display: flex;
  justify-content: center;
`;

const UserLoginBox = styled.div`
  grid-column: 2;
  grid-row: 2;
  align-self: end;
  padding-bottom: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const GuestBox = styled.div`
  grid-column: 3;
  grid-row: 2 ;
  align-self: end;
  padding-bottom: 35%;
  display: flex;
  justify-content: center;
`;

const LoginWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10vh;
  grid-template-rows: 2fr 1fr;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Login extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null
    };
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
    this.guestLogin = this.guestLogin.bind(this);

    this.onLogin = this.onLogin.bind(this);
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.post('/login', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));

      sessionStorage.setItem('user', JSON.stringify(user));

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/menu`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }
  /**
   * redirect to the registration page
   */
  register() {
    try {
      this.props.history.push(`/register`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }


  async guestLogin() {
    try {
        const requestBody = JSON.stringify({
          userType: UserType.GUEST
      });
      const response = await api.post('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/menu`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }



  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }


  onLogin = event => {
    if(event.code === 'Enter' || event.code === 'NumpadEnter') {
      console.log('Enter key pressed')
      if(this.state.username && this.state.password) {
        event.preventDefault();
        this.login();
      }
    }
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen. 
   */
  componentDidMount() {
    document.addEventListener('keydown', this.onLogin);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onLogin);
  }

  render() {
    return (
        <Background>
          <BackgroundContainerLogin>
            <LoginWrapper>
              <TitleBox>
                <Title>
                  <TitleSaliSpan>Sali <span style={{fontWeight: 100, fontSize: '0.6em'}}>im</span></TitleSaliSpan>
                  <TitleStubliSpan>Stübli</TitleStubliSpan>
                </Title>
              </TitleBox>
              <RegisterBox>
                <GlowButton onClick={() => this.register()}>register</GlowButton>
              </RegisterBox>
              <UserLoginBox>
                <IconicInput
                    type={'text'}
                    placeholder={'username...'}
                    onChange={e => this.handleInputChange('username', e.target.value)}
                    defaultIcon={'person_outline'}
                    highlightIcon={'person'}
                    defaultIconColor={'rgba(221, 221, 221, 0.5)'}
                    highlightIconColor={'rgba(221, 221, 221, 0.9)'}
                />
                <IconicInput
                    type={'password'}
                    placeholder={'password...'}
                    onChange={e => this.handleInputChange('password', e.target.value)}
                    defaultIcon={'lock_outlined'}
                    highlightIcon={'lock'}
                    defaultIconColor={'rgba(221, 221, 221, 0.5)'}
                    highlightIconColor={'rgba(221, 221, 221, 0.9)'}
                />
                <GlowButton
                    style={{marginTop: '1rem'}}
                    disabled={!this.state.username || !this.state.password}
                    onClick={() => {
                      this.login();
                    }}
                >
                  login
                </GlowButton>
              </UserLoginBox>
              <GuestBox>
                <GlowButton onClick={() => this.guestLogin()}>guest entry</GlowButton>
              </GuestBox>
            </LoginWrapper>
          </BackgroundContainerLogin>
        </Background>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
