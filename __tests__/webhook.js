'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {handler} from './../functions/webhook/handler';

describe('Webhook handler', () => {
  describe('on GET request', () => {
    it('Can subscribe', (done) => {
      let event = {
        httpMethod: 'GET',
        hubMode: "subscribe",
        hubVerifyToken: "secret token",
        hubChallenge: 987654321,
      };
      process.env.VERIFY_TOKEN = 'secret token';

      handler(event, null, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.equal(987654321);
        done();
      });
    });

    it('Can handle integer verify token', (done) => {
      let event = {
        httpMethod: 'GET',
        hubMode: "subscribe",
        hubVerifyToken: "123",
        hubChallenge: 987654321,
      };
      process.env.VERIFY_TOKEN = 123;

      handler(event, null, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.equal(987654321);
        done();
      });
    });

    it('Cast hubChallenge to Int', (done) => {
      let event = {
        httpMethod: 'GET',
        hubMode: "subscribe",
        hubVerifyToken: "secret token",
        hubChallenge: '123',
      };
      process.env.VERIFY_TOKEN = 'secret token';

      handler(event, null, (error, response) => {
        expect(error).to.be.null;
        expect(response).to.equal(123);
        done();
      });
    });

    it('Will crash on invalid params', (done) => {
      let events = {
        'Wrong hubMode': {
          hubMode: "foo",
          hubVerifyToken: "secret token",
          hubChallenge: 1234567890,
        },
        'No hubVerifyToken and hubChallenge': {
          hubMode: "subscribe",
          hubVerifyToken: undefined,
          hubChallenge: null,
        },
        'No hub vars at all': {},
      };

      for (let subject in events) {
        let event = events[subject];
        event.httpMethod = 'GET';

        handler(event, null, (error, response) => {
          expect(error).to.be.equal(
            "Invalid request. GET is used for subscribe only. "
            + "This request is missing one of required parameters "
            + "(hubMode, hubVerifyToken, hubChallenge)"
          );
        });
      }
      done();
    });

    it('Will crash if hubVerifyToken does not equal process.env.VERIFY_TOKEN', (done) => {
      let event = {
        httpMethod: 'GET',
        hubMode: "subscribe",
        hubVerifyToken: "secret token",
        hubChallenge: '123',
      };
      process.env.VERIFY_TOKEN = 'foo token';

      handler(event, null, (error, response) => {
        expect(error).to.equal('Invalid verify token');
        done();
      });
    });

  });

  describe('on invalid request', () => {
    it('Will crash', (done) => {
      let event = {};
      handler(event, null, (error, response) => {
        expect(error).to.equal('Invalid request');
        done();
      });
    });
  });
});
