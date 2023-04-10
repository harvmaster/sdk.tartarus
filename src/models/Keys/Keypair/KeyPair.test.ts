import { webcrypto } from 'node:crypto';
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import { KeyPair } from './KeyPair';
import { instantiateSecp256k1, generatePrivateKey, base64ToBin, binToBase58 } from '@bitauth/libauth';
import { etc } from '@noble/secp256k1'
import ecies from '../../../crypto/ecies'

async function generateRandomKeyPair() {
  const secp = await instantiateSecp256k1();
  const privateKey = generatePrivateKey(() => etc.randomBytes(32))

  return new KeyPair(secp, privateKey);
}

// Helper function to generate random strings.
function generateRandomString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return binToBase58(base64ToBin(result));
}

describe('KeyPair', () => {
  test('should generate a valid key pair', async () => {
    const keyPair = await generateRandomKeyPair();
    expect(keyPair).toBeInstanceOf(KeyPair);
    expect(keyPair.publicKey).toBeDefined();
  });

  test('should decrypt encrypted data', async () => {
    const keyPair = await generateRandomKeyPair();
    const data = new TextEncoder().encode('Hello, world!');
    const encryptedData = ecies.encrypt(Buffer.from(keyPair.publicKey.buffer), data);
    if (!encryptedData) throw new Error('Failed to encrypt data');

    const decryptedData = await keyPair.decrypt(new Uint8Array(encryptedData));
    expect(decryptedData).toEqual(data);
  });

  test('should generate a valid WIF', async () => {
    const keyPair = await generateRandomKeyPair();
    const wif = await keyPair.getWif();
    expect(wif).toBeDefined();
    expect(wif.length).toBeGreaterThan(0);
  });

  test('should export key pair', async () => {
    const keyPair = await generateRandomKeyPair();
    const secret = generateRandomString(32);
    const exportedKeyPair = await keyPair.export(secret);

    expect(exportedKeyPair).toBeDefined();
    expect(exportedKeyPair.privateKey).toBeDefined();
    expect(exportedKeyPair.publicKey).toBeDefined();
    expect(exportedKeyPair.wif).toBeDefined();
    expect(exportedKeyPair.secretHash).toBeDefined();
  });

  test('Should throw error if no secret is provided', async () => {
    const keyPair = await generateRandomKeyPair();
    await expect(keyPair.export('')).rejects.toThrowError('a secret (password) is required to export keypair. The secret should be a string equal to \'username+password\'');
  });

  test('Should throw error if secret is not a string', async () => {
    const keyPair = await generateRandomKeyPair();
    // @ts-ignore
    await expect(keyPair.export(123)).rejects.toThrowError('secret should be a string');
  });

  test('Should throw an error if the secret is not a base58', async () => {
    const keyPair = await generateRandomKeyPair();
    const secret = generateRandomString(32).slice(0, 30) + 'p';
    const base64EncodedSecret = Buffer.from(secret).toString('base64');
    await expect(keyPair.export(base64EncodedSecret)).rejects.toThrowError('secret should be a base58 string');
  })

  test('should create keypair with created from Date', async () => {
    const secp = await instantiateSecp256k1();
    const privateKey = generatePrivateKey(() => etc.randomBytes(32))
    const metadata = {
      created: new Date(),
    }
    const newKey = new KeyPair(secp, privateKey, metadata);
    expect(newKey.created).toBeInstanceOf(Date);
  })

  test('should create keypair with created from number', async () => {
    const secp = await instantiateSecp256k1();
    const privateKey = generatePrivateKey(() => etc.randomBytes(32))
    const metadata = {
      created: Date.now(),
    }
    const newKey = new KeyPair(secp, privateKey, metadata);
    expect(newKey.created).toBeInstanceOf(Date);
  })

  test('should create keypair with exposed from Date', async () => {
    const secp = await instantiateSecp256k1();
    const privateKey = generatePrivateKey(() => etc.randomBytes(32))
    const metadata = {
      exposed: new Date(),
    }
    const newKey = new KeyPair(secp, privateKey, metadata);
    expect(newKey.exposed).toBeInstanceOf(Date);
  })

  test('should create keypair with created from number', async () => {
    const secp = await instantiateSecp256k1();
    const privateKey = generatePrivateKey(() => etc.randomBytes(32))
    const metadata = {
      exposed: Date.now(),
    }
    const newKey = new KeyPair(secp, privateKey, metadata);
    expect(newKey.exposed).toBeInstanceOf(Date);
  })
});
