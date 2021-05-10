import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transition: 0.1s;
    transform: translateY(-2px);
    background-color: #A5A9AB;
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 15px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 100%;
  height: ${props => props.height || null};
  border: 1px solid black;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #7F8385;
  transition: all 0.3s ease;
`;



