import { Member, MemberInterface } from "./Member";

export interface PrivateMemberInterface extends MemberInterface {
  privateChannelId: string;
}

export class PrivateMember extends Member {
  privateChannelId: string;

  constructor (data: PrivateMemberInterface) {
    super(data)
    this.#validate(data)

    this.privateChannelId = data.privateChannelId
  }

  #validate (membership: PrivateMemberInterface) {
    const errors: string[] = [];

    // Validate privateChannelId
    if (membership.privateChannelId !== undefined && typeof membership.privateChannelId !== "string") {
      errors.push("Channel must be a string");
    }
  
    if (errors.length > 0) {
      throw new Error(`PrivateMember validation failed: ${errors.join(", ")}`);
    }
  }
}

export default PrivateMember