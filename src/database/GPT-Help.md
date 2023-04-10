This is my file structure

- src
  - database
    - Stores
      - UserStore.ts
    - DbClient.ts
    - index.ts
  - workers
    - SharedWorker.ts
    - SharedWorkerWrapper.ts


These files contain the following code
```
// UserStore.ts
import DbClient from "../DbClient";
import BaseStore from "./BaseStore";

import { UserInterface } from '../../models/User'

export type DatabaseUser = UserInterface
export type UserQuery = Partial<DatabaseUser>

export class UserStore extends BaseStore {
constructor(dbClient: DbClient) {
  super(dbClient, 'users');
}

// Define the schema for how its stored in the database
static schema: ObjectStoreSchema = {
  name: 'users',
  keyPath: 'id',
  autoIncrement: true,
  indices: [
    { name: 'username', keyPath: 'username', options: { unique: false } },
    { name: 'age', keyPath: 'age', options: { unique: false } },
  ],
};

async find(query?: UserQuery): Promise<DatabaseUser[]> {
  return super.find(query);
}


}

export default UserStore
```

```
// DbClient.ts
import { SharedWorkerWrapper } from "../workers/SharedWorkerWrapper";

// Define the operation types and payload interfaces
type OperationType = 'find' | 'findOne' | 'findAndUpdate' | 'delete' | 'deleteOne' | 'create';

interface FindPayload {
  query?: any;
}

interface FindOnePayload {
  query: any;
}

interface FindAndUpdatePayload {
  query: any;
  update: any;
}

interface DeletePayload {
  query: any;
}

interface DeleteOnePayload {
  query: any;
}

interface CreatePayload {
  data: any;
}

interface Message {
  requestType: OperationType;
  payload: FindPayload | FindOnePayload | FindAndUpdatePayload | DeletePayload | DeleteOnePayload | CreatePayload;
}

interface ErrorMessage {
  requestId: string;
  requestType: 'error';
  payload: {
    message: string;
  };
}

interface ResponseMessage extends Message {
  requestId: string;
}

class DbClient {
  private sharedWorker: SharedWorker
  private pendingRequests: Map<string, (value: any) => void>;

  constructor() {
    this.sharedWorker = SharedWorkerWrapper.getInstance();
    this.pendingRequests = new Map();
    this.sharedWorker.port.onmessage = (event: MessageEvent) => {
      const { requestId, requestType, payload } = event.data as ResponseMessage | ErrorMessage;

      const resolve = this.pendingRequests.get(requestId);
      if (resolve) {
        if (requestType === 'error') {
          this.pendingRequests.delete(requestId);
          throw payload;
        } else {
          this.pendingRequests.delete(requestId);
          resolve(payload);
        }
      }
    };
  }

  private _sendRequest<T>(
    requestType: OperationType,
    payload: FindPayload | FindOnePayload | FindAndUpdatePayload | DeletePayload | DeleteOnePayload | CreatePayload
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestId = `${requestType}-${Date.now()}-${Math.random()}`;
      this.pendingRequests.set(requestId, resolve);
      this.sharedWorker.port.postMessage({ requestId, requestType, payload });
    });
  }

  async find(query?: any): Promise<any[]> {
    const { data } = await this._sendRequest<any>('find', { query });
    return data;
  }

  async findOne(query: any): Promise<any> {
    const { data } = await this._sendRequest<any>('findOne', { query });
    return data;
  }

  async findAndUpdate(query: any, update: any): Promise<any> {
    const { data } = await this._sendRequest<any>('findAndUpdate', { query, update });
    return data;
  }

  async delete(query: any): Promise<boolean> {
    const { success } = await this._sendRequest<any>('delete', { query });
    return success;
  }

  async deleteOne(query: any): Promise<boolean> {
    const { success } = await this._sendRequest<any>('deleteOne', { query });
    return success;
  }

  async create(data: any): Promise<number> {
    const { createdId } = await this._sendRequest<any>('create', { data });
    return createdId;
  }
}

// Export the DbClient class
export default DbClient;
```

```
// database/index.ts
import DbClient from './DbClient';
import * as stores from './Stores';

const dbClient = new DbClient();
const dbStores = Object.keys(stores).reduce((acc: any, storeName: string) => {
  // @ts-ignore
  const Store = stores[storeName];
  return acc[storeName] = new Store(dbClient);
}, {})

export const Stores = dbStores;
export const Client = dbClient;

export default { Client, Stores }
```

