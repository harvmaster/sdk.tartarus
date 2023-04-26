import { Client, Stores } from '../../../index';
import { ServerChannelStore, DatabaseServerChannel } from '.';


describe('Server Channel Store', () => {
  let serverChannelStore: ServerChannelStore;
  const dateNow = new Date()

  beforeAll(async () => {
    serverChannelStore = Stores.ServerChannel as ServerChannelStore;
    await Client.createObjectStores([ServerChannelStore.schema]);
  });

  test('can create a server channel', async () => {
    const serverChannel: DatabaseServerChannel = {
      id: '1',
      shortId: '1',
      name: 'test server channel',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    };

    const createdId = await serverChannelStore.create(serverChannel);
    expect(createdId).toEqual(["1"]);
  }, 3000);

  test('can find a server channel by id', async () => {
    const serverChannel = await serverChannelStore.findById('1');
    expect(serverChannel).toEqual({
      id: '1',
      shortId: '1',
      name: 'test server channel',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    });
  });

  afterAll(async () => {
    await Client.destroyDb()
  })

  test('can find server channels by query', async () => {
    const serverChannel: DatabaseServerChannel = {
      id: '2',
      shortId: '2',
      name: 'test server channel 2',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    };

    await serverChannelStore.create(serverChannel);

    const serverChannels = await serverChannelStore.find({ name: 'test server channel 2' });
    expect(serverChannels).toEqual([{
      id: '2',
      shortId: '2',
      name: 'test server channel 2',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    }]);
  });

  // test can modify channel
  test('can modify a server channel', async () => {
    const modified = await serverChannelStore.findOneAndUpdate({ name: 'test server channel' }, { name: 'modified server channel 1' });
    expect(modified).toEqual({
      id: '1',
      shortId: '1',
      name: 'modified server channel 1',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    });
  });

  // test can find by id and modify
  test('can find a server channel by id and modify', async () => {
    const modified = await serverChannelStore.findOneAndUpdate({ id: '2' }, { name: 'modified server channel 2' });
    expect(modified).toEqual({
      id: '2',
      shortId: '2',
      name: 'modified server channel 2',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    });
  });

  // test can find and modify many
  test('can find server channels by query and modify many', async () => {
    const modified = await serverChannelStore.findAndUpdate({ serverId: '1' }, { name: 'modified server channel 3' });
    expect(modified).toEqual([{
      id: '1',
      shortId: '1',
      name: 'modified server channel 3',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    }, {
      id: '2',
      shortId: '2',
      name: 'modified server channel 3',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    }]);
  });

  // test can delete
  test('can delete a server channel', async () => {
    const deleted = await serverChannelStore.deleteOne({ name: 'modified server channel 3' });
    expect(deleted).toBe(true)

    const servers = await serverChannelStore.find({ name: 'modified server channel 3' });
    expect(servers).toEqual([{
      id: '2',
      shortId: '2',
      name: 'modified server channel 3',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    }]);
  });
  
  // test can find by id and delete
  test('can find a server channel by id and delete', async () => {
    const deleted = await serverChannelStore.deleteOne({ id: '2' });
    expect(deleted).toBe(true)

    const servers = await serverChannelStore.find({ name: 'modified server channel 3' });
    expect(servers).toEqual([]);
  });

  // test can delete many
  test('can find server channels by query and delete many', async () => {
    const serverChannel1: DatabaseServerChannel = {
      id: '3',
      shortId: '3',
      name: 'test server channel 3',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    };

    const serverChannel2: DatabaseServerChannel = {
      id: '4',
      shortId: '4',
      name: 'test server channel 4',
      created: dateNow,
      serverId: '1',
      permittedRoles: [],
      type: 'TEXT'
    };


    await serverChannelStore.create(serverChannel1);
    await serverChannelStore.create(serverChannel2);

    const deleted = await serverChannelStore.delete({ serverId: '1' });
    expect(deleted).toBe(2)

    const servers = await serverChannelStore.find({ serverId: '1' });
    expect(servers).toEqual([]);
  });

  // stress test
  test('can create 5000 server channels and find only half of them', async () => {
    const instances = 5000
    const serverChannels: DatabaseServerChannel[] = [];
    for (let i = 0; i < instances; i++) {
      serverChannels.push({
        id: `${i}`,
        shortId: `${i}`,
        name: `test server channel ${i}`,
        created: dateNow,
        serverId: `${i/2500 >= 1 ? 2 : 1}`,
        permittedRoles: [],
        type: 'TEXT'
      });
    }
    const created = await serverChannelStore.create(serverChannels);
    const servers = await serverChannelStore.find({})

    const sortById = (a: any, b: any) => a.id - b.id

    expect(servers.sort(sortById)).toEqual(serverChannels.sort(sortById));
    const server2 = await serverChannelStore.find({ serverId: '2' })
    expect(server2.length).toBe(2500)
  }, 30000);
})