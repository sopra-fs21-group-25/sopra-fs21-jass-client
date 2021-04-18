import Select from "react-select";
import {Button} from "../../../views/design/Button";
import React from "react";
import {JassboardContainer, TextContainer, InnerContainer, Container, CheckboxContainerColumn, CheckboxContainerRow} from "../../../helpers/layout";
import acorn from "../../../views/images/icons/acorn.png";
import rose from "../../../views/images/icons/rose.png";
import bell from "../../../views/images/icons/bell.png";
import shield from "../../../views/images/icons/shield.png";
import undenufe from "../../../views/images/icons/undenufe.png";
import obenabe from "../../../views/images/icons/obenabe.png";
import slalom from "../../../views/images/icons/slalom.png";
import gusti from "../../../views/images/icons/gusti.png";
import mary from "../../../views/images/icons/mary.png";
import {Redirect, withRouter} from "react-router-dom";
import {api} from "../../../helpers/api";

/**
 * Different style objects
 */
const customColumnStyle = {
  multiValue: provided => ({
    ...provided,
    width: '100%',
    height: '33.5px',
    border: '1px solid black',
    borderRadius: '5px'
  }),
  multiValueLabel: provided => ({
    marginRight: 'auto'
  }),
  input: provided => ({
    ...provided,
    display: 'flex',
    alignItems: 'flex-start',
  }),
  multiValueContainer: provided => ({
    ...provided,
  })
};

const checkboxLabelStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  textAlign: 'center'
};

const checkboxFormStyle = {
  display: 'flex',
  flexDirection: 'row',
  width: '100%'
}



// Helper object for the multiplicators
const multiplicators = {
  acorn: 1, rose: 1, bell: 1, shield: 1, undenufe: 1, obenabe: 1, slalom: 1, gusti: 1, mary: 1
};

// Helper function to update multiplicators
function updateMultiplicators(key, newVal) {
  multiplicators[key] = newVal;
};


// Helper function to convert a card to the correct Enum representation in the backend
function convertCardToBackendRepresentation({suit, rank}) {
  let newSuit = suit.toUpperCase();
  let newRank;
  switch(rank) {
    case '6': newRank = 'SIX'; break;
    case '7': newRank = 'SEVEN'; break;
    case '8': newRank = 'EIGHT'; break;
    case '9': newRank = 'NINE'; break;
    case 'Banner': newRank = 'TEN'; break;
    case 'Under': newRank = 'UNDER'; break;
    case 'Ober': newRank = 'OBER'; break;
    case 'King': newRank = 'KING'; break;
    case 'Ace': newRank = 'ACE'; break;
  }
  return {suit: newSuit, rank: newRank}
}


/**
 * The following are the different arrays for the Select forms
 */
