import OmitMethods from "../../MethodOmitter"
type EncryptedPrivateKeyInterface = Omit<OmitMethods<EncryptedPrivateKey>, "constructor">

export class EncryptedPrivateKey {
  privateKey: string // base58 Encoded
  secretHash: string // base58 Encoded
  exposed?: Date | number
  created?: Date | number
  
  constructor ({ privateKey, secretHash, exposed, created }: EncryptedPrivateKeyInterface) {
    this.privateKey = privateKey
    this.secretHash = secretHash

    this.exposed = exposed
    this.created = created ?? new Date()
  }
} 

export default EncryptedPrivateKey