import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { RainbowButtonutton } from '../../views/design/Button';
import {BackgroundContainer, BackgroundContainerLogin, LargeButtonContainer} from "../../helpers/layout";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

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

const Title = styled.div`
  font-size: 10em;
  vertical-align: top;
  color: goldenrod;
  flex-direction: row;
  font-family: Bungee Inline;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  vertical-align: top;
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  vertical-align: top;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;


const LoginButtonContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  margin: '1%',
  maxHeight: '100px',
  width: '30%',
  minWidth: '240px',
  alignItems: 'center'
});



const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-direction: column;
  height: 700px;
  
`;

const ButtonsBox = styled.div`
  display: flex;
  justify-content: bottom;
  margin-top: 100px;
  flex-direction: column;
  height: 300px;
  width: 29em;

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
  constructor() {
    super();
    this.state = {
      name: null,
      username: null
    };
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
        name: this.state.name
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
   * redirect to the registration page
   */
  register() {
    try {
      this.props.history.push(`/register`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  }


  defaultRegister() {
    try {
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

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <BackgroundContainerLogin>
        <TitleBox>
        <Title>Sali im Stübli</Title>
          <ButtonsBox>
            <Label>Username</Label>
            <InputField
              placeholder="Enter here.."
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>Password</Label>
            <InputField
              placeholder="Enter here.."
              onChange={e => {
                this.handleInputChange('name', e.target.value);
              }}
            />
              <Button
                disabled={!this.state.username || !this.state.name}
                width="50%"
                onClick={() => {
                  this.login();
                }}
              >
                Login
              </Button>

          <Label>Register as a new User</Label>
          <Button
              width="50%"
              onClick={() => {
                this.register();
              }}
          >
            Register
          </Button>

          <Label>Enter as a Guest</Label>
          <Button
              width="50%"
              onClick={() => {
                this.defaultRegister();
              }}
          >
            Enter
          </Button>
          </ButtonsBox>


  </TitleBox>
      </BackgroundContainerLogin>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
