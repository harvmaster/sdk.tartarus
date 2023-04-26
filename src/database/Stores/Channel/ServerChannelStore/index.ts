import DbClient from "../../../DbClient";
import BaseStore from "../../BaseStore";
import { ServerChannelInterface } from "../../../../models/Channel";

// type ServerChannelInterface = ServerChannelInterface;

export type DatabaseServerChannel = Omit<ServerChannelInterface, 'messages'>;

export class ServerChannelStore extends BaseStore<DatabaseServerChannel> {
  constructor(dbClient: DbClient) {
    super(dbClient, "server_channels", { defaults: { index: 'name' } });
  }

  static schema: ObjectStoreSchema = {
    name: 'server_channels',
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'name', keyPath: 'name', options: { unique: false } },
      { name: 'serverId', keyPath: 'serverId', options: { unique: false } }
    ],
  };
}

export default ServerChannelStore