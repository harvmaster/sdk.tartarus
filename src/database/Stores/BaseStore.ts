import DbClient from '../DbClient';

type Options = {
  defaults: {
    index: string;
  };
}

export type ObjectStoreSchema = {
  name: string;
  keyPath: string;
  autoIncrement: boolean;
  indices: Array<{
    name: string;
    keyPath: string;
    options: IDBIndexParameters;
  }>;
}

class BaseStore<TRecord> {
  protected dbClient: DbClient;
  protected storeName: string;
  protected options: Options;
  static schema: ObjectStoreSchema;

  constructor(dbClient: DbClient, storeName: string, options: Options) {
    this.dbClient = dbClient;
    this.storeName = storeName;
    this.options = options;
  }

  async find(query?: Partial<TRecord>, index?: string): Promise<TRecord[]> {
    index ?? this.options.defaults.index;

    return this.dbClient.find({ storeName: this.storeName, query, index });
  }

  async findOne(query: Partial<TRecord>, index?: string): Promise<TRecord> {
    index ?? this.options.defaults.index;

    return this.dbClient.findOne({ storeName: this.storeName, query, index });
  }

  async findById(query: string) {
    return this.dbClient.findById({ storeName: this.storeName, id: query });
  }

  async findAndUpdate(query: Partial<TRecord>, update: Partial<TRecord>, index?: string): Promise<TRecord[]> {
    index ?? this.options.defaults.index;

    return this.dbClient.findAndUpdate({ storeName: this.storeName, query, index }, update);
  }

  async findOneAndUpdate(query: Partial<TRecord>, update: Partial<TRecord>, index?: string): Promise<TRecord> {
    index ?? this.options.defaults.index;

    return this.dbClient.findOneAndUpdate({ storeName: this.storeName, query, index }, update);
  }

  async delete(query: Partial<TRecord>, index?: string): Promise<number> {
    index ?? this.options.defaults.index;

    return this.dbClient.delete({ storeName: this.storeName, query, index });
  }

  async deleteOne(query: Partial<TRecord>, index?: string): Promise<boolean> {
    index ?? this.options.defaults.index;

    return this.dbClient.deleteOne({ storeName: this.storeName, query, index });
  }

  async create(data: TRecord | TRecord[]): Promise<TRecord | TRecord[]> {
    return this.dbClient.create({ storeName: this.storeName, records: data }) as TRecord;
  }
}

export default BaseStore;
