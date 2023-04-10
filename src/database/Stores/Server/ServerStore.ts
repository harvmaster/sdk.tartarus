import DbClient from "../../DbClient";
import BaseStore from "../BaseStore";
import { Server } from "../../../models/Server";

type ServerInterface = Server.ServerInterface;

export type DatabaseServer = Omit<ServerInterface, 'members' | 'channels'>;

export class ServerStore extends BaseStore<DatabaseServer> {
  constructor(dbClient: DbClient) {
    super(dbClient, "servers", { defaults: { index: 'name' } });
  }

  static schema: ObjectStoreSchema = {
    name: 'servers',
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'name', keyPath: 'name', options: { unique: false } }
    ],
  };
}

export default ServerStore