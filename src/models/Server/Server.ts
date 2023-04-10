import { ServerChannel } from '../Channel'
import { ServerChannelInterface } from '../Channel/ServerChannel';
import { ServerMember} from '../Members'
import { ServerMemberInterface } from '../Members/ServerMember';

export interface ServerInterface {
  id: string,
  name: string,
  description: string,
  shortId: string,
  avatar: string,
  members: ServerMemberInterface[],
  channels: ServerChannelInterface[],
  created: Date | string | number
}

export class Server implements ServerInterface {
  id: string;
  name: string;
  description: string;
  shortId: string;
  avatar: string;
  members: ServerMember[];
  channels: ServerChannel[]
  created: Date;

  constructor (data: ServerInterface) {
    this.#validate(data)
    
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.shortId = data.shortId;
    this.avatar = data.avatar;

    this.members = [];
    data.members.forEach((membership: ServerMemberInterface) => this.importMember(membership))
    this.channels = [];
    data.channels.forEach(channel => this.importChannel(channel))
    
    this.created = new Date(data.created);
  }

  #validate (server: ServerInterface): void {
    const errors: string[] = [];

    server.created = new Date(server.created)

    // Validate id (optional)
    if (typeof server.id !== "string" || server.id.trim() === "") {
      errors.push("id must be a string");
    }
  
    // Validate name
    if (typeof server.name !== "string" || server.name.trim() === "") {
      errors.push("name must be a non-empty string");
    }
  
    // Validate description
    if (typeof server.description !== "string" || server.description.trim() === "") {
      errors.push("description must be a non-empty string");
    }
  
    // Validate shortId
    if (typeof server.shortId !== "string" || server.shortId.trim() === "") {
      errors.push("shortId must be a string");
    }
  
    // Validate avatar
    if (typeof server.avatar !== "string" || server.avatar.trim() === "") {
      errors.push("avatar must be a non-empty string");
    }
  
    // Validate members
    if (!Array.isArray(server.members)) {
      errors.push("members must be an array");
    }
  
    // Validate channels
    if (!Array.isArray(server.channels)) {
      errors.push("channels must be an array");
    } 
  
    // Validate created
    if (!(server.created instanceof Date) || isNaN(server.created.getTime())) {
      errors.push("created must be a valid Date object");
    }
  
    if (errors.length > 0) {
      throw new Error(`Server validation failed: ${errors.join(", ")}`);
    }
  }

  importMember (membership: ServerMemberInterface) {
    membership.serverId = this.id
    const member = new ServerMember(membership)
    this.members = this.members.filter(m => m.id != membership.id)
    this.members.push(member)
  }

  importChannel (channel: ServerChannelInterface) {
    channel.serverId = this.id
    const newChannel = new ServerChannel(channel)
    this.channels = this.channels.filter(c => c.id != channel.id)
    this.channels.push(newChannel)
  }

  // async createChannel (channel: Partial<ServerChannelInterface>) {
  //   if (channel.id) throw new Error ('Failed to create new channel. This channel already exists. If you want to make changes to this channel, use the save function on the Channel Class')
  //   channel.serverId = this.id
  //   const newChannel = new ServerChannel(channel)
  //   await newChannel.save()
  //   this.channels.push(newChannel)
  // }
}

export default Server