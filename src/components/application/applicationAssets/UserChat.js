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
    if(props.activeTab) {
      const chatMessageDTO = {
        senderId: props.user.id,
        senderUsername: props.user.username,
        environmentId: props.activeTab.chatPartnerId,
        groupType: 'BIDIRECTIONAL',
        timestamp: new Date(),
        text: chatInput
      };

      props.appendMessage({
        senderId: props.user.id,
        senderUsername: props.user.username,
        timestamp: chatMessageDTO.timestamp,
        text: chatInput
      });

      props.stompClient.publish({
        destination: `/app/messages/incoming`,
        body: JSON.stringify(chatMessageDTO)
      });
    }
    setChatInput('');
  };


  const deriveMessageModel = ({senderId, senderUsername, timestamp, text}) => {
    return {
      message: text,
      sentTime: timestamp.toLocaleDateString(),
      sender: senderUsername,
      direction: senderId === props.user.id ? 'outgoing' : 'incoming',
      position: 'single',
      type: 'text'
    };
  };


  return (
      <>
        {props.isOpen ?
            <div className={'wrapper-root'}>
              <Header>
                <div className={'header-sub-root-tabs-wrapper'}>
                  {props.allTabs.map((chatDataObj, index) =>
                      <Tab
                          key={index}
                          isActive={props.activeTab?.chatPartnerId === chatDataObj.chatPartnerId}
                          openTab={() => props.openTab(chatDataObj)}
                          closeTab={() => props.closeTab(chatDataObj)}
                      >
                        {console.log({chatDataObj})}
                        {chatDataObj.chatPartnerUsername}
                      </Tab>
                  )}
                </div>
                <div className={'header-sub-root-bottom-line'}/>
              </Header>
              <div className={'body-sub-root'}>
                <MainContainer className={'chat-container-custom-layout'}>
                  <ChatContainer className={'chat-container-custom-layout'}>
                    <MessageList className={'chat-container-custom-layout'}>
                      {props.activeTab && props.allTabs &&
                      props.allTabs.find(t => t.chatPartnerId === props.activeTab.chatPartnerId)
                          .messageData.map((m, index) => {
                            const messageModel = deriveMessageModel(m);
                            return (
                                <Message model={messageModel} key={index}>
                                  <Message.Footer sentTime={messageModel.sentTime}/>
                                </Message>);
                      })}
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