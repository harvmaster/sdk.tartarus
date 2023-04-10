import DbClient from './DbClient';
import { User, Server } from './Stores';

const dbClient = new DbClient();
export const Client = dbClient;

export const Stores = {
  User: new User(dbClient),
  Server: new Server(dbClient),
};

export default { Client, Stores: Stores }