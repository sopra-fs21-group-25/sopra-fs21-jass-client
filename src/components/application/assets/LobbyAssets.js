import styled from "styled-components";


export const LobbyWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 2fr;
  grid-template-rows: 1fr 1fr 5fr 1fr 1fr;
  grid-gap: 1em;
  width: 100%;
  height: 100%;
  margin: 1em;
`;

export const SearchBar = styled.input`
  grid-column: 2;
  grid-row: 1;
  &::placeholder {
    color: rgba(154, 152, 153, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin: 1em;
  border: none;
  border-radius: 10px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.8);
  color: black;
`;

export const JassTeppichWrapper = styled.div`
  grid-column: 2;
  grid-row: 3; 
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;


export const PlayerWrapper = styled.div`
  grid-column: 1;
  grid-row: 2 / 4; 
  width: 100%;
  height: 100%;
  align-self: center;
  background-color: #707070;
  opacity: 80%;
  border: none;
  border-radius: 10px;
  display: grid;
  grid-template-rows: 1fr 9fr;
`;

export const PlayerHeader = styled.div`
  grid-row: 1;
  background-color: #808080;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
`;

export const ChatWrapper = styled.div`
  grid-column: 3;
  grid-row: 2 / 4; 
  width: 100%;
  height: 100%;
  align-self: center;
  background-color: #add8e6;
  opacity: 80%;
  border: none;
  border-radius: 10px;
`;

/*export const SitButtonTop = styled.button`
  grid-column: 2;
  grid-row: 2; 
  width: 3em;
  height: 2em;
  align-self: end;
  justify-self: center;  
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;

export const SitButtonRight = styled.button`
  grid-column: 4;
  grid-row: 3; 
  width: 3em;
  height: 2em;
  align-self: center;
  justify-self: start;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;

export const SitButtonBottom = styled.button`
  grid-column: 3;
  grid-row: 4; 
  width: 3em;
  height: 2em;
  align-self: start;
  justify-self: center;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;

export const SitButtonLeft = styled.button`
  grid-column: 2;
  grid-row: 3; 
  width: 3em;
  height: 2em;
  align-self: center;
  justify-self: end;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;*/

export const StartButton = styled.button`
  grid-column: 2;
  grid-row: 5; 
  min-width: 170px;
  width: 50%;
  height: 2em;
  align-self: center;
  justify-self: center;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;

export const BackButton = styled.button`
  grid-column: 1;
  grid-row: 5; 
  min-width: 170px;
  width: 50%;
  height: 2em;
  align-self: center;
  justify-self: start;
  background-color: #808080;
  border: none;
  border-radius: 3px;
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  font-size: 15px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;