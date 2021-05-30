import styled from "styled-components";
import {useSpring, animated} from "react-spring";
import React, {useEffect, useRef, useState} from "react";
import {GlowButton} from "../../../views/design/ElegantAssets";



export const RuleFramer = props => {
  const numItems = React.Children.count(props.children);
  const [itemsPos, setItemsPos] = useState([...(Array(numItems).keys())]);

  useEffect(() => {
    const handleScroll = event => {

      // scrolling upwards
      if (event.deltaY > 10) {
        setItemsPos(prevPos => {
          const tempPos = [...prevPos];
          const first = tempPos.shift();
          tempPos.push(first);
          return tempPos;
        });
      }

      // scrolling downwards
      if (event.deltaY < -10) {
        setItemsPos(prevPos => {
          const tempPos = [...prevPos];
          const last = tempPos.pop();
          tempPos.unshift(last);
          return tempPos;
        });
      }
    };

    document.getElementById('rule-wrapper').addEventListener('wheel', event => handleScroll(event))
    return document.getElementById('rule-wrapper').removeEventListener('wheel', event => handleScroll(event))
  }, []);


  const onPrev = () => {
    setItemsPos(prevPos => {
      const tempPos = [...prevPos];
      const first = tempPos.shift();
      tempPos.push(first);
      return tempPos;
    });
  };

  const onNext = () => {
    setItemsPos(prevPos => {
      const tempPos = [...prevPos];
      const last = tempPos.pop();
      tempPos.unshift(last);
      return tempPos;
    });
  };

  return (
      <>
        <SlideButtonContainer>
          <GlowButton
              style={{borderTopLeftRadius: '100%', paddingLeft: '5%', background: 'rgba(0,0,0,0.6)'}}
              onClick={() => onPrev()}
          >
            previous
          </GlowButton>
          <h1 style={{fontSize: '2rem', fontFamily: `'Satisfy', cursive`, marginBottom: 0, color: '#dddddd'}}>
            Click or Scroll
          </h1>
          <GlowButton
              style={{borderTopRightRadius: '100%', paddingRight: '5%', background: 'rgba(0,0,0,0.6)'}}
              onClick={() => onNext()}
          >
            next
          </GlowButton>
        </SlideButtonContainer>
        <RuleWrapper id={'rule-wrapper'}>
          {itemsPos ?
              <>
                {React.Children.map(props.children, ((child, i) => {
                  return React.cloneElement(child, {numItems: numItems, currPos: itemsPos[i], index: i});
                }))}
              </> : <></>}
        </RuleWrapper>
      </>
  );
}

export const RuleItem = props => {
  const springStyle = useSpring({
    config: {
      duration: 400,
      tension: 300
    },
    to: {
      left: `${(20 / props.numItems) * props.currPos}%`,
      top: `${(20 / props.numItems) * props.currPos}%`,
    }
  })

  return (
      <>
        {props?.numItems && props?.currPos != null ?
            <RuleItemContainer style={{...springStyle, zIndex: 2 * (props.numItems - props.currPos)}}>
              <ItemTextContainer style={{zIndex: 2 * (props.numItems - props.currPos) + 1}}>
                <h1>{props.heading}</h1>
                <p>{props.children}</p>
                <footer>{props.index + 1}</footer>
              </ItemTextContainer>
            </RuleItemContainer> : <></>}
      </>
  );
}

const ItemTextContainer = styled.div`
  position: relative;
  display: block;
  font-family: 'Saira', sans-serif;
  text-align: justify;
  margin: 0 3% 0 3%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  & > h1 {
    font-size: 1.6rem;
    font-weight: 500;
    margin: 2% 3% 2% 3%;
    text-align: center;
  }
  & > p {
    font-size: min(1.8vh, 0.8vw, 1rem);
    font-weight: 400;
  }
  & > footer {
    font-size: 1.3rem;
    font-weight: 300;
    text-align: center;
    margin-top: 2%;
    position: absolute;
    bottom: 0.2%;
    left: 50%;
  }
`;


const RuleItemContainer = styled(animated.div)`
  position: absolute;
  width: 80%;
  height: 80%;

  border: 1px solid #fff;
  border-radius: 15px;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  font-size: 2rem;
  overflow: hidden;
  
  &:before {
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px) saturate(100%) contrast(45%) brightness(130%);
    content: '';
    height: 100%;
    position: absolute;
    width: 100%;
  }
`;

const RuleWrapper = styled.div`
  grid-column: 1;
  grid-row: 2;
  
  position: relative;
  height: 85%;
  width: 100%;
  background: rgba(255,255,255,0);
  align-self: end;
  margin: 0 0 2% 2%;
`;

const SlideButtonContainer = styled.div`
  grid-column: 1;
  grid-row: 2;
  
  height: 12%;
  width: 80%;
  background: rgba(255,255,255,0);
  align-self: start;
  margin-left: 2%;
  
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-evenly;
`;