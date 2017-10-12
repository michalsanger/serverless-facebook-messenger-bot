'use strict';

import {handleAuthentication} from './handlers/authentication';
import {handleTextReceived} from './handlers/textReceived';
import {handleMessageDelivered} from './handlers/messageDelivered';
import {handlePostback} from './handlers/postback';
import {handleAttachmentsReceived} from './handlers/attachmentsReceived';
import {checkSignature} from './utils/checkSignature';

module.exports.handler = function(event, context, callback) {
  if (event.httpMethod === 'GET' && event.hubMode === "subscribe" && event.hubVerifyToken && event.hubChallenge) {
    if (String(event.hubVerifyToken) === String(process.env.VERIFY_TOKEN)) {
      return callback(null, parseInt(event.hubChallenge, 10));
    } else {
      return callback("Invalid verify token");
    }
  }

  if (event.httpMethod === 'GET') {
    return callback(
      "Invalid request. GET is used for subscribe only. "
      + "This request is missing one of required parameters "
      + "(hubMode, hubVerifyToken, hubChallenge)"
    );
  }

  if (event.httpMethod === 'POST') {

    if (!checkSignature(event.signature, event.payload)) {
      return callback("Invalid signature");
    }

    if (process.env.LOG_WEBHOOK_MESSAGES === 'true') {
      console.log(JSON.stringify(event.payload, null, ' '));
    }

    const promises = [];
    let errorCount = 0;
    event.payload.entry.map((entry) => {
      entry.messaging.map((messagingItem) => {

        let handlePromises = routeMessagingItem(messagingItem, entry);
        handlePromises ? promises.concat(handlePromises) : errorCount++;

      });
    });

    return callback(null, {
      messageCount: promises.length,
      errorCount: errorCount,
    });

  }

  return callback("Invalid request");
};

function routeMessagingItem(messagingItem, entry) {
  if (messagingItem.optin) {
    return [handleAuthentication(messagingItem, entry.id, entry.time)];
  }
  if (messagingItem.message && messagingItem.message.text) {
    return [handleTextReceived(messagingItem, entry.id, entry.time)];
  }

  if (messagingItem.message && messagingItem.message.attachments) {
    let res = handleAttachmentsReceived(messagingItem, entry.id, entry.time);
    return res;
  }

  if (messagingItem.delivery) {
    return [handleMessageDelivered(messagingItem, entry.id, entry.time)];
  }

  if (messagingItem.postback) {
    return [handlePostback(messagingItem, entry.id, entry.time)];
  }

  return []; // no match
}
