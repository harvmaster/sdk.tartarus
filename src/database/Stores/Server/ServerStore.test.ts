import { Client, Stores } from '../../index';
// import { UserStore, DatabaseUser } from './Stores/UserStore';
import { ServerStore, DatabaseServer } from './ServerStore';

describe('ServerStore', () => {
  let serverStore: ServerStore;
  const dateNow = new Date()

  beforeAll(async () => {
    serverStore = Stores.Server as ServerStore;
    await Client.createObjectStores([ServerStore.schema]);
  });

  test('can create a server', async () => {
    const server: DatabaseServer = {
      id: '1',
      name: 'test server',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    };

    const createdId = await serverStore.create(server);
    expect(createdId).toEqual(["1"]);
  }, 3000);

  test('can find a server by id', async () => {
    const server = await serverStore.findById('1');
    expect(server).toEqual({
      id: '1',
      name: 'test server',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    });
  });

  afterAll(async () => {
    await Client.destroyDb()
  })

  test('can find servers by query', async () => {
    const server: DatabaseServer = {
      id: '2',
      name: 'test server 2',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    };

    await serverStore.create(server);

    const servers = await serverStore.find({ name: 'test server 2' });
    expect(servers).toEqual([{
      id: '2',
      name: 'test server 2',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    }]);
  });

  test('can find one server by query', async () => {
    const server: DatabaseServer = {
      id: '3',
      name: 'test server 3',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    };

    await serverStore.create(server);

    const server2 = await serverStore.findOne({ name: 'test server 3' });
    expect(server2).toEqual({
      id: '3',
      name: 'test server 3',
      created: dateNow,
      description: 'a test server',
      shortId: '123456',
      avatar: 'test avatar'
    });
  });
});
