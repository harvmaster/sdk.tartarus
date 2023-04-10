import { PrivateMember } from '../Members'
import Channel from './Channel'

export interface PrivateChannelInterface {
  id: string,
  shortId: string,
  name: string,
  participants: PrivateMember[],
  created: Date | string | number
}

export class PrivateChannel extends Channel {

  participants: PrivateMember[]

  constructor (data: PrivateChannelInterface) {
    super(data)
    this.#validate(data)

    this.participants = []
    if (data.participants) data.participants.forEach(participant => this.importParticipant(participant))

    this.created = new Date(data.created);
  }

  #validate (channel: PrivateChannelInterface): void {
    const errors: string[] = [];

    // Validate participants is a valid array
    if (channel.participants && !Array.isArray(channel.participants)) {
      errors.push("`participantts` must be an array");
    }

    if (errors.length > 0) {
      throw new Error(`PrivateChannel validation failed: ${errors.join(", ")}`);
    }
  }

  importParticipant (participant: PrivateMember) {
    if (!this.id) throw new Error(`PrivateChannel "${this.name}" has not been initialised correctly and has no ID.`)
    participant.privateChannelId = this.id
    const p = new PrivateMember(participant)
    this.participants = this.participants.filter(m => m.id != p.id)
    this.participants.push(participant)
  }

  async save() {
    if (!this.id) {
      // Save with post request to create the channel
    }

    // Save with put request to update channel
  }
}

export default PrivateChannel