const optionsIngameModes = [
  { value: 'acorn', label: <div><img src={acorn} height={'20px'} width={'20px'} margin={'5px'}/>Acorn</div> },
  { value: 'rose', label: <div><img src={rose} height={'20px'} width={'20px'}/>Rose</div> },
  { value: 'bell', label: <div><img src={bell} height={'20px'} width={'20px'}/>Bell</div> },
  { value: 'shield', label: <div><img src={shield} height={'20px'} width={'20px'}/>Shield</div> },
  { value: 'undenufe', label: <div><img src={undenufe} height={'20px'} width={'20px'}/>Undenufe</div> },
  { value: 'obenabe', label: <div><img src={obenabe} height={'20px'} width={'20px'}/>Obenabe</div> },
  { value: 'slalom', label: <div><img src={slalom} height={'20px'} width={'20px'}/>Slalom</div> },
  { value: 'gusti', label: <div><img src={gusti} height={'20px'} width={'20px'}/>Gusti</div> },
  { value: 'mary', label: <div><img src={mary} height={'20px'} width={'20px'}/>Mary</div> }
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

const optionsStartingCard = ['Acorn', 'Rose', 'Bell', 'Shield'].map(s => {
  return ['6', '7', '8', '9', 'Banner', 'Under', 'Ober', 'King', 'Ace'].map(r => {
    const img = s == 'Acorn' ? acorn : s == 'Rose' ? rose : s == 'Bell' ? bell : shield;
    const value = {suit: s, rank: r};
    const label = <div><img src={img} height={'20px'} width={'20px'}/>{s + ' ' + r}</div>;
    return {value: value, label: label}
  })}).reduce((acc, curr) => acc.concat(curr), []);

const optionsPointsToWin = [];
for(let i=5; i<=100; i++) {
  optionsPointsToWin.push({value: i * 100, label: (i * 100).toString() + ' points'});
}



class SchieberCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyType: null,
      startingCard: null,
      pointsToWin: 0,
      ingameModes: [],
      ingameModesMultiplicators: null,
      weis: false,
      crossWeis: false,
      weisAsk: null
    };
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange = (selector, event) => {
    switch (selector) {
      case 'multiplicators': {
        updateMultiplicators(event.mode.value, event.newMult.value);
        this.setState({ingameModesMultiplicators: multiplicators}, () => console.log(this.state.ingameModes, this.state.ingameModesMultiplicators));
        break;
      };
      case 'modes': {
        this.setState({ingameModes: event }, () => console.log(this.state.ingameModes, this.state.ingameModesMultiplicators));
        break;
      };
      case 'lobbyType': {
        this.setState({lobbyType: event}, () => console.log(this.state.lobbyType));
        break;
      };
      case 'startingCard': {
        this.setState({startingCard: event.value}, () => console.log(this.state.startingCard));
        break;
      };
      case 'pointsToWin': {
        this.setState({pointsToWin: event.value}, () => console.log(this.state.pointsToWin));
        break;
      };
      case 'weis': {
        this.setState({weis: event, crossWeis: false, weisAsk: 'never'}, () => console.log(this.state.weis));
        break;
      };
      case 'crossWeis': {
        this.setState({crossWeis: event}, () => console.log(this.state.crossWeis));
        break;
      };
      case 'weisAsk': {
        this.setState({weisAsk: event}, () => console.log(this.state.weisAsk));
        break;
      }
    }
  }

  componentDidMount() {
    this.setState({
      ingameModes: [
        optionsIngameModes[0],
        optionsIngameModes[1],
        optionsIngameModes[2],
        optionsIngameModes[3],
        optionsIngameModes[4],
        optionsIngameModes[5]
      ],
      ingameModesMultiplicators: {
        acorn: 1, rose: 1, bell: 1, shield: 1, undenufe: 1, obenabe: 1, slalom: 1, gusti: 1, mary: 1
      },
      startingCard: optionsStartingCard[13].value,
      mode: 'schieber',
      pointsToWin: 2500,
      lobbyType: 'private',
    });
  };

  async submit() {
    try {
      const usersResponse = await api.get('/users');
      const myUsername = usersResponse.data.filter(user => {
        return user.token == localStorage.getItem('token');
      })[0].username;

      const packedIngameModes = this.state.ingameModes.map(mode => {
        return {ingameMode: mode.value.toUpperCase(), multiplicator: this.state.ingameModesMultiplicators[mode.value]};
      });

      const requestBody = JSON.stringify({
        mode: 'SCHIEBER',
        lobbyType: this.state.lobbyType,
        ingameModes: packedIngameModes,
        startingCard: convertCardToBackendRepresentation(this.state.startingCard),
        pointsToWin: this.state.pointsToWin,
        weis: this.state.weis,
        crossWeis: this.state.crossWeis,
        weisAsk: this.state.weisAsk,
        creatorUsername: myUsername
      });

      const lobbyResponse = await api.post('/lobbies', requestBody);
      console.log(lobbyResponse.data);

      this.props.history.push({
        pathname: `/lobby/${lobbyResponse.data.id}`,
        state: {...lobbyResponse.data}
      });

    } catch(error) {
      alert('An error has occured on game creation');
    }
  }

  render() {
    return (
        <JassboardContainer>
          <Container justifyContent={'space-between'} height={'15%'} borderBottom={'1px solid #9A9899'}>
            <form style={checkboxFormStyle}>
              <label style={checkboxLabelStyle}>
                <CheckboxContainerColumn>
                  Private
                  <input
                      name={'Private'}
                      type={'checkbox'}
                      checked={this.state.lobbyType == 'private'}
                      onChange={() => this.handleChange('lobbyType', 'private')}
                  />
                </CheckboxContainerColumn>
              </label>
              <label style={checkboxLabelStyle}>
                <CheckboxContainerColumn>
                  Friends
                  <input
                      name={'Friends-only'}
                      type={'checkbox'}
                      checked={this.state.lobbyType == 'friends'}
                      onChange={() => this.handleChange('lobbyType', 'friends')}
                  />
                </CheckboxContainerColumn>
              </label>
              <label style={checkboxLabelStyle}>
                <CheckboxContainerColumn>
                  Public
                  <input
                      name={'Public'}
                      type={'checkbox'}
                      checked={this.state.lobbyType == 'public'}
                      onChange={() => this.handleChange('lobbyType', 'public')}
                  />
                </CheckboxContainerColumn>
              </label>
            </form>
          </Container> {/*Header*/}
          <Container height={'70%'}>  {/*Selection content*/}
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
                      options={optionsIngameModes}
                      defaultValue={[
                        optionsIngameModes[0],
                        optionsIngameModes[1],
                        optionsIngameModes[2],
                        optionsIngameModes[3],
                        optionsIngameModes[4],
                        optionsIngameModes[5]
                      ]}
                      noOptionsMessage={() => "No game modes selected"}
                      isMulti
                  />
                </InnerContainer>
                <InnerContainer width={'30%'}>
                  {this.state.ingameModes?.map(mode =>
                      <Select
                          key={mode.value}
                          options={optionsMultiplicators}
                          defaultValue={optionsMultiplicators[this.state.ingameModesMultiplicators[mode.value] - 1]}
                          styles={{control: provided => ({...provided, marginRight: '15px'})}}
                          onChange={newMult => this.handleChange('multiplicators', {mode, newMult})}
                      />
                  )}
                </InnerContainer>
              </InnerContainer>
            </InnerContainer> {/*Left selection area*/}
            <InnerContainer borderLeft={'1px solid #9A9899'}>
              <InnerContainer width={'100%'} height={'30%'} flexDirection={'row'}>
                <InnerContainer width={'55%'}>
                  <TextContainer>
                    Starting Card
                  </TextContainer>
                  <Select
                      key={'startingCard'}
                      options={optionsStartingCard}
                      styles={{control: provided => ({...provided, marginLeft: '15px', marginBottom: '15px'})}}
                      defaultValue={optionsStartingCard[13]} //Rose 10 / Banner
                      onChange={newStartingCard => this.handleChange('startingCard', newStartingCard)}
                  />
                </InnerContainer>
                <InnerContainer width={'45%'}>
                  <TextContainer>
                    Points to Win
                  </TextContainer>
                  <Select
                      key={'pointsToWin'}
                      options={optionsPointsToWin}
                      styles={{control: provided => ({...provided, marginLeft: '15px'})}}
                      defaultValue={optionsPointsToWin[20]}
                      onChange={newPointsToWin => this.handleChange('pointsToWin', newPointsToWin)}
                  />
                </InnerContainer>
              </InnerContainer> {/*starting card & points to win*/}
              <InnerContainer marginLeft={'15px'} width={'100%'} height={'15%'} marginBottom={'0px'}>
                <form style={{...checkboxFormStyle, justifyContent: 'center'}}>
                  <label style={checkboxLabelStyle}>
                    <TextContainer>
                      Weis allowed?
                      <input
                          style={{marginLeft: '5px'}}
                          name={'Weis'}
                          type={'checkbox'}
                          checked={this.state.weis}
                          onChange={() => this.handleChange('weis', !this.state.weis)}
                      />
                    </TextContainer>
                  </label>
                  {this.state.weis ?
                      (<label style={checkboxLabelStyle}>
                        <TextContainer>
                          Cross-Weis?
                          <input
                              style={{marginLeft: '5px'}}
                              name={'crossWeis'}
                              type={'checkbox'}
                              checked={this.state.crossWeis}
                              onChange={() => this.handleChange('crossWeis', !this.state.crossWeis)}
                          />
                        </TextContainer>
                      </label>) : null
                  }
                </form>
              </InnerContainer>
              <InnerContainer marginLeft={'15px'} width={'100%'} height={'55%'}>
                {this.state.weis ?
                    (<>
                      <TextContainer marginBottom={'5px'}>
                        When shall the winning Weis be revealed?
                      </TextContainer>
                      <form style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <label style={checkboxLabelStyle}>
                          <CheckboxContainerRow>
                            Never
                            <input
                                style={{marginLeft: '5px'}}
                                name={'weisRevealNever'}
                                type={'checkbox'}
                                checked={this.state.weisAsk == 'never'}
                                onChange={() => this.handleChange('weisAsk', 'never')}
                            />
                          </CheckboxContainerRow>
                        </label>
                        <label style={checkboxLabelStyle}>
                          <CheckboxContainerRow>
                            Enemy may ask
                            <input
                                style={{marginLeft: '5px'}}
                                name={'weisRevealEnemyAsk'}
                                type={'checkbox'}
                                checked={this.state.weisAsk == 'enemy'}
                                onChange={() => this.handleChange('weisAsk', 'enemy')}
                            />
                          </CheckboxContainerRow>
                        </label>
                        <label style={checkboxLabelStyle}>
                          <CheckboxContainerRow>
                            Everyone may ask
                            <input
                                style={{marginLeft: '5px'}}
                                name={'weisRevealEveryoneAsk'}
                                type={'checkbox'}
                                checked={this.state.weisAsk == 'everyone'}
                                onChange={() => this.handleChange('weisAsk', 'everyone')}
                            />
                          </CheckboxContainerRow>
                        </label>
                        <label style={checkboxLabelStyle}>
                          <CheckboxContainerRow>
                            Always
                            <input
                                style={{marginLeft: '5px'}}
                                name={'weisRevealAlways'}
                                type={'checkbox'}
                                checked={this.state.weisAsk == 'always'}
                                onChange={() => this.handleChange('weisAsk', 'always')}
                            />
                          </CheckboxContainerRow>
                        </label>
                      </form>
                    </>) : null
                }
              </InnerContainer>
            </InnerContainer> {/*Right selection area*/}
          </Container>
          <Container height={'15%'}>
            <Button onClick={() => this.props.history.push('/menu')}>
              Back to Mainmenu
            </Button>
            <Button onClick={() => this.submit()}>
              Create Gametable
            </Button>
          </Container> {/*Footer*/}
        </JassboardContainer>
    )
  }
}

export default withRouter(SchieberCreator);