let ecies;

if (typeof window !== 'undefined') {
  ecies = require('ecies-wasm');
} else {
  ecies = require('eciesjs');
}

export default ecies as {
    encrypt: (publicKey: Uint8Array, data: Uint8Array) => Uint8Array;
    decrypt: (privateKey: Uint8Array, data: Uint8Array) => Uint8Array;
  };
