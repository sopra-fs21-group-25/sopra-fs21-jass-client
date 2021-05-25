import React from 'react';
import styled from 'styled-components';
import { UserType } from '../shared/models/UserType';
import {BackgroundContainer, BackgroundContainerNoImage, LargeButtonContainer} from "../../helpers/layout";
import { api, handleError } from '../../helpers/api';
import { Button } from '../../views/design/Button';
import {withRouter} from 'react-router-dom';
import '../application/css/menu.css';
import {convertBase64DataToImageUrl} from "../../helpers/convertBase64DataToImage";
import {UserList} from "../application/applicationAssets/UserList";



const ProfileContainer =  styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    "empty-topLeft avatar empty-topRight"
    "empty-topLeft avatarButton empty-topRight"
    "empty-middleLeft namePassword empty-middleRight"
    "backButton editButton empty-bottomRight";
  grid-gap: 20px;
  width: 100%;
  height: 100%;
`;

const BackButtonWrapper = styled.div`
  grid-area: backButton;
  height: 25%;
  width: 100%;
  display: flex;
  align-self: flex-end;
  justify-content: flex-start;
`;

const EditPictureButtonWrapper = styled.div`
  grid-area: avatarButton;
  height: 25%;
  width: 50%;
  margin: auto;
`;

const EditUsernameButtonWrapper = styled.div`
  grid-area: editButton;
  height: 25%;
  width: 100%;
  margin: auto;
`;

const FormWrapper = styled.div`
  grid-area: namePassword;
  align-self: start;
  width: 50%;
  margin: auto;
`;

const AvatarWrapper = styled.div`
  grid-area: avatar;
  align-self: end;
  justify-content: center;
  align-content: center;
  height: 25%;
  width: 50%;
  margin: auto;
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

const DisplayField = styled.label`
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
  justify-content: start;
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




class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.stompClient = props.stompClient;
        this.state = {
            username: null,
            userType: UserType.REGISTERED,
            user: null,
            editMode: true,
            editPictureMode: true,
            selectedFile: undefined,
            currentFile: null,
        };
    }

    async componentDidMount() {
        this.setState({user: JSON.parse(sessionStorage.getItem('user'))}, async function () {
            const response = await api.get('/users/' + this.state.user.id);
            const responseImage = await api.get('/files/' + this.state.user.id);

            if (responseImage.status === 200) {
                this.setState({currentFile: convertBase64DataToImageUrl(responseImage.data)});
            }

            this.setState({
                username: response.data.username,
            });
        });
    }

    handleInputChange(key, value) {
        this.setState({ [key]: value });
    }

    async submit() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                password: this.state.password
            });

            const response = await api.put('/users/'+  this.state.user.id, requestBody);

            if (response.status === 200) {
                localStorage.setItem('username', response.data.username);
                sessionStorage.setItem('username', response.data.username);
            } else if (response.status === 409) {
                alert(response.data.text)
            }
        } catch (error) {
            alert(`Changing the info was unsuccessful: \n${handleError(error)}`);
        }

        this.setState({editMode: !this.state.editMode})
    }

    async upload(file) {
        let formData = new FormData();

        formData.append("file", file);

        const response = await api.post("/files/"+ this.state.user.id, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.status === 200) {
            this.setState({currentFile: convertBase64DataToImageUrl(response.data)});
        }
    }


    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        });
    }

    fileUploadHandler = () =>{
        let currentFile = this.state.selectedFile;

        this.setState({
            progress: 0,
            currentFile: currentFile,
        });

        this.upload(currentFile);
        this.setState({editPictureMode: true});
    }

render() {
        const {
            selectedFile
        } = this.state;

        return (
            <BackgroundContainer style={{flexDirection: 'row'}}>
                <ProfileContainer>
                    <AvatarWrapper>
                        <Label>Current Profile Picture</Label>
                        {this.state.editPictureMode ?
                            <div>
                                <img style={{width: 100, height: 100, display: "block", marginLeft: "auto", marginRight: "auto"}} src={this.state.currentFile} />
                            </div>
                            :
                            <div>
                                <input type ="file" onChange={this.fileSelectedHandler} />
                            </div>
                        }
                    </AvatarWrapper>
                    <EditPictureButtonWrapper>
                        {this.state.editPictureMode ?
                            <Button
                                onClick={() => this.setState({editPictureMode: !this.state.editPictureMode})}>
                                Edit
                            </Button>
                            :
                            <Button
                                disabled={!selectedFile }
                                onClick={this.fileUploadHandler}>
                                Upload Profile Picture
                            </Button>
                        }
                    </EditPictureButtonWrapper>
                    <FormWrapper>
                        {this.state.editMode ?
                            <div>
                                <Label>Current Username</Label>
                                <DisplayField>{this.state.username}</DisplayField>
                            </div>
                            :
                            <div>
                                <Label>Update Username</Label>
                                <InputField
                                    required
                                    value={this.state.username}
                                    placeholder={this.state.username}
                                    onChange={e => {
                                        this.handleInputChange('username', e.target.value);
                                    }}
                                />
                            </div>
                        }


                    <EditUsernameButtonWrapper>
                        {this.state.editMode ?
                            <Button
                                onClick={() => this.setState({editMode: !this.state.editMode})}>
                                Edit
                            </Button>
                            :
                            <Button
                                onClick={() => this.submit()}>
                                Submit New Username
                            </Button>
                        }
                    </EditUsernameButtonWrapper>
                    </FormWrapper>
                    <BackButtonWrapper>
                        <Button
                            onClick={() => this.props.history.push('/menu')}>
                            Back to Mainmenu
                        </Button>
                    </BackButtonWrapper>
                </ProfileContainer>
                <UserList onMountOpen={false}/>
            </BackgroundContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(ProfilePage);
