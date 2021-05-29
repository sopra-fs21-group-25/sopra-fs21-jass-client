import React, {useEffect, useRef, useState} from 'react';
import './lobbyAssets.scss';
import {ChatContainer, MainContainer, MessageInput, MessageList, Message} from "@chatscope/chat-ui-kit-react";
import Picker from "emoji-picker-react";
import {useOutsideClickHandler} from "../../../helpers/customHooks";
import {useSubscription} from "react-stomp-hooks";
import {convertChatMessageDTOtoMessageDataObj, deriveMessageModel} from "../../../helpers/utilityFunctions";
import {api} from "../../../helpers/api";


export const GroupChat = props => {
  const [hidePicker, setHidePicker] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const pickerRef = useRef(null);
  const [messageData = [{
    senderId: String,
    senderUsername: String,
    timestamp: Date,
    text: String
  }], setMessageData] = useState([]);
  useOutsideClickHandler(pickerRef, () => setHidePicker(true));


  useEffect(() => {
    const fetchAndSetMessageData = async () => {
      const data = (await api.get(`/messages/${props.type}/${props.environmentId}`)).data;
      const receivedMessageData = data.length ? data.map(d => convertChatMessageDTOtoMessageDataObj(d)) : [];
      setMessageData(receivedMessageData);
    };
    void fetchAndSetMessageData();
  }, [props.environmentId]);

  useSubscription(`/messages/outgoing/${props.environmentId}`, msg => {
    const dto = JSON.parse(msg.body);
    const messageDataObj = convertChatMessageDTOtoMessageDataObj(dto);
    setMessageData([...messageData, messageDataObj]);
  });


  const handleSend = () => {
    const chatMessageDTO = {
      senderId: props.myId,
      senderUsername: props.myUsername,
      environmentId: props.environmentId,
      groupType: 'COLLECTIVE',
      timestamp: new Date(),
      text: chatInput
    };

    props.client.publish({
      destination: `/app/messages/incoming`,
      body: JSON.stringify(chatMessageDTO)
    });

    setChatInput('');
  };

  const handleEmojiPick = emoji => setChatInput(chatInput + emoji);


  return (
      <div className={'chat-wrapper'} style={props.refactoredStyle ? props.refactoredStyle : {}}>
        <div className={'chat__inner-wrapper-root'}>
          <div className={'chat__inner-header'}>
            Stübli Chat
          </div>
          <div className={'body-sub-root'}>
            <MainContainer className={'chat-container-custom-layout'}>
              <ChatContainer className={'chat-container-custom-layout'}>
                <MessageList
                    className={'chat-container-custom-layout'}
                    autoScrollToBottom={true}
                    autoScrollToBottomOnMount={true}
                >
                  {!!messageData.length && messageData.map((m, index, array) => {
                    const messageModel = deriveMessageModel(m, props.myId);
                    const header = index === 0 || (index > 0 && m.senderUsername !== array[index-1].senderUsername) ? m.senderUsername : '';
                    return (
                        <Message model={messageModel} key={index}>
                          <Message.Header sender={header}/>
                          <Message.Footer sentTime={messageModel.sentTime}/>
                        </Message>
                    )
                  })}
                </MessageList>
                <div as={MessageInput} className={'custom-cs-input-wrapper'}>
                  <MessageInput
                      placeholder={'type a message...'}
                      sendDisabled={false}
                      attachDisabled={true}
                      value={chatInput}
                      onChange={e => {
                        setChatInput((new DOMParser()).parseFromString(e, 'text/html').documentElement.textContent);
                      }}
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
      </div>
  );
}