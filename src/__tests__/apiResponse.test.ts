import { ChannelType } from '../models/Channel/Channel'
import Server from '../models/Server/Server'

const data = {
  "servers": [
    {
      "id": "srv1",
      "name": "Gaming Hub",
      "description": "A server for gamers to hang out and discuss their favorite games.",
      "shortId": "GmHb",
      "avatar": "https://example.com/avatar1.png",
      "created": "2023-03-01T12:00:00.000Z",
      "members": [
        {
          "id": "mbr1",
          "serverId": "srv1",
          "user": "usr1",
          "roles": [
            "rol1"
          ],
          "nickname": "GameMaster"
        },
        {
          "id": "mbr2",
          "serverId": "srv1",
          "user": "usr2",
          "roles": [],
          "nickname": "NewPlayer"
        }
      ],
      "roles": [
        {
          "id": "rol1",
          "name": "Admin",
          "permissions": 15,
          "heirarchy": 1
        }
      ],
      "channels": [
        {
          "id": "chn1",
          "serverId": "srv1",
          "name": "general",
          "type": "TEXT" as ChannelType.TEXT,
          "shortId": "gnrl",
          "messages": [
            {
              "id": "msg1",
              "channelId": "chn1",
              "author": "usr1",
              "content": new TextEncoder().encode("Hey everyone!").buffer,
              "created": "2023-03-30T10:00:00.000Z",
              "keyUsed": "4Gv4fs8Hn5",
              "mentions": [],
              "revision": "0"
            }
          ],
          permittedRoles: ['rol1'],
          created: "2023-03-30T10:00:00.000Z"
        }
      ]
    }
  ],
  "users": [
    {
      "id": "usr1",
      "username": "Alice",
      "avatar": "https://example.com/avatar2.png",
      "memberships": [
        "mbr1"
      ],
      "accountCode": "AC123",
      "bio": "Gamer and game developer.",
      "relationship": "friend"
    },
    {
      "id": "usr2",
      "username": "Bob",
      "avatar": "https://example.com/avatar3.png",
      "memberships": [
        "mbr2"
      ],
      "accountCode": "AC456",
      "bio": "New to gaming.",
      "relationship": "none"
    }
  ]
}



describe('Server', () => {
  it('should create a server', () => {
    const server = new Server(data.servers[0])
    expect(server.id).toBe(data.servers[0].id)
    expect(server.name).toBe(data.servers[0].name)
    expect(server.description).toBe(data.servers[0].description)
    expect(server.shortId).toBe(data.servers[0].shortId)
    expect(server.avatar).toBe(data.servers[0].avatar)
    expect(server.members).toEqual(data.servers[0].members)
    expect(server.channels).toEqual(data.servers[0].channels)
    expect(server.created).toEqual(data.servers[0].created)
  })
})
