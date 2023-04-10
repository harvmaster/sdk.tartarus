
import { webcrypto } from 'node:crypto';
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import { generatePrivateKey } from '@bitauth/libauth';
import { etc } from '@noble/secp256k1';

import KeyManager from "./KeyManager";
import KeyPair from './Keypair/KeyPair';

async function generateRandomPrivateKey() {
  const privateKey = generatePrivateKey(() => etc.randomBytes(32))
  return privateKey
}

describe("KeyManager", () => {
  let keyManager: KeyManager;

  beforeEach(() => {
    keyManager = new KeyManager();
  });

  test("should create an instance of KeyManager", () => {
    expect(keyManager).toBeInstanceOf(KeyManager);
  });

  test("should have an AESKeys property", () => {
    expect(keyManager.AESKeys).toBeTruthy();
    expect(Array.isArray(keyManager.AESKeys)).toBe(true);
  });

  test("should have a keyPairs property", () => {
    expect(keyManager.keyPairs).toBeTruthy();
    expect(Array.isArray(keyManager.keyPairs)).toBe(true);
  });

  test("should have a secpCurve property", () => {
    expect(keyManager.secpCurve).toBeUndefined();
  });

  test("should generate a secp256k1 curve", async () => {
    const curve = await keyManager.generateSecpCurve();
    expect(curve).toBeTruthy();
  });

  test("should generate an AESKey", async () => {
    const aesKey = await keyManager.generateAESKey();
    expect(aesKey).toBeTruthy();
  });

  test("should generate a KeyPair", async () => {
    const keyPair = await keyManager.generateKeyPair();
    expect(keyPair).toBeTruthy();
  });

  test('should export a keypair', async () => {
    await keyManager.setUserSecret('testSecret')
    const keyPair = await keyManager.generateKeyPair()
    const encryptedPrivateKey = await keyManager.exportKeyPair(keyPair)
    expect(encryptedPrivateKey).toBeTruthy()
  })

  test('should import an encrypedPrivateKey', async () => {
    await keyManager.setUserSecret('testSecret')
    const keyPair = await keyManager.generateKeyPair()
    const encryptedPrivateKey = await keyManager.exportKeyPair(keyPair)
    const importedKeyPair = await keyManager.importEncryptedPrivateKey(encryptedPrivateKey)
    expect(importedKeyPair).toBeTruthy()
  })

  test('should throw an error if no secret is provided', async () => {
    const keyPair = await keyManager.generateKeyPair()
    await expect(keyManager.exportKeyPair(keyPair)).rejects.toThrow()
  })

  test('should throw an error if the secret hash is not a match', async () => {
    await keyManager.setUserSecret('testSecret')
    const keyPair = await keyManager.generateKeyPair()
    const encryptedPrivateKey = await keyManager.exportKeyPair(keyPair)
    await keyManager.setUserSecret('testSecret2')
    await expect(keyManager.importEncryptedPrivateKey(encryptedPrivateKey)).rejects.toThrow()
  })

  test('should import a privateKey', async () => {
    const privateKey = await generateRandomPrivateKey()
    const keyPair = await keyManager.importKeyPair(privateKey)

    expect(keyPair).toBeTruthy()
  })

  test('should throw an error if userSecret is not set when exporting', async () => {
    const kepPair = await keyManager.generateKeyPair()
    await expect(keyManager.exportKeyPair(kepPair)).rejects.toThrow()
  })

  test('should throw an error if userSecret is not set when exporting a keypair but an invalid secret is provided as an input', async () => {
    const keyPair = await keyManager.generateKeyPair()
    // @ts-ignore
    await expect(keyManager.exportKeyPair(keyPair, 123)).rejects.toThrow()
  })


  test('should throw an error if userSecret is not set when importing an encrypted key', async () => {
    await keyManager.setUserSecret('testSecret')
    const keyPair = await keyManager.generateKeyPair()
    const encryptedPrivateKey = await keyManager.exportKeyPair(keyPair)

    const keyManager2 = new KeyManager()
    await expect(keyManager2.importEncryptedPrivateKey(encryptedPrivateKey)).rejects.toThrow()
  })

  test('should throw an error if userSecret is not set when importing an encrypted key but a new secret, which is not a string, is provided', async () => {
    await keyManager.setUserSecret('testSecret')
    const keyPair = await keyManager.generateKeyPair()
    const encryptedPrivateKey = await keyManager.exportKeyPair(keyPair)

    const keyManager2 = new KeyManager()
    // @ts-ignore
    await expect(keyManager2.importEncryptedPrivateKey(encryptedPrivateKey, 123)).rejects.toThrow()
  })


  test('should set the userSecret without throwing an error', async () => {
    await expect(keyManager.setUserSecret('testSecret')).resolves.toBeUndefined()
  })

  test('should throw an error if the userSecret is not a string', async () => {
    // @ts-ignore
    await expect(keyManager.setUserSecret(123)).rejects.toThrow()
  })

})