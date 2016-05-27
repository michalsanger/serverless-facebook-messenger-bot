'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import {handler} from './../functions/webhook/handler';
import * as authentication from './../functions/webhook/handlers/authentication';
import * as textReceived from './../functions/webhook/handlers/textReceived';
import * as messageDelivered from './../functions/webhook/handlers/messageDelivered';
import * as postback from './../functions/webhook/handlers/postback';
import * as attachmentsReceived from './../functions/webhook/handlers/attachmentsReceived';

import authenticationPayload from './assets/authenticationPayload.json';
import textReceivedPayload from './assets/textReceivedPayload.json';
import textBatchReceivedPayload from './assets/textBatchReceivedPayload.json';
import messageDeliveredPayload from './assets/messageDeliveredPayload.json';
import postbackPayload from './assets/postbackPayload.json';
import imageReceivedPayload from './assets/imageReceivedPayload.json';
import audioReceivedPayload from './assets/audioReceivedPayload.json';
import locationReceivedPayload from './assets/locationReceivedPayload.json';
import videoReceivedPayload from './assets/videoReceivedPayload.json';
import crypto from 'crypto';

describe('Webhook handler on POST request', () => {
  let sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(authentication, "handleAuthentication");
    sandbox.stub(textReceived, "handleTextReceived");
    sandbox.stub(messageDelivered, "handleMessageDelivered");
    sandbox.stub(postback, "handlePostback");
    sandbox.stub(attachmentsReceived, "handleAttachmentsReceived");
    process.env.APP_SECRET = 'app secret'
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('Can handle Authentication Callback', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          authenticationPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(authentication.handleAuthentication);

      const firstCall = authentication.handleAuthentication.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        authenticationPayload.messaging[0],
        authenticationPayload.id,
        authenticationPayload.time
      );

      done();
    });
  });

  it('Can handle Message-Received Callback', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          textReceivedPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(textReceived.handleTextReceived);

      const firstCall = textReceived.handleTextReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        textReceivedPayload.messaging[0],
        textReceivedPayload.id,
        textReceivedPayload.time
      );

      done();
    });
  });

  it('Can handle batch Message-Received Callback', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": textBatchReceivedPayload
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledThrice(textReceived.handleTextReceived);

      const firstCall = textReceived.handleTextReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        textBatchReceivedPayload[0].messaging[0],
        textBatchReceivedPayload[0].id,
        textBatchReceivedPayload[0].time
      );
      const secondCall = textReceived.handleTextReceived.getCall(1);
      sinon.assert.calledWithExactly(
        secondCall,
        textBatchReceivedPayload[1].messaging[0],
        textBatchReceivedPayload[1].id,
        textBatchReceivedPayload[1].time
      );
      const thirdCall = textReceived.handleTextReceived.getCall(2);
      sinon.assert.calledWithExactly(
        thirdCall,
        textBatchReceivedPayload[1].messaging[1],
        textBatchReceivedPayload[1].id,
        textBatchReceivedPayload[1].time
      );

      done();
    });
  });

  it('Can handle Message-Received Callback with image', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          imageReceivedPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

      const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        imageReceivedPayload.messaging[0],
        imageReceivedPayload.id,
        imageReceivedPayload.time
      );

      done();
    });
  });

  it('Can handle Message-Received Callback with audio', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          audioReceivedPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

      const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        audioReceivedPayload.messaging[0],
        audioReceivedPayload.id,
        audioReceivedPayload.time
      );

      done();
    });
  });

  it('Can handle Message-Received Callback with video', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          videoReceivedPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

      const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        videoReceivedPayload.messaging[0],
        videoReceivedPayload.id,
        videoReceivedPayload.time
      );

      done();
    });
  });

  it('Can handle Message-Received Callback with location', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          locationReceivedPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(attachmentsReceived.handleAttachmentsReceived);

      const firstCall = attachmentsReceived.handleAttachmentsReceived.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        locationReceivedPayload.messaging[0],
        locationReceivedPayload.id,
        locationReceivedPayload.time
      );

      done();
    });
  });

  it('Can handle Message-Delivered Callback', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          messageDeliveredPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(messageDelivered.handleMessageDelivered);

      const firstCall = messageDelivered.handleMessageDelivered.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        messageDeliveredPayload.messaging[0],
        messageDeliveredPayload.id,
        messageDeliveredPayload.time
      );

      done();
    });
  });

  it('Can handle Postback Callback', (done) => {
    let event = {
      httpMethod: 'POST',
      payload: {
        "object": "page",
        "entry": [
          postbackPayload,
        ]
      }
    };
    const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(JSON.stringify(event.payload)).digest('hex');
    event.signature = 'sha1=' + signatureHash;

    handler(event, null, (error, response) => {
      sinon.assert.calledOnce(postback.handlePostback);

      const firstCall = postback.handlePostback.getCall(0);
      sinon.assert.calledWithExactly(
        firstCall,
        postbackPayload.messaging[0],
        postbackPayload.id,
        postbackPayload.time
      );

      done();
    });
  });
});
