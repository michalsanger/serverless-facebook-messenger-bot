'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';

import axios from 'axios';
import * as attachmentsReceived from './../functions/webhook/handlers/attachmentsReceived';

import imageReceivedPayload from './assets/imageReceivedPayload.json';
import audioReceivedPayload from './assets/audioReceivedPayload.json';
import locationReceivedPayload from './assets/locationReceivedPayload.json';
import videoReceivedPayload from './assets/videoReceivedPayload.json';

describe('Webhook handler on attachment received request', () => {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(axios, "post");
    sandbox.stub(attachmentsReceived, "createImageMessage");
    // sandbox.stub(attachmentsReceived, "createAudioMessage");
    // sandbox.stub(attachmentsReceived, "createLocationMessage");
    // sandbox.stub(attachmentsReceived, "createVideoMessage");
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Can handle Message-Received Callback with image', (done) => {
    const messagingItem = imageReceivedPayload.messaging[0];
    const pageId = imageReceivedPayload.id;
    const entryTimestamp = imageReceivedPayload.time;
    attachmentsReceived.handleAttachmentsReceived(messagingItem, pageId, entryTimestamp);

    attachmentsReceived.createImageMessage()
    sinon.assert.calledOnce(attachmentsReceived.createImageMessage);

    // const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
    // sinon.assert.calledWithExactly(
    //   firstCall,
    //   imageReceivedPayload.messaging[0],
    //   imageReceivedPayload.id,
    //   imageReceivedPayload.time
    // );

    done();
  });

  // it('Can handle Message-Received Callback with audio', (done) => {
  //   let event = {
  //     httpMethod: 'POST',
  //     payload: {
  //       "object": "page",
  //       "entry": [
  //         audioReceivedPayload,
  //       ]
  //     }
  //   };

  //   handler(event, null, (error, response) => {
  //     sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

  //     const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
  //     sinon.assert.calledWithExactly(
  //       firstCall,
  //       audioReceivedPayload.messaging[0],
  //       audioReceivedPayload.id,
  //       audioReceivedPayload.time
  //     );

  //     done();
  //   });
  // });

  // it('Can handle Message-Received Callback with video', (done) => {
  //   let event = {
  //     httpMethod: 'POST',
  //     payload: {
  //       "object": "page",
  //       "entry": [
  //         videoReceivedPayload,
  //       ]
  //     }
  //   };

  //   handler(event, null, (error, response) => {
  //     sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

  //     const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
  //     sinon.assert.calledWithExactly(
  //       firstCall,
  //       videoReceivedPayload.messaging[0],
  //       videoReceivedPayload.id,
  //       videoReceivedPayload.time
  //     );

  //     done();
  //   });
  // });

  // it('Can handle Message-Received Callback with location', (done) => {
  //   let event = {
  //     httpMethod: 'POST',
  //     payload: {
  //       "object": "page",
  //       "entry": [
  //         locationReceivedPayload,
  //       ]
  //     }
  //   };

  //   handler(event, null, (error, response) => {
  //     sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

  //     const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
  //     sinon.assert.calledWithExactly(
  //       firstCall,
  //       locationReceivedPayload.messaging[0],
  //       locationReceivedPayload.id,
  //       locationReceivedPayload.time
  //     );

  //     done();
  //   });
  // });

});
