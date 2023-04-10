import { webcrypto } from 'node:crypto';
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import AESKey from '.';
import KeyManager from '../KeyManager'

/**
 * @jest-environment jsdom
 */
describe('AESKey', () => {
  let aesKey: AESKey;

  beforeAll(async () => {
    aesKey = await AESKey.aesFromString('testKey');
  });

  test('should create an instance of AESKey from a string', async () => {
    const key = await AESKey.aesFromString('testKey');
    expect(key).toBeInstanceOf(AESKey);
  });

  test('should create an instance of AESKey from bytes', async () => {
    const bytes = new TextEncoder().encode('testKey');
    const key = await AESKey.aesFromBytes(bytes);
    expect(key).toBeInstanceOf(AESKey);
  });

  test('should encrypt and decrypt data', async () => {
    const data = new TextEncoder().encode('Hello, World!');
    const encryptedData = await aesKey.encrypt(data);
    const decryptedData = await aesKey.decrypt(encryptedData);
    expect(decryptedData).toEqual(data);
  });

  test('should export and import the key', async () => {
    const exportedKey = await aesKey.export();
    const newKey = await AESKey.import(exportedKey);
    expect(await newKey.export()).toEqual(exportedKey);
  });

  test('should generate key hash', async () => {
    const keyHash = await aesKey.generateKeyHash();
    expect(keyHash).toBeTruthy();
    expect(typeof keyHash).toBe('string');
    const keyHash2 = await aesKey.generateKeyHash();
    expect(keyHash2).toBeTruthy();
    expect(typeof keyHash2).toBe('string');
  });

  test('should throw an error if no key is provided', async () => {
    // @ts-ignore
    await expect(AESKey.import('')).rejects.toThrowError('No key provided');
  })

  test('should throw an error if bytes is not a Uint8Array', async () => {
    // @ts-ignore
    await expect(AESKey.aesFromBytes('testKey')).rejects.toThrowError('aesFromBytes Input Error. The input must be in a Uint8Array format');
  })

  test('should encrypt the aes key with the recipients public key', async () => {
    const keyManager = new KeyManager()
    const keypair = await keyManager.generateKeyPair()
    const encryptedKey = await aesKey.encyrptWithPublicKey(keypair.publicKey)
    expect(encryptedKey).toBeTruthy()
  })
});
