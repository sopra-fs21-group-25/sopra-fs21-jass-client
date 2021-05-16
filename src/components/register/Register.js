import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import {UserType} from '../shared/models/UserType';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { BackgroundContainerRegister} from "../../helpers/layout";

const Title = styled.div`
  font-size: 7em;
  vertical-align: top;
  color: Silver;
  flex-direction: row;
  font-family: Bungee Inline;
  justify-content: center;
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
  grid-column: 1 / 5;
  grid-row: 1 ;  
  align-self: center;
`;


const RegisterBox = styled.div`
  grid-column: 2/4;
  grid-row: 2 ; 
  align-self: center; 
`;
const ButtonWrapper = styled.div`
  grid-column: 2;
  grid-row: 2 ; 
  align-self: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(50px, auto) 
`;

const RegisterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 80px;
  grid-auto-rows: minmax(100px, auto)
`;

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            userType: UserType.REGISTERED
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    async registerUser() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                userType: this.state.userType
            });
            const response = await api.post('/users', requestBody);
            if (response.status === 201) {
                // Get the returned user and update a new object.
                const user = new User(response.data);

                // Store the token into the local storage.
                localStorage.setItem('token', user.token);
                localStorage.setItem('user', JSON.stringify(user));

                sessionStorage.setItem('user', JSON.stringify(user));

                // Login successfully worked --> navigate to the route /game in the UsersOverviewRouter
                this.props.history.push(`/menu`);
            } else if (response.status === 409) {
                alert(response.data.text)
            }
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
            <BackgroundContainerRegister>
                <RegisterWrapper>
                <TitleBox>
                    <Title>Create an Account</Title>
                </TitleBox>
                 <RegisterBox>
                        <Label>Create Username</Label>
                        <InputField
                            required
                            placeholder="Enter your username.."
                            onChange={e => {
                                this.handleInputChange('username', e.target.value);
                            }}
                        />
                        <Label>Create Password</Label>
                        <InputField
                            required
                            type="password"
                            placeholder="Enter a secure password"
                            onChange={e => {
                                this.handleInputChange('password', e.target.value);
                            }}
                        />
                        <ButtonWrapper>
                            <Button
                                width="50%"f
                                onClick={() => {
                                    this.props.history.push(`/login`);
                            }}>
                            Back
                            </Button>
                            <Button
                                disabled={!this.state.username || !this.state.password}
                                width="50%"
                                onClick={() => {
                                    this.registerUser();
                                }}>
                                Register
                            </Button>

                        </ButtonWrapper>
                    </RegisterBox>
                </RegisterWrapper>
            </BackgroundContainerRegister>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Register);
