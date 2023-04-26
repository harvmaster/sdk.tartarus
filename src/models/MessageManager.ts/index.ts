import { Message, MessageInterface } from '../Message'

class MessageManager extends Array<Message> {
  // a class which manages messages
  //  can be used exactly as if it was an array

  constructor (messages?: Message[]) {
    if (messages != undefined) super(...messages)
    else super()
  }

  // returns the message with the given id
  //  returns undefined if no message with that id exists
  get (id: string): Message | undefined {
    return this.find(message => message.id === id)
  }

  sortByDate(): MessageManager {
    return new MessageManager(this.sort((a, b) => a.created.getTime() - b.created.getTime()))
  }

  sortByAuther(): MessageManager {
    return this
  }

  addMessage (message: Message | Message[] | MessageInterface): MessageManager {
    if (message instanceof Array) {
      message.forEach(message => this.addMessage(message))
    } else {
      if (!(message instanceof Message)) {
        message = new Message(message)
      }
      // @ts-ignore
      this.push(message)
    }
    return this
  }

  // removes the message, or array of messages, or single id
  removeMessage (message: Message | Message[] | string): MessageManager {
    if (message instanceof Array) {
      message.forEach(message => this.removeMessage(message))
    } else {
      if (typeof message === 'string') message = this.find(msg => msg.id === message) || (undefined as unknown as Message)
      if (!message) return this
      this.splice(this.indexOf(message), 1)
    }
    return this
  }

}

export default MessageManager