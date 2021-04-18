import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { BackgroundContainerLogin} from "../../helpers/layout";

const Title = styled.div`
  font-size: 8em;
  vertical-align: top;
  color: goldenrod;
  flex-direction: row;
  font-family: Bungee Inline;
  justify-content: center;
  text-align: center;
`;

const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.6);
  color: black;
  vertical-align: top;
  display: flex;
  flex-direction: row;
  justify-content: center;
    padding: 6px;
  font-weight: 700;
  font-size: 15px;
  width: 100%;
  height: ${props => props.height || null};
  border-radius: 5px;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const TitleBox = styled.div`
  grid-column: 1 / 4;
  grid-row: 1 ;  
  align-self: center;
`;


const RegisterBox = styled.div`
  grid-column: 1;
  grid-row: 2 ; 
  align-self: center; 
`;

const UserLoginBox = styled.div`
  grid-column: 2;
  grid-row: 2 ;
`;

const GuestBox = styled.div`
  grid-column: 3;
  grid-row: 2 ; 
  align-self: center;
`;

const LoginWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 100px;
  grid-auto-rows: minmax(100px, auto)
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
      username: null,
      password: null
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
        password: this.state.password
      });
      const response = await api.post('/login', requestBody);

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
        <LoginWrapper>
          <TitleBox>
            <Title>Sali im Stübli</Title>
          </TitleBox>
          <RegisterBox>
            <Label>Register as a new User</Label>
             <Button
                  width="50%"
                  onClick={() => {
                  this.register();
                }}
             >
              Register
             </Button>
          </RegisterBox>
          <UserLoginBox>
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
              required="true"
              type="password"
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
            />
            <Button
              disabled={!this.state.username || !this.state.password}
              width="50%"
              onClick={() => {
                this.login();
              }}
            >
              Login
            </Button>
          </UserLoginBox>
          <GuestBox>
            <Label>Enter as a Guest</Label>
            <Button
                width="50%"
                onClick={() => {
                this.defaultRegister();
              }}
           >
             Enter
            </Button>
          </GuestBox>
        </LoginWrapper>
      </BackgroundContainerLogin>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
