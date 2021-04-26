import React from 'react';
import '../cards/index.css';
import styled from 'styled-components';
import { BackgroundContainer, BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import InitDistribution from '../cards/InitDistribution';

const Container = styled(BaseContainer)`
  color: #ffffff;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.props.history.push('/login');
  }

  async componentDidMount() {

  }

  render() {
    return (
      <BackgroundContainer>
        <InitDistribution />
      </BackgroundContainer>
    );
  }
}

export default withRouter(Game);
