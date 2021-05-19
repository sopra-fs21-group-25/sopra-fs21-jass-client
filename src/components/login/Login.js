import React from 'react';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { BackgroundContainerLogin} from "../../helpers/layout";
import {Background} from "../../views/design/background/Background";
import {UserType} from "../shared/models/UserType";
import {IconicInput, GlowButton} from "../../views/design/ElegantAssets";
import { GoogleLogin } from 'react-google-login';

import './css/login.css';


class Login extends React.Component {
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
      sessionStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', user.token);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/menu`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }

  async loginGoogleUser(user_obj) {
    try {
      const requestBody = JSON.stringify({
        username: user_obj.profileObj.email,
        password: user_obj.profileObj.googleId
      });

      const response = await api.post('/login', requestBody);
      const user = new User(response.data);

      localStorage.setItem('token', user.token);
      localStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log(user)
      console.log('USER EXIST.')

      this.props.history.push(`/menu`);
    } catch (error) {
      // google user doesn't exist in db, regestring user
      try {
        const requestBody = JSON.stringify({
          username: user_obj.profileObj.email,
          password: user_obj.profileObj.googleId,
          userType: UserType.REGISTERED
        });

        const response = await api.post('/users', requestBody);
        if (response.status === 201) {
            const user = new User(response.data);

            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('user', JSON.stringify(user));
            console.log(user)
            console.log('CREATING NEW USER.')

            this.props.history.push(`/menu`);

        } else if (response.status === 409) {
            alert(response.data.text)
        }
      } catch (register_error) {
        alert(`Something went wrong during the login: \n${handleError(register_error)}`);
      }
    }
  }

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
  onSuccessGoogleLogin = (response) => {
    this.loginGoogleUser(response);
  }

  onFailGoogleLogin = (response) => {
    console.log(response);
  }

  render() {
    return (
        <Background>
          <BackgroundContainerLogin>
            <div className="login_wrapper">
              <div className="title_box">
                <div className="title">
                  <span className="title_sali_span">Sali <span style={{fontWeight: 100, fontSize: '0.6em'}}>im</span></span>
                  <span className="title_stubli_span">Stübli</span>
                </div>
              </div>
              <div className="register_box">
                <GlowButton onClick={() => this.register()}>register</GlowButton>
              </div>
              <div className="user_login_box">
                <GoogleLogin
                  clientId="402418913140-hvte8ko0kqv7l4e2m3fs6ml2e7b98up1.apps.googleusercontent.com"
                  buttonText="Login with Google"
                  onSuccess={this.onSuccessGoogleLogin}
                  onFailure={this.onFailGoogleLogin}
                  cookiePolicy={'single_host_origin'}
                  style={{marginBottom: '1rem'}}
                />
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
              </div>
              <div className="guest_box">
                <GlowButton onClick={() => this.guestLogin()}>guest entry</GlowButton>
              </div>
            </div>
          </BackgroundContainerLogin>
        </Background>
    );
  }
}

export default withRouter(Login);
