// @ts-nocheck
import { ChannelType } from '../Channel'
import Server, { ServerInterface } from './Server'


describe('Server Class', () => {
  let serverData: ServerInterface

  beforeEach(() => {
    serverData = {
      id: '123',
      name: 'test server',
      description: 'test description',
      shortId: 'abc',
      avatar: 'test avatar',
      members: [],
      channels: [],
      created: new Date()
    }
  })

  test('should create an instance of Server', () => {
    const server = new Server(serverData)
    expect(server.id).toBe('123')
    expect(server.name).toBe('test server')
    expect(server.description).toBe('test description')
    expect(server.shortId).toBe('abc')
    expect(server.avatar).toBe('test avatar')
    expect(server.members).toEqual([])
    expect(server.channels).toEqual([])
    expect(server.created).toEqual(serverData.created)
  })

  test('should throw an error if the id is not a string', () => {
    // @ts-ignore
    serverData.id = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the id is an empty string', () => {
    serverData.id = ''
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the name is not a string', () => {
    // @ts-ignore
    serverData.name = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the name is an empty string', () => {
    serverData.name = ''
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the description is not a string', () => {
    // @ts-ignore
    serverData.description = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the description is an empty string', () => {
    serverData.description = ''
    expect(() => new Server(serverData)).toThrowError()
  })


  test('should throw an error if the shortId is not a string', () => {
    // @ts-ignore
    serverData.shortId = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the shortId is an empty string', () => {
    serverData.shortId = ''
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the avatar is not a string', () => {
    // @ts-ignore
    serverData.avatar = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the avatar is an empty string', () => {
    serverData.avatar = ''
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the members is not an array', () => {
    // @ts-ignore
    serverData.members = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the channels is not an array', () => {
    // @ts-ignore
    serverData.channels = 123
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should throw an error if the created is not a valid date', () => {
    // @ts-ignore
    serverData.created = '123abc'
    expect(() => new Server(serverData)).toThrowError()
  })

  test('should add a channel to the server', () => {
    const server = new Server(serverData)
    server.importChannel({
      id: '123',
      name: 'test channel',
      shortId: 'abc',
      type: ChannelType.TEXT,
      permittedRoles: [],
      messages: [],
      created: new Date()
    })
    expect(server.channels.length).toBe(1)
  })

  test('should add a member to the server', () => {
    const server = new Server(serverData)
    server.importMember({
      id: '123',
      user: 'test user',
      nickname: 'test nickname',
      roles: [],
      created: new Date()
    })
    expect(server.members.length).toBe(1)
  })

  test('should create an instance with members and channels', () => {
    serverData.members = [{
      id: '123',
      user: 'test user',
      nickname: 'test nickname',
      roles: [],
      created: new Date()
    }]
    serverData.channels = [{
      id: '123',
      name: 'test channel',
      shortId: 'abc',
      type: ChannelType.TEXT,
      permittedRoles: [],
      messages: [],
      created: new Date()
    }]
    const server = new Server(serverData)
    expect(server.members.length).toBe(1)
    expect(server.channels.length).toBe(1)
  })

  test('should filter similar channels', () => {
    serverData.channels = [{
      id: '123',
      name: 'test channel', 
      shortId: 'abc',
      type: ChannelType.TEXT,
      permittedRoles: [],
      messages: [],
      created: new Date()
    }]
    const server = new Server(serverData)
    const channel = server.importChannel({
      id: '123',
      name: 'test channel',
      shortId: 'abc',
      type: ChannelType.TEXT,
      permittedRoles: [],
      messages: [],
      created: new Date()
    })
    expect(server.channels.length).toBe(1)
  })






  // test('should create a channel', () => {
  //   const server = new Server(serverData)
  //   const channel = server.createChannel({
  //     id: '123',
  //     name: 'test channel',
  //     shortId: 'abc',
  //     messages: [],
  //     created: new Date()
  //   })
  //   expect(channel).toBeTruthy()
  //   expect(server.channels.length).toBe(1)
  // })


})

