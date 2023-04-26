import { SharedWorkerWrapper } from "../workers/SharedWorkerWrapper";

// Define the operation types and payload interfaces
type OperationType = 'find' | 'findOne' | 'findAndUpdate' | 'findOneAndUpdate' | 'delete' | 'deleteOne' | 'create' | 'findById' | 'createObjectStores';

interface FindPayload {
  query?: any;
}

interface FindOnePayload {
  query: any;
}

interface FindByIdPayload {
  query: string;
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

interface CreateObjectStoresPayload {
  schemas: ObjectStoreSchema[];
}


interface Message {
  requestType: OperationType;
  payload: FindPayload | FindOnePayload | FindByIdPayload | FindAndUpdatePayload | DeletePayload | DeleteOnePayload | CreatePayload;
}

interface ErrorMessage {
  requestId: string;
  requestType: 'error';
  payload: {
    message: string;
  };
  result: any;
}

interface ResponseMessage extends Message {
  requestId: string;
  result: any
}

class DbClient {
  private sharedWorker: SharedWorker
  private pendingRequests: Map<string, (value: any) => void>;

  constructor() {
    this.sharedWorker = SharedWorkerWrapper.getInstance();
    this.pendingRequests = new Map();
    this.sharedWorker.port.addEventListener('message', (event: MessageEvent) => {
      let { requestId, requestType, result } = event.data ?? event as unknown as ResponseMessage | ErrorMessage;
      requestId = 'res-'+requestId;

      const resolve = this.pendingRequests.get(requestId);
      if (resolve) {
        if (requestType === 'error') {
          this.pendingRequests.delete(requestId);
          throw result;
        } else {
          this.pendingRequests.delete(requestId);
          resolve(result);
        }
      }
    });
  }

  private _sendRequest<T>(
    requestType: OperationType,
    payload: FindPayload | FindOnePayload | FindAndUpdatePayload | DeletePayload | DeleteOnePayload | CreatePayload | CreateObjectStoresPayload
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const generateRequestId = () => `${requestType}-${Math.floor(Math.random()*10000000)}`;
      let requestId = generateRequestId();
      while (this.pendingRequests.get('res-'+requestId)) {
        console.log('Collision')
        requestId = generateRequestId()
      }
      this.pendingRequests.set(`res-${requestId}`, resolve);
      // console.log('Sending request', requestId, requestType, payload);
      this.sharedWorker.port.postMessage({ requestId, requestType, payload });
    });
  }

  async createObjectStores(schemas: ObjectStoreSchema[]): Promise<any> {
    // this.sharedWorker.port.postMessage({ type: 'createObjectStores', payload: { schemas } });
    const res = await this._sendRequest<any>('createObjectStores', { schemas });
    return res;
  }

  async find(query?: any): Promise<any[]> {
    const data = await this._sendRequest<any>('find', { ...query });
    return data;
  }

  async findOne(query: any): Promise<any> {
    const data = await this._sendRequest<any>('findOne', { ...query });
    return data;
  }

  async findById(query: any): Promise<any> {
    const data = await this._sendRequest<any>('findById', { ...query });
    return data;
  }

  async findAndUpdate(query: any, update: any): Promise<any> {
    const data = await this._sendRequest<any>('findAndUpdate', { ...query, update });
    return data;
  }

  async findOneAndUpdate(query: any, update: any): Promise<any> {
    const data = await this._sendRequest<any>('findOneAndUpdate', { ...query, update });
    return data;
  }

  async delete(query: any): Promise<number> {
    const success = await this._sendRequest<any>('delete', { ...query });
    return success;
  }

  async deleteOne(query: any): Promise<boolean> {
    const success = await this._sendRequest<any>('deleteOne', { ...query });
    return success;
  }

  async create(records: any): Promise<number> {
    const data = await this._sendRequest<any>('create', { ...records });
    return data
    // return createdId;
  }

  async destroyDb () {
    // @ts-ignore
    if (this.sharedWorker && this.sharedWorker._worker && this.sharedWorker.port) {
      // @ts-ignore
      if (this.sharedWorker._worker.terminate) {
        // @ts-ignore
        await this.sharedWorker._worker.terminate();
      }
    }
  }
}

// Export the DbClient class
export default DbClient;
