import Channel, { ChannelInterface } from './Channel'

describe('Channel', () => {
  let channelData: ChannelInterface
  let channel: Channel

  beforeEach(() => {
    channelData = {
      id: '123',
      name: 'test',
      shortId: 'test',
      messages: [],
      created: new Date(),
    }
    channel = new Channel(channelData)
  })

  test('should create an instance of Channel', () => {
    expect(channel).toBeInstanceOf(Channel)
  })

  test('should have a name property', () => {
    expect(channel.name).toBeTruthy()
  })

  test('should have a shortId property', () => {
    expect(channel.shortId).toBeTruthy()
  })

  test('should have a created property', () => {
    expect(channel.created).toBeTruthy()
  })

  test('should throw an error if Id is not a string', () => {
    // @ts-ignore
    channelData.id = 123
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if the name is not a string', () => {
    // @ts-ignore
    channelData.name = 123
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if the name is an empty string', () => {
    channelData.name = ''
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if the shortId is not a string', () => {
    // @ts-ignore
    channelData.shortId = 123
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if shortId is an empty string', () => {
    channelData.shortId = ''
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if messages is not an array', () => {
    // @ts-ignore
    channelData.messages = 123
    expect(() => new Channel(channelData)).toThrowError()
  })

  test('should throw an error if created is not a date', () => {
    // @ts-ignore
    channelData.created = '12asd a3'
    expect(() => new Channel(channelData)).toThrowError()
  })

  // test('should import a message into the array', () => {
  //   channel.importMessage({
  //     id: '123',
  //     content: new ArrayBuffer(0),
  //     created: new Date(),
  //     author: '123',
  //     keyUsed: '123',
  //     mentions: [],
  //     revision: '1',
  //     created: new Date()
  // })
})