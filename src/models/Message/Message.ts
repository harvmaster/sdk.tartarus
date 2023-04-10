export interface MessageInterface {
  id: string,
  channelId: string,
  author: string,
  content: ArrayBuffer,
  keyUsed: string,
  mentions: string[],
  revision: string,
  created: Date | string | number
}

export class Message {
  id!: string;
  channelId!: string;
  author!: string;
  content!: ArrayBuffer;
  keyUsed!: string;
  mentions!: string[];
  revision!: string;
  created: Date;

  constructor (data: MessageInterface) {
    this.#validate(data)

    Object.assign(this, data)
    this.created = new Date(data.created);
  }

  #validate (msg: MessageInterface) {
    const errors = [];

    msg.created = new Date(msg.created)

    if (msg.id && typeof msg.id !== "string") {
      errors.push("Message.id must be a string");
    }

    if (typeof msg.channelId !== "string") {
      errors.push("Message.channelId must be a string");
    }

    if (typeof msg.author !== "string") {
      errors.push("Message.sender must be a string");
    }

    if (!(msg.content instanceof ArrayBuffer)) {
      errors.push("Message.content must be an ArrayBuffer");
    }

    if (typeof msg.keyUsed !== "string") {
      errors.push("Message.keyUsed must be a string");
    }

    if (!Array.isArray(msg.mentions)) {
      errors.push("Message.mentions must be an array");
    }

    if (typeof msg.revision !== "string") {
      errors.push("Message.revision must be a string");
    }

    if (!(msg.created instanceof Date) || isNaN(msg.created.getTime())) {
      errors.push("Message.created must be a valid Date");
    }

    if (errors.length > 0) {
      throw new Error(`Message validation failed: ${errors.join(", ")}`);
    }
  }
}

export default Message