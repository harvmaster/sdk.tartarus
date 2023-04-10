import ServerMember from "./ServerMember";

describe("ServerMember", () => {
  let serverMember: ServerMember;

  beforeEach(() => {
    serverMember = new ServerMember({
      id: "123",
      user: "123",
      nickname: "test",
      roles: ["123"],
      serverId: "123",
    });
  })

  test('should create an instance of ServerMember', () => {
    expect(serverMember).toBeInstanceOf(ServerMember)
  })

  test('should have a roles property', () => {
    expect(serverMember.roles).toBeTruthy()
    expect(Array.isArray(serverMember.roles)).toBe(true)
  })

  test('should have a serverId property', () => {
    expect(serverMember.serverId).toBeTruthy()
  })

  test('should throw an error if the serverId is not a string', () => {
    // @ts-ignore
    serverMember.serverId = 123
    expect(() => new ServerMember(serverMember)).toThrowError()
  })

  test('should throw an error if the roles is not an array', () => {
    // @ts-ignore
    serverMember.roles = '123'
    expect(() => new ServerMember(serverMember)).toThrowError()
  })

  test('should throw an error if the roles is not an array of strings', () => {
    // @ts-ignore
    serverMember.roles = ['123', 123]
    expect(() => new ServerMember(serverMember)).toThrowError()
  })

  test('should throw an error if the roles is an array of empty strings', () => {
    serverMember.roles = ['', '']
    expect(() => new ServerMember(serverMember)).toThrowError()
  })
})