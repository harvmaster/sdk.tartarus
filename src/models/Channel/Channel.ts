import Message, { MessageInterface } from '../Message'
import MessageManager from '../MessageManager.ts'

export interface ChannelInterface {
  id: string,
  shortId: string,
  name: string,
  messages?: MessageInterface[],
  created: Date | string | number
}

export enum ChannelType {
  VOICE = 'VOICE',
  TEXT = 'TEXT'
}

export class Channel {
  id: string
  shortId: string
  name: string

  messages: MessageManager
  created: Date

  constructor (data: ChannelInterface) {
    this.#validate(data)

    this.id = data.id;
    this.name = data.name;
    this.shortId = data.shortId;

    this.messages = new MessageManager()
    if (data.messages != undefined && data.messages instanceof Array) data.messages.forEach(message => this.messages.addMessage(message))
    // if (data.messages != undefined) data.messages.forEach(message => this.importMessage(message))

    this.created = new Date(data.created);
  }

  #validate (channel: ChannelInterface): void {
    const errors: string[] = [];

    channel.created = new Date(channel.created)

    // Validate `id` property (optional)
    if (channel.id && typeof channel.id !== "string") {
      errors.push("`id` must be a string");
    }

    // Validate `shortId` property (optional)
    if (channel.shortId != undefined) {
      if (typeof channel.shortId !== "string") {
        errors.push("`shortId` must be a string");
      } else if (channel.shortId.trim() === "") {
        errors.push("`shortId` cannot be an empty string");
      }
    }

    // Validate `name` property (required)
    if (typeof channel.name !== "string") {
      errors.push("`name` must be a string");
    } else if (channel.name.trim() === "") {
      errors.push("`name` cannot be an empty string");
    }

    // Validate `messages` property (optional)
    if (channel.messages && !Array.isArray(channel.messages)) {
      errors.push("`messages` must be an array");
    }

    // Validate created
    if (!(channel.created instanceof Date) || isNaN(channel.created.getTime())) {
      errors.push("created must be a valid Date object");
    }

    if (errors.length > 0) {
      throw new Error(`Channel validation failed: ${errors.join(", ")}`);
    }
  }

  importMessage (msg: MessageInterface, options: { sort: boolean } = { sort: true }) {
    if (!this.id) throw new Error(`Channel "${this.name}" has not been initialised correctly and has no ID. This may be caused by a channel being created and the "save" method not being called before importing a message.`)
    msg.channelId = this.id
    const message = new Message(msg)
    // Not sure whether i should handle this gracefully or throw error if adding multiple of same message. Going to handle gracefully for now.
    // Replace the old message with the new one and assume its a revision. Should probably check if the revision id has been incremented.
    const exists = this.messages.find(message => message.id == msg.id)
    if (exists && parseInt(exists.revision) >= parseInt(msg.revision)) throw new Error('Message Id Collision. A message cannot replace a message with a higher revision count')
    this.messages = this.messages.filter(m => m.id != message.id)
    this.messages.push(message)

    if (options.sort) this.sortMessages()
  }

  // Move the default sort to an external module?
  sortMessages (fn: (a: Message, b: Message) => number = (a, b) => a.created.getTime() - b.created.getTime()) {
    this.messages = this.messages.sort(fn)
  }

  async save() {
    if (!this.id) {
      // Save with post request to create the channel
    }

    // Save with put request to update channel
  }
}

export default Channel