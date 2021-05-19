import React from 'react';
import styled from 'styled-components';
import {useEffect, useState} from 'react';


const Frame = styled('div')({
  display: 'block',
  width: '100%',
  height: '100%'
});

const ItemWrapper = styled('div')({
  width: 'inherit',
  height: 'inherit'
});


const LobbyList = (props) => {
  const [id, setId] = useState(props.id || null);


  useEffect(() => {
    console.log(props);
  }, [id]);

  return (
    <Frame>
      {props.children}
    </Frame>
  );
}

export default LobbyList;