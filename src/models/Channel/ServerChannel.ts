import Message, { MessageInterface } from '../Message'
import Channel, { ChannelInterface } from './Channel'

export interface ServerChannelInterface extends ChannelInterface { 
  serverId: string,
  type: keyof typeof ChannelType,
  permittedRoles: string[],
}

export enum ChannelType {
  VOICE = 'VOICE',
  TEXT = 'TEXT'
}

export class ServerChannel extends Channel {
  serverId: string
  type: keyof typeof ChannelType
  permittedRoles: string[]

  constructor (data: ServerChannelInterface) {
    super(data)
    this.#validate(data)

    this.serverId = data.serverId
    this.type = data.type;
    this.permittedRoles = data.permittedRoles;

    this.created = new Date(data.created);
  }

  #validate (channel: ServerChannelInterface): void {
    const errors: string[] = [];

    // commented this out as it may not be needed.
    // Validate `server` property (optional)
    // if (channel.serverId && typeof channel.serverId !== "string") {
    //   errors.push("`serverId` must be a string");
    // }

    // Validate `type` property (required)
    if (!Object.keys(ChannelType).includes(channel.type)) {
      errors.push("`type` must be one of the following values: " + Object.values(ChannelType).join(", "));
    }

    // Validate `permittedRoles` property (required)
    if (!Array.isArray(channel.permittedRoles)) {
      errors.push("`permittedRoles` must be an array");
    }
    
    // if (typeof channel.permittedRoles !== "string") {
    //   errors.push("`permittedRoles` must be a string");
    // } else if (channel.permittedRoles.trim() === "") {
    //   errors.push("`permittedRoles` cannot be an empty string");
    // }

    if (errors.length > 0) {
      throw new Error(`Server Channel validation failed: ${errors.join(", ")}`);
    }
  }

  async save() {
    if (!this.id) {
      // Save with post request to create the channel
    }

    // Save with put request to update channel
  }
}

export default ServerChannel