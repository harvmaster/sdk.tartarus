// User
// Auth
// Keypair
// Memberships
// Servers
// Roles
// Channels
// Messages
// Keys

export interface User {
  id: string
  username: string
  accountCode: string
  bio: string
  avatar: string // URL

  publicKeys: PublicKey[]
  memberships: Membership[]
  relationship: string  // friends | blocked | none | Self

  created: Date
}

export enum Relationship {
  FRIEND = 'FRIEND',
  BLOCKED = 'BLOCKED',
  NONE = 'NONE',
  SELF = 'SELF'
}

export interface AuthenticatedUser extends User {
  keypairs: KeyPair[]
}

export interface PublicKey {
  id: string,
  key: string,
  created: Date
}

export interface KeyPair {
  id: string
  publicKey: string
  privateKey: string
  secretHash: string
  created: Date
  exposed: Date
}

export interface Membership {
  id: string
  user: string
  server: string // Server ID
  nickname: string
  roles: Role[]
}

export interface Role {
  id: string
  server: string // Id of the server
  name: string
  hierarchy: number
  permissions: Number
}

export interface Server {
  id: string
  name: string
  description: string
  shortId: string
  avatar: string // URL

  created: Date
}

export interface Channel {
  id: string,
  server: string,
  name: string,
  shortId: string,
  type: ChannelType        // Text | Voice
  permittedRoles: string[]  // Ids of Roles that are permitted to use this channel
  created: Date
}

export enum ChannelType {
  VOICE = 'VOICE',
  TEXT = 'TEXT'
}

export interface Message {
  id: string,
  channel: string;
  sender: string // ID of a user
  content: ArrayBuffer // Message will be sent as a Base64 encoded string that needs to be converted back to an array buffer, decrypted, and then converted back to UTF-8,
  keyUsed: string // A hash of the key that was used to encrypt this message so recipients can track down the key by comparing the hashes,
  mentions:  string[] //[ id:user ] an array of strings with the user's public key or ID, not sure yet,
  revision: string, // Allows for edited messages
  created: Date,
}

export interface Key { // Different from the keypairs as these are AES256 keys that are used to encrypt the messages quicker than an asymmetrical key would.
  id: string,
  publicKey:  string //publicKey:keyPairs:authed
  key: string, // Base64 encoded string that needs to be converted back to an array buffer, decrypted, and then converted back to Base58
  keyHash: string,
  created: Date,
  exposed: Date
}

// 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

// {
//   server: {
//     id: string
//     name: string
//     description: string
//     shortId: string
//     avatar: string,
//     channels: [{
//       id: string,
//       name: string,
//       shortId: string,
//       type: string        // Text | Voice
//       messages: [{
//         id: string,
//         sender: string // ID of a user
//         content: ArrayBuffer // Message will be sent as a Base64 encoded string that needs to be converted back to an array buffer, decrypted, and then converted back to UTF-8,
//         keyUsed: string // A hash of the key that was used to encrypt this message so recipients can track down the key by comparing the hashes,
//         revision: string, // Allows for edited messages
//       }]: Message[]
//     }]: Channel[]
//   }
// }