```
// SharedWorker.ts
interface ObjectStoreSchema {
  name: string;
  keyPath: string;
  autoIncrement: boolean;
  indices: Array<{
    name: string;
    keyPath: string;
    options: IDBIndexParameters;
  }>;
}

type OperationType = 'find' | 'findOne' | 'findById' | 'findAndUpdate' | 'delete' | 'deleteOne' | 'create' | 'createObjectStores';
type Message = { requestId: number; type: OperationType; payload: any };

async function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('myDatabase', 1);

    openRequest.onsuccess = () => {
      resolve(openRequest.result);
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };

    openRequest.onupgradeneeded = (event) => {
      const db = openRequest.result;
      createObjectStores(db, []);
    };
  });
}

function createObjectStores(db: IDBDatabase, schemas: ObjectStoreSchema[]) {
  for (const schema of schemas) {
    if (!db.objectStoreNames.contains(schema.name)) {
      const objectStore = db.createObjectStore(schema.name, {
        keyPath: schema.keyPath,
        autoIncrement: schema.autoIncrement,
      });

      for (const index of schema.indices) {
        objectStore.createIndex(index.name, index.keyPath, index.options);
      }
    }
  }
}

// @ts-ignore
self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];

  port.onmessage = async (event: MessageEvent) => {
    const { requestId, type, payload } = event.data as Message;

    try {
      const db = await openDatabase();

      switch (type) {
        case 'find': {
          const { storeName, query } = payload;
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const index = store.index('name');
          const records: any[] = [];

          index.openCursor(query.name).onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
              records.push(cursor.value);
              cursor.continue();
            } else {
              port.postMessage({ requestId, result: records });
            }
          };
          break;
        }

        case 'findOne': {
          const { storeName, query } = payload;
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);
          const index = store.index('name');

          index.get(query.name).onsuccess = (event) => {
            const record = (event.target as IDBRequest<any>).result;
            port.postMessage({ requestId, result: record });
          };
          break;
        }

        case 'findById': {
          const { storeName, id } = payload;
          const tx = db.transaction(storeName, 'readonly');
          const store = tx.objectStore(storeName);

          store.get(id).onsuccess = (event) => {
            const record = (event.target as IDBRequest<any>).result;
            port.postMessage({ requestId, result: record });
          };
          break;
        }

        case 'findAndUpdate': {
          const { storeName, query, update } = payload;
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const index = store.index('name');
          let updatedRecord: any = null;

          index.openCursor(query.name).onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
              updatedRecord = Object.assign({}, cursor.value, update);
              cursor.update(updatedRecord);
            }
          };

          tx.oncomplete = () => {
            port.postMessage({ requestId, result: updatedRecord });
          };
          break;
        }

        case 'delete': {
          const { storeName, query } = payload;
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const index = store.index('name');

          index.openCursor(query.name).onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };

          tx.oncomplete = () => {
            port.postMessage({ requestId, result: true });
          };
          break;
        }

        case 'deleteOne': {
          const { storeName, query } = payload;
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);
          const index = store.index('name');

          index.openCursor(query.name).onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

            if (cursor) {
              cursor.delete();
            }
          };

          tx.oncomplete = () => {
            port.postMessage({ requestId, result: true });
          };
          break;
        }

        case 'create': {
          const { storeName, record } = payload;
          const tx = db.transaction(storeName,'readwrite');
          const store = tx.objectStore(storeName);
          const addRequest = store.add(record);

          addRequest.onsuccess = (event) => {
            const key = (event.target as IDBRequest<any>).result;
            port.postMessage({ requestId, result: key });
          };
    
          addRequest.onerror = (event) => {
            port.postMessage({ requestId, error: addRequest.error });
          };
          break;
        }
    
        case 'createObjectStores': {
          createObjectStores(db, payload.schemas);
          port.postMessage({ requestId, result: true });
          break;
        }
      }
    
      db.close();
    } catch (error: any) {
      port.postMessage({ requestId, error: error.message });
    }
  };
};
```

```
// SharedWorkerWrapper

export class SharedWorkerWrapper {
  private static instance: SharedWorker;

  private constructor() {
  }

  public static getInstance(): SharedWorker {
    if (!SharedWorkerWrapper.instance) {
      SharedWorkerWrapper.instance = new SharedWorker('SharedWorker.ts');
      // await SharedWorkerWrapper.instance.init();
    }

    return SharedWorkerWrapper.instance;
  }
}

```

Using this information. Create a test file that will allow me to test that a database is being created, the object stores are being created, users can be added to the database, and found in the database