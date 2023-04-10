import Member, { MemberInterface } from "./Member";

export interface ServerMemberInterface extends MemberInterface {
  serverId: string;
  roles: string[];
}

export class ServerMember extends Member {
  serverId: string;
  roles: string[];

  constructor (data: ServerMemberInterface) {
    super(data)
    this.#validate(data)

    this.serverId = data.serverId
    this.roles = data.roles
  }

  #validate (membership: ServerMemberInterface) {
    const errors: string[] = [];

    // Validate serverId
    if (membership.serverId !== undefined && typeof membership.serverId !== "string") {
      errors.push("server must be a string");
    }

    // Validate roles
    if (!Array.isArray(membership.roles)) {
      errors.push("roles must be an array");
    }
    if (!membership.roles.every(role => typeof role === "string" && role.length > 0)) {
      errors.push("roles must be an array of strings");
    }
  
    if (errors.length > 0) {
      throw new Error(`Membership validation failed: ${errors.join(", ")}`);
    }
  }
}

export default ServerMember