import KeyManager from "../Keys/KeyManager";

export class Client {
  keyManager: KeyManager;

  

  constructor() {
    this.keyManager = new KeyManager();
  }

  get authenticated() {

  }


}

/*
{
  servers: [
    {
      id: string,
      name: string,
      description: string,
      shortId: string,
      avatar: string,
      members: memberships[],
      channels: [
        {
          id: string,
          serverId: string,
          name: string,
          type: string,
          shortId: string,
          requiredRoles: string[] list of ids from roles that belong to this server,
          messages: [
            {
              id: string,
              channelId: string,
              author: string, // user id
              content: string,
              created: Date,
              keyUsed: string base58 encoded;
              mentions: string[] list of user ids,;
              revision: string;
            }
          ]
        }
      ],
      created: Date
    }
  ],

  roles: [
    {
      id: string,
      name: string,
      permissions: number that uses bitwise operators to determine permissions,
      serverId: string,
      heirarchy: number
    }
  ],

  memberships: [
    {
      id: uniqueString,
      user: string, // user id
      serverId: thisId,
      roles: string[] list of ids from roles that belong to this server,
      nickname: string
    }
  ]

  users: [
    {
      id: string,
      username: string,
      avatar: string,
      memberships: memberships[] that reference this user,
      accountCode: string,
      bio: string,
      relationship: string
    }
  ]
}
*/