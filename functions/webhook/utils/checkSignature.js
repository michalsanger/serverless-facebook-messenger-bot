'use strict';

import crypto from 'crypto';

export function checkSignature(signature, payload) {
  payload = payload.replace(/\//g, '\/').replace(/</g, '\\u003c').replace(/%/g, '\\u0025').replace(/@/g, '\\u0040');
  const signatureHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(payload).digest('hex');
  return signature.substr(5) === signatureHash;
};
