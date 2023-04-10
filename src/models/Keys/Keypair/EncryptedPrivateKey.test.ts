import { webcrypto } from 'node:crypto';
// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

import EncryptedPrivateKey from "./EncryptedPrivateKey";
import KeyManager from "../KeyManager";

describe("EncryptedPrivateKey", () => {
  let encryptedPrivateKey: EncryptedPrivateKey
  let keyManager: KeyManager

  beforeAll(async () => {
    keyManager = new KeyManager()
    keyManager.setUserSecret('testSecret')

    const keypair = await keyManager.generateKeyPair()

    encryptedPrivateKey = await keyManager.exportKeyPair(keypair)
  })

  test('should create an instance of EncryptedPrivateKey', async () => {
    expect(encryptedPrivateKey).toBeInstanceOf(EncryptedPrivateKey)
  })

  test('should have the privteKey property', async () => {
    expect(encryptedPrivateKey.privateKey).toBeTruthy()
  })

  test('should have the secretHash property', async () => {
    expect(encryptedPrivateKey.secretHash).toBeTruthy()
  })
})
