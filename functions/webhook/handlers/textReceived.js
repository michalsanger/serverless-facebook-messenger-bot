import axios from 'axios';

const fbUrl = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;

export function handleTextReceived(messagingItem, pageId, entryTimestamp) {
  const payload = {
    recipient: {
      id: messagingItem.sender.id,
    },
    message: {
      text: "Text received, echo: " + messagingItem.message.text,
    },
  };

  return axios.post(fbUrl, payload);
}