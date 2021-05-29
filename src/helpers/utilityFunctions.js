
export const convertBase64DataToImageUrl = data => {
  const byteCharacters = atob(data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  let image = new Blob([byteArray], { type: 'image/jpeg' });
  return URL.createObjectURL(image);
}

export const deriveMessageModel = ({senderId, senderUsername, timestamp, text}, userId) => {
  return {
    message: text,
    sentTime: timestamp.toLocaleTimeString('de-CH', {timeStyle: 'short'}),
    sender: senderUsername,
    direction: senderId === userId ? 'outgoing' : 'incoming',
    position: 'single',
    type: 'text'
  };
};

export const convertChatMessageDTOtoMessageDataObj = dto => {
  return {
    senderId: dto.senderId,
    senderUsername: dto.senderUsername,
    timestamp: new Date(dto.timestamp),
    text: dto.text
  };
}

export const getChatPartnerIdFromChatMessageDTO = (dto, userId) => {
  return dto?.senderId === userId ? dto?.environmentId : dto?.senderId;
}