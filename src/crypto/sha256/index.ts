import { binToBase64 } from '@bitauth/libauth'
import crypto from 'isomorphic-webcrypto'

export const hash = async (str: string) => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)

  let hashed = await hashBytes(bytes)

  return binToBase64(hashed)
}

export const hashBytes = async (bytes: Uint8Array) => {
  const buffer = bytes.buffer
  const hashed = await crypto.subtle.digest('SHA-256', buffer)
  const output = new Uint8Array(hashed)
  return output
}

export default { hash, hashBytes }
