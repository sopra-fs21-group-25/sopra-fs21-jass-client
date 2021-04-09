import React from 'react';
import styled, {ThemeProvider} from 'styled-components';
import {BackgroundContainer} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import jassboard from "../../views/images/interfaceImages/jasstafel.svg";
import Select, { components } from 'react-select';
import makeAnimated from 'react-select/animated';
import acorn from "../../views/images/icons/acorn.png";
import rose from "../../views/images/icons/rose.png";
import bell from "../../views/images/icons/bell.png";
import shield from "../../views/images/icons/shield.png";



const optionsIngameMode = [
  { value: 'acorn', label: <div><img src={acorn} height={'20px'} width={'20px'}/>Acorn</div>, multiplicator: 1 },
  { value: 'rose', label: <div><img src={rose} height={'20px'} width={'20px'}/>Rose</div>, multiplicator: 1 },
  { value: 'bell', label: <div><img src={bell} height={'20px'} width={'20px'}/>Bell</div>, multiplicator: 2 },
  { value: 'shield', label: <div><img src={shield} height={'20px'} width={'20px'}/>Shield</div>, multiplicator: 2 }
];

const optionsMultiplicators = [
  { value: 1, label: '1x'},
  { value: 2, label: '2x'},
  { value: 3, label: '3x'},
  { value: 4, label: '4x'},
  { value: 5, label: '5x'},
  { value: 6, label: '6x'},
  { value: 7, label: '7x'},
  { value: 8, label: '8x'},
  { value: 9, label: '9x'},
  { value: 10, label: '10x'},
];

const JassboardContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'top',
  width: '60%',
  aspectRatio: '755/509',
  backgroundImage: `url(${jassboard})`,
  backgroundSize: 'cover',
  padding: '3%'
});

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: props => props.height,
  borderTop: props => props.borderTop || null,
  borderBottom: props => props.borderBottom || null
});

const InnerContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'top',
  width: props => props.width || '50%',
  height: '100%',
  borderRight: props => props.borderRight || null,
  borderLeft: props => props.borderLeft || null
});

const TextContainer = styled('div')({
  fontSize: '14pt',
  textAlign: 'center',
  color: '#9A9899',
  fontWeight: '700',
  marginTop: '15px',
  marginBottom: '10px'
});



export default class CreationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: null,
      lobbyType: null,
      startingCard: null,
      ingameModes: [],
      weis: false,
      crossWeis: null,
      weisAsk: null
    }
  };

  handleIngameModeChange = modes => {
    this.setState({ingameModes: modes});
    console.log(this);
  };

  handleMultiplicatorChange = (mode, value) => {
    const updatedIngameModes = this.state.ingameModes.map(m => {
      if(m === mode) {
        return {...mode, multiplicator: value.value};
      }
      return m;
    });
    this.setState({ingameModes: updatedIngameModes});
    console.log(this);
  };

  componentDidMount() {
    this.setState({ ingameModes: optionsIngameMode});
  };

  render() {
    return (
      <BackgroundContainer>
        <JassboardContainer>
          <Container height={'15%'} borderBottom={'1px solid #9A9899'}>
            <TextContainer>Topbar</TextContainer>
          </Container>
          <Container height={'70%'}>

            <InnerContainer width={'30%'}>
              <TextContainer>Ingame Modes</TextContainer>
              <Select
                onChange={value => this.handleIngameModeChange(value)}
                closeMenuOnSelect={false}
                components={makeAnimated()}
                options={optionsIngameMode}
                defaultValue={optionsIngameMode}
                noOptionsMessage={() => "No game modes selected"}
                isMulti
                autoFocus
              />
            </InnerContainer>

            <InnerContainer width={'20%'}>
              {this.state.ingameModes?.map(mode =>
                  <Select
                    options={optionsMultiplicators}
                    defaultValue={optionsMultiplicators[mode.multiplicator - 1]}
                    onChange={value => this.handleMultiplicatorChange(mode, value)}
                  />
              )}
            </InnerContainer>

            <InnerContainer borderLeft={'1px solid #9A9899'}>

            </InnerContainer>

          </Container>
          <Container height={'15%'}>
            <Button>
              Back to Mainmenu
            </Button>
            <Button>
              Create Gametable
            </Button>
          </Container>

        </JassboardContainer>
      </BackgroundContainer>
    );
  }
}