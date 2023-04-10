import crypto from 'isomorphic-webcrypto'

import { hashBytes } from '../../../crypto/sha256';
import ecies from '../../../crypto/ecies';


/**
 * Class representing an AES Key.
 */
class AESKey {
  private key: CryptoKey;

  keyHash?: string;
  created: Date;
  exposed?: Date;

  /**
   * Creates an instance of the AESKey class.
   * @param {object} params - Object containing the key ID and CryptoKey.
   */
  constructor({ key, created, exposed }: { id?: string; key: CryptoKey; created?: Date; exposed?: Date }) {
    this.key = key;
    this.created = created || new Date();
    this.exposed = exposed;

    this.generateKeyHash()
  }

  /**
   * Encrypts the input data using the AES key.
   * @param {Uint8Array} data - The input data to be encrypted.
   * @returns {Promise<Uint8Array>} - The encrypted data.
   */
  async encrypt(data: Uint8Array): Promise<Uint8Array> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );

    // Concatenate IV and encrypted data
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encryptedData), iv.length);

    return result;
  }

  /**
   * Decrypts the input data using the AES key.
   * @param {Uint8Array} data - The input data to be decrypted.
   * @returns {Promise<Uint8Array>} - The decrypted data.
   */
  async decrypt(data: Uint8Array): Promise<Uint8Array> {
    // Separate IV and encrypted data
    const iv = data.slice(0, 12);
    const encryptedData = data.slice(12);

    return new Uint8Array(
      await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        this.key,
        encryptedData
      )
    );
  }

  /**
   * Imports the JsonWebKey format of the key.
   * @param {JsonWebKey} keyData - The key data in JsonWebKey format.
   * @returns {Promise<void>}
   */
  public static async import(keyData: JsonWebKey, data?: { created?: Date, exposed?: Date }): Promise<AESKey> {
    if (!keyData) throw new Error('No key provided');
    const key = await crypto.subtle.importKey(
      'jwk',
      keyData,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    return new AESKey({ key, ...data });
  }

  /**
   * Exports the key as a JsonWebKey.
   * @returns {Promise<JsonWebKey>} - The exported key in JsonWebKey format.
   */
  public async export(): Promise<JsonWebKey> {
    const exported = await crypto.subtle.exportKey('jwk', this.key);
    return exported;
  }

  // Todo: Make return for EncryptedAESKey
  /**
   * Encrypts the AES key using the public key of the recipient.
   * @param {Uint8Array} publicKey 
   * @returns {Promise<Uint8Array>}
   */
  public async encyrptWithPublicKey(publicKey: Uint8Array): Promise<Uint8Array> {
    const exported = await this.export()
    const exportedStr = JSON.stringify(exported)
    const encoder = new TextEncoder()
    const exportedBytes = encoder.encode(exportedStr)
    const encrypted = await ecies.encrypt(Buffer.from(publicKey.buffer), exportedBytes)
    return encrypted
  }

  /**
  * Generates a hash of the key for indexing purposes.
  * The hash is stored in the keyHash property.
  * @returns {Promise<string>} - The key hash.
  * @memberof AESKey
  */
  public async generateKeyHash(): Promise<string> {
    if (this.keyHash) return this.keyHash;
    const exported = await this.export();
    const exportedStr = JSON.stringify(exported);
    const encoder = new TextEncoder();
    const exportedBytes = encoder.encode(exportedStr);
    const hash = await hashBytes(exportedBytes);
    this.keyHash = new TextDecoder().decode(hash);
    return this.keyHash
  }
    
  /**
  * 
  * Creates a CryptoKey from the input bytes and salt.
  * @param {ArrayBuffer} bytes - The input bytes.
  * @param {Uint8Array} salt - The salt.
  * @returns {Promise<CryptoKey>} - The created CryptoKey.
  */
  public static async createFromBytes(bytes: ArrayBuffer, salt: Uint8Array): Promise<CryptoKey> {
    const pbkdf = await crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      pbkdf,
      {
        name: 'AES-GCM',
        length: 256,
      },
        true,
      ['encrypt', 'decrypt']
    );
    return key;
  }

  /**
  * Creates an AESKey instance from a string.
  * @param {string} str - The input string.
  * @returns {Promise<AESKey>} - The created AESKey instance.
  */
  public static async aesFromString(str: string): Promise<AESKey> {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    return await this.aesFromBytes(bytes);
  }

  /**
  * 
  * Creates an AESKey instance from a Uint8Array.
  * @param {Uint8Array} bytes - The input bytes.
  * @returns {Promise<AESKey>} - The created AESKey instance.
  */
  public static async aesFromBytes(bytes: Uint8Array): Promise<AESKey> {
    if (!(bytes instanceof Uint8Array)) throw new Error('aesFromBytes Input Error. The input must be in a Uint8Array format');
    const keyBytes = await hashBytes(bytes);
    const createdKey = await this.createFromBytes(bytes, keyBytes);

    const key = new AESKey({ key: createdKey, created: new Date() });

    return key;
  }
}

export default AESKey;
