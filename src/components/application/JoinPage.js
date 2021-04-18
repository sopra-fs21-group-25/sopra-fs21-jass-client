import Select from "react-select";
import {Button} from "../../views/design/Button";
import React from "react";
import {
  JassboardContainer,
  TextContainer,
  InnerContainer,
  Container,
  CheckboxContainerColumn,
  CheckboxContainerRow,
  BackgroundContainer
} from "../../helpers/layout";
import {withRouter} from "react-router-dom";
import {api} from "../../helpers/api";




class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: this.props.location.friends,
      friendsLobbies: [],
      allLobbies: []
    }
  }

  async componentDidMount() {
    try {
      const lobbies = await api.get('/lobbies');

      const friendsLobbies = lobbies.data.filter(lobby => {
        return this.state.friends?.filter(friend => friend.username === lobby.creatorUsername).length > 0;
      });

      this.setState({
        friendsLobbies: friendsLobbies,
        allLobbies: lobbies.data
      }, () => console.log({state: this.state}));

    } catch(error) {
      alert("Something went wrong while trying to fetch the lobbies");
    }
  }

  render() {
    return (
      <BackgroundContainer>

      </BackgroundContainer>
    );
  }
}

export default withRouter(JoinPage);

