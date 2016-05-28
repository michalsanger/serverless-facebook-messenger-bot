'use strict';

import crypto from 'crypto';
import jsesc from 'jsesc';

export function checkSignature(signature, payload) {
  payload = jsesc(payload, {
    escapeEverything: false,
    lowercaseHex: true,
    json: true,
  });
  const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(payload).digest('hex');
  return signature.substr(5) === signatureHash;
};