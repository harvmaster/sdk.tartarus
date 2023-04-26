import DbClient from "../../../DbClient";
import BaseStore from "../../BaseStore";
import { PrivateChannelInterface } from "../../../../models/Channel";

// type ServerChannelInterface = ServerChannelInterface;

export type DatabasePrivateChannel = Omit<PrivateChannelInterface, 'messages' | 'participants'>;

export class PrivateChannelStore extends BaseStore<DatabasePrivateChannel> {
  constructor(dbClient: DbClient) {
    super(dbClient, "private_channels", { defaults: { index: 'name' } });
  }

  static schema: ObjectStoreSchema = {
    name: 'private_channels',
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'name', keyPath: 'name', options: { unique: false } },
      // { name: 'serverId', keyPath: 'serverId', options: { unique: false } }
    ],
  };
}

export default PrivateChannelStore