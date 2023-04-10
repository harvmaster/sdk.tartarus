import {
  instantiateSecp256k1,
  generatePrivateKey,
  Secp256k1,
  base64ToBin,
  binToBase58,
  base58ToBin
} from '@bitauth/libauth'

import { etc } from '@noble/secp256k1'

import AESKey from "./AES"
import EncryptedPrivateKey from './Keypair/EncryptedPrivateKey'
import KeyPair, { keypairMeta } from "./Keypair/KeyPair"

import { hash } from '../../crypto/sha256'

export class KeyManager {
  AESKeys: AESKey[] = []
  keyPairs: KeyPair[] = []
  secpCurve?: Secp256k1 = undefined;
  
  #userSecret?: string

  constructor () {

  }

  async generateSecpCurve () {
    this.secpCurve = await instantiateSecp256k1()
    return this.secpCurve
  }

  async generateAESKey () {
    const aes = await AESKey.aesFromBytes(etc.randomBytes(32))
    this.AESKeys.push(aes)
    return aes
  }

  async generateKeyPair () {
    const curve = this.secpCurve ?? await this.generateSecpCurve()

    const privateKey = generatePrivateKey(() => etc.randomBytes(32))
    const keypair = new KeyPair(curve, privateKey)

    this.keyPairs.push(keypair)
    return keypair
  }

  async importAESKey () {

  }

  async importKeyPair (privateKey: Uint8Array, keyMeta?: keypairMeta) {
    const curve = this.secpCurve ?? await this.generateSecpCurve()

    const keypair = new KeyPair(curve, privateKey, keyMeta)
    this.keyPairs.push(keypair)
    return keypair
  }

  async importEncryptedAESKey () {
    
  }

  async importEncryptedPrivateKey (encryptedPrivateKey: EncryptedPrivateKey, secret?: string) {
    if (!this.#userSecret && !secret) throw new Error('a secret (password) is required to import a keypair. The secret should be a string equal to \'username+password\'')

    // Set the userSecret to a base58 encoded hash of the secret
    if (!this.#userSecret && secret) await this.setUserSecret(secret)
    if (!this.#userSecret) throw new Error('Failed to set userSecret')

    // Make sure the secret is correct
    const secretHash = binToBase58(base64ToBin(await hash(this.#userSecret)))
    if (secretHash !== encryptedPrivateKey.secretHash) throw new Error('Secret is incorrect')

    // Decrypt the private key
    const userSecretBin = base58ToBin(this.#userSecret)
    if (!(userSecretBin instanceof Uint8Array)) throw new Error('Failed to convert userSecret to binary. Make sure it is base58 Encoded')
    const aesKey = await AESKey.aesFromBytes(userSecretBin)
    
    const privateKeyBin = base58ToBin(encryptedPrivateKey.privateKey)
    if (!(privateKeyBin instanceof Uint8Array)) throw new Error('Failed to convert encrypted private key to binary. Make sure it is base58 Encoded')

    const decryptedPrivateKey = await aesKey.decrypt(privateKeyBin)

    // Create a new keypair
    const { created, exposed } = encryptedPrivateKey
    return this.importKeyPair(decryptedPrivateKey, { created, exposed })
  }

  async exportAESKey () {

  }

  async exportKeyPair (keyPair: KeyPair, secret?: string) {
    if (!this.#userSecret && !secret) throw new Error('a secret (password) is required to export a keypair. The secret should be a string equal to \'username+password\'')

    // Set the userSecret to a base58 encoded hash of the secret
    if (!this.#userSecret && secret) await this.setUserSecret(secret)
    if (!this.#userSecret) throw new Error('Failed to set userSecret')

    const exported = await keyPair.export(this.#userSecret)

    // Create a new EncryptedPrivateKey
    const { created, exposed } = keyPair
    return new EncryptedPrivateKey({ privateKey: exported.privateKey, secretHash: exported.secretHash, created, exposed })
  }

  async setUserSecret (secret: string) {
    if (typeof secret !== "string") throw new TypeError('secret should be a string')
    const userSecret = binToBase58(base64ToBin(await hash(secret)))
    if (typeof userSecret !== "string") throw new Error('Failed to set userSecret')
    this.#userSecret = userSecret
  }

}

export default KeyManager