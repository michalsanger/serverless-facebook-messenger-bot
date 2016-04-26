import axios from 'axios';

const fbUrl = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.PAGE_ACCESS_TOKEN;

export function handleAttachmentsReceived(messagingItem, pageId, entryTimestamp) {
  let promises = [];
  messagingItem.message.attachments.map((attachment) => {
    let message = {}

    if (attachment.type === 'image') {
      message = createImageMessage(attachment)
    } else if (attachment.type === 'audio') {
      message = createAudioMessage(attachment)
    } else if (attachment.type === 'location') {
      message = createLocationMessage(attachment)
    } else if (attachment.type === 'video') {
      message = createVideoMessage(attachment)
    }

    promises.push(sendMessage(message, messagingItem.sender.id));
  });

  return promises;
}

function sendMessage(message, recipientId) {
  const payload = {
    recipient: {
      id: recipientId,
    },
    message: message,
  };

  return axios.post(fbUrl, payload);
}

function createImageMessage(attachment) {
  return {
    text: "Image received, thanks",
  }
}

function createAudioMessage(attachment) {
  return {
    text: "Audio received, thanks",
  }
}

function createLocationMessage(attachment) {
  const lat = attachment.payload.coordinates.lat;
  const lng = attachment.payload.coordinates.long;
  return {
    text: `Location received, echo: ${lat},${lng}`,
  }
}

function createVideoMessage(attachment) {
  return {
    text: "Video received, thanks",
  }
}
