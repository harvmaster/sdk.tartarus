const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
const isBrowser = typeof window !== 'undefined';


let sendMessage: (data: any) => void;
if (isNode) {
  require('fake-indexeddb/auto')
  const { IDBFactory } = require('fake-indexeddb')
  // @ts-ignore
  // indexedDb = new IDBFactory()
  const { parentPort } = require('worker_threads');
  parentPort.on('message', (event: any) => handleMessage(event));
  sendMessage = (data: any) => {
    parentPort.postMessage(data);
  }
} else if (isBrowser) {
  self.onmessage = (event) => handleMessage(event);
  sendMessage = (data: any) => {
    self.postMessage(data);
  }
} else {
  throw new Error('Unsupported environment: Neither Node.js nor a browser detected.');
}

// function handleMessage(event: any) {
//   console.log(event)
//   const { data } = event;
//   console.log('Message received from main script:', data);

//   // Process the message and send a response
//   const response = `Hello from the worker! You sent me: ${data}`;
//   sendMessage(response);
// }


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

type OperationType = 'find' | 'findOne' | 'findById' | 'findAndUpdate' | 'findOneAndUpdate' | 'delete' | 'deleteOne' | 'create' | 'createObjectStores';
type Message = { requestId: number; requestType: OperationType; payload: any };


let version = 1
async function openMyDatabase(v?: number, onUpgrade?: (db: IDBDatabase) => void) : Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (v === undefined) v = version
    const openRequest = indexedDB.open('Tartarus', v);

    openRequest.onsuccess = () => {
      version = openRequest.result.version
      resolve(openRequest.result);
    };

    openRequest.onerror = () => {
      reject(openRequest.error);
    };

    openRequest.onblocked = () => {
      reject(new Error('Database is blocked'))
    }

    openRequest.onupgradeneeded = (event) => {
      const db = openRequest.result;
      if (onUpgrade) return onUpgrade(db);
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

async function updateObjectStores(schemas: ObjectStoreSchema[]) {
  await openMyDatabase(version + 1, upgradingDb => {
    createObjectStores(upgradingDb, schemas);
  })
}

async function handleMessage(event: any) {
  const { requestId, requestType, payload } = event.data as Message;

  try {
    const db = await openMyDatabase();

    switch (requestType) {
      case 'find': {
        const { storeName, query, index: indexName } = payload;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;
        const records: any[] = [];

        const cursorRequest = source.openCursor();

        cursorRequest.onsuccess = (event: any) => {
          const cursor = event.target.result;

          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              records.push(record);
            }
            cursor.continue();
          } else {
            sendMessage({ requestId, result: records }); 
          }
        }
        break;
      }

      case 'findOne': {
        const { storeName, query, index: indexName } = payload;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;

        const cursorRequest = source.openCursor();

        cursorRequest.onsuccess = (event: any) => {
          const cursor = event.target.result;

          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              return sendMessage({ requestId, result: record });
            }
            cursor.continue();
          } else {
            sendMessage({ requestId, result: null }); 
          }
        }
        break;
      }

      case 'findById': {
        const { storeName, id } = payload;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        store.get(id).onsuccess = (event: any) => {
          const record = (event.target as IDBRequest<any>).result;
          sendMessage({ requestId, result: record });
        };
        break;
      }

      case 'findAndUpdate': {
        const { storeName, query, update, index: indexName } = payload;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;
        let updatedRecords: any = [];

        const cursorRequest = source.openCursor();

        cursorRequest.onsuccess = (event: any) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              const updatedRecord = Object.assign({}, cursor.value, update);
              updatedRecords.push(updatedRecord);
              cursor.update(updatedRecord);
            }
            cursor.continue()
          }
        };

        tx.oncomplete = () => {
          sendMessage({ requestId, result: updatedRecords });
        };
        break;
      }

      case 'findOneAndUpdate': {
        const { storeName, query, update, index: indexName } = payload;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;
        let updatedRecord: any = null;

        const cursorRequest = source.openCursor();

        cursorRequest.onsuccess = (event: any) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              updatedRecord = Object.assign({}, cursor.value, update);
              cursor.update(updatedRecord);
            } else {
              cursor.continue()
            }
          }
        };

        tx.oncomplete = () => {
          sendMessage({ requestId, result: updatedRecord });
        };
        break;
      }

      case 'delete': {
        const { storeName, query, indexName } = payload;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;

        const cursorRequest = source.openCursor();

        let deleted = 0

        cursorRequest.onsuccess = (event: any) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              cursor.delete()
              deleted++
            }
            cursor.continue()
          }
        };

        tx.oncomplete = () => {
          sendMessage({ requestId, result: deleted });
        };
        break;
      }

      case 'deleteOne': {
        const { storeName, query, indexName } = payload;
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const source = indexName ? store.index(indexName) : store;

        const cursorRequest = source.openCursor();

        cursorRequest.onsuccess = (event: any) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          
          if (cursor) {
            const record = cursor.value;
            const isMatch = Object.entries(query).every(([key, value]) => record[key] === value);

            if (isMatch) {
              cursor.delete()
            } else {
              cursor.continue()
            }
          }
        };

        tx.oncomplete = () => {
          sendMessage({ requestId, result: true });
        };
        break;
      }

      case 'create': {
        let { storeName, records } = payload;
        const tx = db.transaction(storeName,'readwrite');
        const store = tx.objectStore(storeName);

        if (!(records instanceof Array)) {
          records = [records];
        }

        let created: any = []
        const addRequests = records.map((record: any) => store.add(record));
        addRequests.forEach((request: any) => {
          request.onsuccess = (event: any) => {
            const key = (event.target as IDBRequest<any>).result;
            created.push(key)
          }
        })

        tx.oncomplete = (event: any) => {
          const key = (event.target as IDBRequest<any>).result;
          sendMessage({ requestId, result: created });
        };
  
        tx.onerror = (event: any) => {
          console.log(`You have an error dipshit`)
          sendMessage({ requestId, requestType: 'error', result: tx.error });
        };
        break;
      }
  
      case 'createObjectStores': {
        // Close db before upgrading
        db.close()

        // upgrade with schemas
        await updateObjectStores(payload.schemas);
        sendMessage({ requestId, result: true });
        break;
      }
    }
  
    db.close();
  } catch (error: any) {
    console.log(error)
    sendMessage({ requestId, requestType: 'error', result: error.message });
  }
};
