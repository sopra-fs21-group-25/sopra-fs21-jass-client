import React, {useEffect, useRef} from 'react';
import {useSwipeScroll} from "../../../helpers/useSwipeScroll";
import {MainContainer, ChatContainer, MessageList, Message, MessageInput, InputToolbox, AttachmentButton} from "@chatscope/chat-ui-kit-react";
import 'react-chat-elements/dist/main.css';
import '../css/userChat.scss';



export const UserChat = props => {
  useEffect(() => {
    console.log({datasource: props.activeTab?.messageObj})
  })
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
                      {props.activeTab?.messageObj.map(m =>
                          <Message model={m}>
                            <Message.Footer sentTime={m.sentTime}/>
                          </Message>
                      )}
                    </MessageList>
                    <MessageInput placeholder={'type a message...'} sendDisabled={false}/>
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