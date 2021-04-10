import React from 'react';
import styled from 'styled-components';
import {BackgroundContainer} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import jassboard from "../../views/images/interfaceImages/jasstafel.svg";
import Select from 'react-select';
import acorn from "../../views/images/icons/acorn.png";
import rose from "../../views/images/icons/rose.png";
import bell from "../../views/images/icons/bell.png";
import shield from "../../views/images/icons/shield.png";
import undenufe from "../../views/images/icons/undenufe.png";
import obenabe from "../../views/images/icons/obenabe.png";
import slalom from "../../views/images/icons/slalom.png";
import gusti from "../../views/images/icons/gusti.png";
import mary from "../../views/images/icons/mary.png";



let optionsIngameMode = [
  { value: 'acorn', label: <div><img src={acorn} height={'20px'} width={'20px'}/>Acorn</div>, multiplicator: 1 },
  { value: 'rose', label: <div><img src={rose} height={'20px'} width={'20px'}/>Rose</div>, multiplicator: 1 },
  { value: 'bell', label: <div><img src={bell} height={'20px'} width={'20px'}/>Bell</div>, multiplicator: 1 },
  { value: 'shield', label: <div><img src={shield} height={'20px'} width={'20px'}/>Shield</div>, multiplicator: 1 },
  { value: 'undenufe', label: <div><img src={undenufe} height={'20px'} width={'20px'}/>Undenufe</div>, multiplicator: 1 },
  { value: 'obenabe', label: <div><img src={obenabe} height={'20px'} width={'20px'}/>Obenabe</div>, multiplicator: 1 },
  { value: 'slalom', label: <div><img src={slalom} height={'20px'} width={'20px'}/>Slalom</div>, multiplicator: 1 },
  { value: 'gusti', label: <div><img src={gusti} height={'20px'} width={'20px'}/>Gusti</div>, multiplicator: 1 },
  { value: 'mary', label: <div><img src={mary} height={'20px'} width={'20px'}/>Mary</div>, multiplicator: 1 },
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

const customColumnStyle = {
  multiValue: provided => ({
    ...provided,
    width: '100%',
    height: '33px'
  }),
  multiValueLabel: provided => ({
    ...provided,
    marginRight: 'auto',  // push delete icon to the far right
  }),
  input: provided => ({
    ...provided,
    display: 'flex',
    alignItems: 'flex-start',
  }),
  valueContainer: (provided, state) => ({
    ...provided,
  })
};

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
  flexDirection: props => props.flexDirection || 'column',
  justifyContent: 'top',
  width: props => props.width || '50%',
  height: '100%',
  borderRight: props => props.borderRight || null,
  borderLeft: props => props.borderLeft || null,
  marginLeft: props => props.marginLeft || null,
  marginRight: props => props.marginRight || null
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
    };
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange = (selector, event) => {
    switch (selector) {
      case 'multiplicators': {
        const updatedIngameModes = this.state.ingameModes.map(m =>
          m === event.mode ? {...event.mode, multiplicator: event.newMult.value} : m
        );
        this.setState({ingameModes: updatedIngameModes});
        break;
      };
      case 'modes': {
        this.setState({ingameModes: event});
        break;
      };
    }
  }


  componentDidMount() {
    this.setState({
      ingameModes: [
          optionsIngameMode[0],
          optionsIngameMode[1],
          optionsIngameMode[2],
          optionsIngameMode[3],
          optionsIngameMode[4],
          optionsIngameMode[5]
      ]
    });
  };

  render() {
    return (
      <BackgroundContainer>
        <JassboardContainer>
          <Container height={'15%'} borderBottom={'1px solid #9A9899'}>
            <TextContainer>Topbar</TextContainer>
          </Container>
          <Container height={'70%'}>
            <InnerContainer>
              <TextContainer>
                Ingame Modes
              </TextContainer>
              <InnerContainer width={'100%'} flexDirection={'row'}>
                <InnerContainer width={'70%'}>
                  <Select
                      styles={customColumnStyle}
                      onChange={newModes => this.handleChange('modes', newModes)}
                      closeMenuOnSelect={false}
                      options={optionsIngameMode}
                      defaultValue={[
                        optionsIngameMode[0],
                        optionsIngameMode[1],
                        optionsIngameMode[2],
                        optionsIngameMode[3],
                        optionsIngameMode[4],
                        optionsIngameMode[5]
                      ]}
                      noOptionsMessage={() => "No game modes selected"}
                      isMulti
                      autoFocus
                  />
                </InnerContainer>
                <InnerContainer width={'30%'} marginRight={'15px'}>
                  {this.state.ingameModes?.map(mode =>
                      <Select
                          key={mode.value}
                          options={optionsMultiplicators}
                          defaultValue={optionsMultiplicators[0]}
                          onChange={newMult => this.handleChange('multiplicators', {mode, newMult})}
                      />
                  )}
                </InnerContainer>
              </InnerContainer>
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