import DbClient from "../../DbClient";
import BaseStore from "../BaseStore";

import { UserInterface } from '../../../models/User'

export type DatabaseUser = UserInterface

export class UserStore extends BaseStore<DatabaseUser> {
  
  constructor(dbClient: DbClient) {
    super(dbClient, 'users', { defaults: { index: 'username' } });
  }

  // Define the schema for how its stored in the database
  static schema: ObjectStoreSchema = {
    name: 'users',
    keyPath: 'id',
    autoIncrement: false,
    indices: [
      { name: 'username', keyPath: 'username', options: { unique: false } },
    ],
  };
  
}

export default UserStore