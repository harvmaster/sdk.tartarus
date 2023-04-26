import Message, { MessageInterface } from '.'

describe('Message', () => {
  let messageData: MessageInterface

  beforeEach(() => {
    messageData = {
      id: '123',
      shortId: '123',
      channelId: 'testChannel',
      author: 'testAuthor',
      content: new TextEncoder().encode('test').buffer,
      keyUsed: 'testKey',
      mentions: ['testMention'],
      revision: '1',
      created: new Date(),
    }
  })


  test('should create an instance of Message', () => {
    const message = new Message(messageData)
    expect(message).toBeInstanceOf(Message)
    expect(message.id).toBe(messageData.id)
    expect(message.shortId).toBe(messageData.shortId)
    expect(message.channelId).toBe(messageData.channelId)
    expect(message.author).toBe(messageData.author)
    expect(message.content).toBe(messageData.content)
    expect(message.keyUsed).toBe(messageData.keyUsed)
    expect(message.mentions).toBe(messageData.mentions)
    expect(message.revision).toBe(messageData.revision)
    expect(message.created).toEqual(messageData.created)
  })

  test('should throw an error if id is not a string', () => {
    // @ts-ignore
    messageData.id = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if channelId is not a string', () => {
    // @ts-ignore
    messageData.channelId = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if author is not a string', () => {
    // @ts-ignore
    messageData.author = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if content is not a string', () => {
    // @ts-ignore
    messageData.content = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if keyUsed is not a string', () => {
    // @ts-ignore
    messageData.keyUsed = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if mentions is not an array', () => {
    // @ts-ignore
    messageData.mentions = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if revision is not a string', () => {
    // @ts-ignore
    messageData.revision = 123
    expect(() => new Message(messageData)).toThrowError()
  })

  test('should throw an error if created is not a date', () => {
    // @ts-ignore
    messageData.created = '12asd a3'
    expect(() => new Message(messageData)).toThrowError()
  })
})