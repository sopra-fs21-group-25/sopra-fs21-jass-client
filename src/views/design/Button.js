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

export const RainbowButton = styled.button`
  text-decoration:none;
  color:#FFF;
  width:calc(20vw + 6px);
  height:calc(9vw + 6px);
  background-image: linear-gradient(90deg, #00C0FF 0%, #FFCF00 49%, #FC4F4F 80%, #00C0FF 100%);
  border-radius:5px;
  display:flex;
  align-items:center;
  justify-content:center;
  text-transform:uppercase;
  font-size:3vw;
  font-weight:bold;
  
  &:after {
    content:attr(alt);
    width:20vw;
    height:8vw;
    background-color:#191919;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  
  &:hover {
    animation:slidebg 2s linear infinite;
  }
  
  @keyframes slidebg {
  to {
    background-position:20vw;
  }
`;