import React from 'react';
import {BackgroundContainer, Container, InnerContainer} from "../../helpers/layout";
import styled from "styled-components";
import {withRouter} from "react-router-dom";
import {Tab, Tabs} from 'react-bootstrap';
import SchieberCreator from "./creators/SchieberCreator";
import CoiffeurCreator from "./creators/CoiffeurCreator";
import BieterCreator from "./creators/BieterCreator";
import SidiCreator from "./creators/SidiCreator";




const tabsStyle = {
  backgroundColor: '#7F8385',
  borderTopRightRadius: '5px',
  borderTopLeftRadius: '5px',
  width: '94%',
  margin: '0 auto',
  padding: 0,
};

/**
 * the actual CreationPage component
 */
class CreationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null
    }
  };

  componentDidMount() {
    this.setState({mode: 'schieber'});
  }

  render() {
    return (
      <BackgroundContainer>
        <Container alignItems={'stretch'} justifyContent={'center'} flexDirection={'column'} width={'60%'}>
          <Tabs
            fill
            style={tabsStyle}
            id={'modeTabs'}
            transition={false}
            activeKey={this.state.mode}
            onSelect={k => {
              this.setState({mode: k});
            }}
          >
            <Tab eventKey={'schieber'} title={'Schieber'}>
              <SchieberCreator/>
            </Tab>
            <Tab eventKey={'coiffeur'} title={'Coiffeur'} disabled>
              <CoiffeurCreator/>
            </Tab>
            <Tab eventKey={'bieter'} title={'Bieter'} disabled>
              <BieterCreator/>
            </Tab>
            <Tab eventKey={'sidi'} title={'2er Sidi'} disabled>
              <SidiCreator/>
            </Tab>
          </Tabs>
        </Container>
      </BackgroundContainer>
    );
  }
}

export default withRouter(CreationPage);