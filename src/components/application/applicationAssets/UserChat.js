import React, {useState, useRef} from 'react';
import {useSwipeScroll, useOutsideClickHandler} from "../../../helpers/customHooks";
import {MainContainer, ChatContainer, MessageList, Message, MessageInput} from "@chatscope/chat-ui-kit-react";
import Picker from 'emoji-picker-react';
import '../css/userChat.scss';



export const UserChat = props => {
  const [hidePicker, setHidePicker] = useState(true);
  const [chatInput, setChatInput] = useState('');

  const pickerRef = useRef(null);

  useOutsideClickHandler(pickerRef, () => setHidePicker(true));

  const handleEmojiPick = emoji => setChatInput(chatInput + emoji);


  const handleSend = () => {
    // TODO: backend stuff etc...

    setChatInput('');
  }


  return (
      <>
        {props.isOpen ?
            <div className={'wrapper-root'}>
              <Header>
                <div className={'header-sub-root-tabs-wrapper'}>
                  {props.allTabs.map((userMsgObjPair, index) =>
                      <Tab
                          key={index}
                          isActive={props.activeTab?.user.id === userMsgObjPair.user.id}
                          openTab={() => props.openTab(userMsgObjPair)}
                          closeTab={() => props.closeTab(userMsgObjPair)}
                      >
                        {userMsgObjPair.user.username}
                      </Tab>
                  )}
                </div>
                <div className={'header-sub-root-bottom-line'}/>
              </Header>
              <div className={'body-sub-root'}>
                <MainContainer className={'chat-container-custom-layout'}>
                  <ChatContainer className={'chat-container-custom-layout'}>
                    <MessageList className={'chat-container-custom-layout'}>
                      {props.activeTab?.messageObj.map((m, index) =>
                          <Message model={m} key={index}>
                            <Message.Footer sentTime={m.sentTime}/>
                          </Message>
                      )}
                    </MessageList>
                    <div as={MessageInput} className={'custom-cs-input-wrapper'}>
                      <MessageInput
                          placeholder={'type a message...'}
                          sendDisabled={false}
                          attachDisabled={true}
                          value={chatInput}
                          onChange={e => setChatInput(e)}
                          onSend={() => handleSend()}
                      />
                      <button className={'emoji-button-wrapper'} onClick={() => setHidePicker(prev => !prev)}>
                        <i className={'material-icons'}>emoji_emotions</i>
                      </button>
                      <div hidden={hidePicker} className={'picker-wrapper'} ref={pickerRef}>
                        <Picker
                            onEmojiClick={(e, data) => handleEmojiPick(data.emoji)}
                            className={'picker-layout'}
                            pickerStyle={{boxShadow: 'none', width: '100%'}}
                        />
                      </div>
                    </div>
                  </ChatContainer>
                </MainContainer>
              </div>
            </div>
            : <></>}
      </>
  );
}


const Header = props => {
  const ref = useRef(null);
  useSwipeScroll({
    sliderRef: ref
  });
  return (
      <div className={'header-sub-root'} ref={ref}>
        {props.children}
      </div>
  );
}


const Tab = props => {
  return (
    <div className={'tab' + (props.isActive ? ' active' : '')}>
      <button className={'text'} onClick={() => !props.isActive && props.openTab()}>
        {props.children}
      </button>
      <button className={'cross'} onClick={() => props.closeTab()}>
        <i className={'material-icons'}>cancel</i>
      </button>
    </div>
  );
}