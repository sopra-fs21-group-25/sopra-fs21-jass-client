import React from 'react';
import {withRouter} from "react-router-dom";
import {BackgroundContainer, JassboardContainer, TextContainer, InnerContainer, Container, CheckboxContainerColumn, CheckboxContainerRow} from "../../helpers/layout";




class LobbyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.location.state;
  }

  componentDidMount() {
    console.log(this.state);
  }

  render() {
    return (
        <BackgroundContainer>
          Test
        </BackgroundContainer>
    )
  }

}

export default withRouter(LobbyPage);