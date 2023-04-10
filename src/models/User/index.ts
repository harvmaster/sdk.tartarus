

export interface UserInterface { 
  id: string;
  username: string;
  accountCode: string;
  bio: string;
  avatar: string;
  // publicKeys: PublicKey[];
  // memberships: Membership[];
  relationship: string;
  created: Date;
}

class User {
  id: string;
  username: string;
  accountCode: string;
  bio: string;
  avatar: string;
  // publicKeys: PublicKey[];
  // memberships: Membership[];
  relationship: string;
  created: Date;

  constructor(data: User) {
    this.validate(data);

    this.id = data.id;
    this.username = data.username;
    this.accountCode = data.accountCode;
    this.bio = data.bio;
    this.avatar = data.avatar;
    // this.publicKeys = data.publicKeys?.map((pk) => new PublicKey(pk));
    // this.memberships = data.memberships?.map((m) => new Membership(m));
    this.relationship = data.relationship;
    this.created = new Date(data.created);

  }

  validate(data: User = this) {
    data.created = new Date(data.created)
    if (typeof data.id !== "string") {
      throw new Error("User.id must be a string");
    }
    if (typeof data.username !== "string") {
      throw new Error("User.username must be a non-empty string");
    }
    if (typeof data.accountCode !== "string") {
      throw new Error("User.accountCode must be a non-empty string");
    }
    if (typeof data.bio !== "string") {
      throw new Error("User.bio must be a non-empty string");
    }
    if (typeof data.avatar !== "string") {
      throw new Error("User.avatar must be a non-empty string");
    }
    // if (!Array.isArray(data.publicKeys)) {
    //   throw new Error("User.publicKeys must be an array");
    // }
    // if (!Array.isArray(data.memberships)) {
    //   throw new Error("User.memberships must be an array");
    // }
    if (typeof data.relationship !== "string") {
      throw new Error("User.relationship must be a non-empty string");
    }
    if (!(data.created instanceof Date) || isNaN(data.created.getTime())) {
      throw new Error("User.created must be a valid Date");
    }
  }
}

export default User