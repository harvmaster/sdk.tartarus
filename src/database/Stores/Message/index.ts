import DbClient from "../../DbClient";
import BaseStore from "../BaseStore";
import { Message, MessageInterface as IMessage } from '../../../models/Message';

export type DatabaseMessage = IMessage

export class MessageStore extends BaseStore<IMessage> {
  constructor(dbClient: DbClient) {
    super(dbClient, "messages", { defaults: { index: 'channelId' } });
  }

  static schema: ObjectStoreSchema = {
    name: 'messages',
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      // { name: 'id', keyPath: 'id', options: { unique: false } },
      { name: 'channelId', keyPath: 'channelId', options: { unique: false } },

    ],
  };

  // @ts-ignore
  async find(query: Partial<Omit<IMessage, 'content'> & { content: string | ArrayBuffer }>): Promise<IMessage[]> {
    if (typeof query.content == 'string') {
      const encoder = new TextEncoder();
      query.content = encoder.encode(query.content).buffer
    }
    if (typeof query.content == 'string') throw new TypeError('Message.content must be an ArrayBuffer or Strings')
    // @ts-ignore
    const messages = await super.find(query);

    return messages.map((message: IMessage) => new Message(message));
  }

}

export default MessageStore