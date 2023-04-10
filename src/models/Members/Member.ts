export interface MemberInterface {
  id: string;
  user: string;
  nickname: string;
}

export class Member implements MemberInterface {
  id: string;
  user: string;
  nickname: string;

  constructor (data: MemberInterface) {
    this.#validate(data)

    this.id = data.id
    this.user = data.user
    this.nickname = data.nickname
  }
  
  #validate (membership: MemberInterface) {
    const errors: string[] = [];

    // Validate id (optional)
    if (membership.id !== undefined && typeof membership.id !== "string") {
      errors.push("id must be a string");
    }
    
    // Validate user
    if (typeof membership.user !== "string" || membership.user.trim() === "") {
      errors.push("user must be a non-empty string");
    }

    // Validate nickname
    if (typeof membership.nickname !== "string" || membership.nickname.trim() === "") {
      errors.push("nickname must be a non-empty string");
    }
  
    if (errors.length > 0) {
      throw new Error(`Membership validation failed: ${errors.join(", ")}`);
    }
  }
}

export default Member