import DbClient from './DbClient';
import { User, Server, ServerChannel, PrivateChannel, Message } from './Stores';

const dbClient = new DbClient();
export const Client = dbClient;

export const Stores = {
  User: new User(dbClient),
  Server: new Server(dbClient),
  ServerChannel: new ServerChannel(dbClient),

  PrivateChannel: new PrivateChannel(dbClient),

  Message: new Message(dbClient)
};

export default { Client, Stores: Stores }