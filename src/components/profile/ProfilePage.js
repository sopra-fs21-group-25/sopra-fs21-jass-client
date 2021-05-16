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
import FriendList from "../application/FriendList"
import '../application/css/menu.css';
import {InvitationInjector} from "../application/assets/InvitationInjector";
import {IconicInput} from "../../views/design/ElegantAssets";
import User from "../shared/models/User";
import axios from "axios";
//import UploadFilesService from "./UploadFilesService";
import acorn from "../../views/images/icons/acorn.png";


const ProfileContainer =  styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template-areas:
    "empty-topLeft avatar empty-topRight"
    "empty-middleLeft namePassword empty-middleRight"
    "backButton editButton empty-bottomRight";
  grid-gap: 20px;
  width: 100%;
  height: 100%;
`;

const BackButtonWrapper = styled.div`
  grid-area: backButton;
  height: 25%;
  width: 50%;
  display: flex;
  align-self: flex-end;
  justify-content: flex-start;
`;

const EditButtonWrapper = styled.div`
  grid-area: editButton;
  height: 25%;
  width: 50%;
  margin: auto;
`;

const FormWrapper = styled.div`
  grid-area: namePassword;
  align-self: end;
  justify-content: center
`;

const AvatarWrapper = styled.div`
  grid-area: avatar;
  align-self: end;
  justify-content: center;
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
            id: null,
            user: null,
            editMode: true,
            selectedFile: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            fileInfos: [],


        };
    }

    async componentDidMount() {
        this.setState({user: JSON.parse(sessionStorage.getItem('user'))}, async function () {
            const response = await api.get('/users/' + this.state.user.id);
            this.setState({
                username: response.data.username,
            }, console.log(this.state));
            // const responseimage = await api.get('/files/' + this.state.user.id);
            // if (responseimage.status === 500) {
            //     this.setState({
            //         currentFile: acorn,
            //     })
            //     // <img src ={acorn} width="100" />
            // }
        });

        // this.getFile().then((response) => {
        //     this.setState({
        //         currentFile: response.data,
        //     });
        // });
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
                // //localStorage.setItem('user', JSON.stringify(user));
                //
                // //sessionStorage.setItem('user', JSON.stringify(user));
                //
                // // Login successfully worked --> navigate to the route /game in the UsersOverviewRouter
                // //this.props.history.push(`/menu`);
            } else if (response.status === 409) {
                alert(response.data.text)
            }
        } catch (error) {
            alert(`Changing the info was unsuccessful: \n${handleError(error)}`);
        }
        this.setState({editMode: !this.state.editMode})
    }

    upload(file, onUploadProgress) {
        let formData = new FormData();

        formData.append("file", file);

        const response = api.post("/files"+ this.state.user.id, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    getFile() {
        //return acorn;
        return api.get("/files" + this.state.user.id);
    }

    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        });

    }
    fileUploadHandler = () =>{
        let currentFile = this.state.selectedFile[0];

        this.setState({
            progress: 0,
            currentFile: currentFile,
        });

        this.upload(currentFile, (event) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        })
            .then((response) => {
                this.setState({
                    message: response.data.message,
                });
                return this.getFiles();
            })
            .then((files) => {
                this.setState({
                    fileInfos: files.data,
                });
            })
            .catch(() => {
                this.setState({
                    progress: 0,
                    message: "Could not upload the file!",
                    currentFile: undefined,
                });
            });

        this.setState({
            selectedFile: undefined,
        });

    }




render() {
        const {
            selectedFile,
            currentFile,
            progress,
            message,
            fileInfos,
        } = this.state;
        return (
            <BackgroundContainer style={{flexDirection: 'row'}}>
                <ProfileContainer>
                    <AvatarWrapper>
                        <Label>Current Profile Picture</Label>
                        {this.state.editMode ?
                            <div>
                                {currentFile && (
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-info progress-bar-striped"
                                            role="progressbar"
                                            aria-valuenow={progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style={{ width: progress + "%" }}
                                        >
                                            {progress}%
                                        </div>
                                    </div>
                                )}
                            </div>:
                        <div>
                            <input type ="file" onChange={this.fileSelectedHandler} />

                            <Button disabled={!selectedFile }onClick={this.fileUploadHandler}>Upload Profile Picture</Button>}
                        </div>
                        }
                    </AvatarWrapper>
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
                    </FormWrapper>

                    <EditButtonWrapper>
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
                    </EditButtonWrapper>
                    <BackButtonWrapper>
                        <Button
                            onClick={() => this.props.history.push('/menu')}>
                            Back to Mainmenu
                        </Button>
                    </BackButtonWrapper>
                </ProfileContainer>
            </BackgroundContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(ProfilePage);
