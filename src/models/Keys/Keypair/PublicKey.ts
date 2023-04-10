import OmitMethods from '../../MethodOmitter'

export type publicKeyInterface = Omit<OmitMethods<PublicKey>, 'contructor'>

export class PublicKey {
  id: string
  key: string
  created: Date | number | string

  constructor (data: publicKeyInterface) {
    this.#validate(data)

    this.id = data.id
    this.key = data.key
    this.created = new Date(data.created)
  }

  #validate (key: publicKeyInterface): void {
    const errors: string[] = []

    // Validate `id` property (required)
    if (typeof key.id !== 'string') {
      errors.push('`id` must be a string')
    }

    // Validate `key` property (required)
    if (typeof key.key !== 'string') {
      errors.push('`key` must be a string')
    }

    // Validate `created` property (required)
    if (typeof key.created !== 'string' && typeof key.created !== 'number' && !(key.created instanceof Date)) {
      errors.push('`created` must be a string')
    }

    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }
  }

}

export default PublicKey