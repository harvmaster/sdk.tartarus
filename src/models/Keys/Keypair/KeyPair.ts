import {
  base58ToBin,
  base64ToBin,
  binToBase58,
  encodePrivateKeyWif, instantiateSha256, Secp256k1
} from '@bitauth/libauth'

import { hash } from '../../../crypto/sha256';
import AES from '../AES';
import ecies from '../../../crypto/ecies';

import OmitMethods from '../../MethodOmitter';

export interface keypairMeta {
  id?: string;
  created?: Date | number
  exposed?: Date | number
}

export class KeyPair {
  #privateKey: Uint8Array;
  publicKey: Uint8Array

  id? :string
  created?: Date
  exposed?: Date

  #secp

  constructor (secp: Secp256k1, privateKey: Uint8Array, keyMeta?: keypairMeta) {
    this.#secp = secp
    this.#privateKey = privateKey
    this.publicKey = this.#secp.derivePublicKeyCompressed(this.#privateKey)

    this.id = keyMeta?.id

    // Add keyMeta information
    if ( keyMeta?.created instanceof Date ) this.created = keyMeta?.created
    if ( typeof keyMeta?.created === 'number') this.created = new Date(keyMeta?.created)

    if ( keyMeta?.exposed instanceof Date ) this.exposed = keyMeta?.exposed
    if ( typeof keyMeta?.exposed === 'number') this.exposed = new Date(keyMeta?.exposed)
  }

  async decrypt (data: Uint8Array) {
    const decrypted = ecies.decrypt(Buffer.from(this.#privateKey.buffer), data)
    return new Uint8Array(decrypted)
  }

  async getWif () {
    const sha256 = await instantiateSha256()
    const wif = encodePrivateKeyWif(sha256, this.#privateKey, 'mainnet')

    return wif
  }

  async export (secret: string) {
    if (!secret) throw new Error('a secret (password) is required to export keypair. The secret should be a string equal to \'username+password\'')
    if (typeof secret !== "string") throw new TypeError('secret should be a string')

    const wif = await this.getWif()

    const encodedSecret = base58ToBin(secret)
    if (!(encodedSecret instanceof Uint8Array)) throw new Error('secret should be a base58 string')

    const privateKey = await this.#encryptPrivateKey(encodedSecret)
    const publicKey = binToBase58(this.publicKey)
    const secretHash = binToBase58(base64ToBin(await hash(secret)))

    return {
      id: this.id,
      privateKey,
      publicKey,
      wif,
      secretHash
    }
  }

  async #encryptPrivateKey (secret: Uint8Array) {
    const aesKey = await AES.aesFromBytes(secret)
    const encrypted = await aesKey.encrypt(this.#privateKey)

    const encodedKey = binToBase58(new Uint8Array(encrypted))
    return encodedKey
  }
  
}

export default KeyPair