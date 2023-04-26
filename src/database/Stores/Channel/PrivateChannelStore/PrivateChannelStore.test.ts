import { Client, Stores } from '../../../index';
import { PrivateChannelStore, DatabasePrivateChannel } from '.';
import { PrivateChannel } from '../..';

describe('PrivateChannelStore', () => {
  let privateChannelStore: PrivateChannelStore = Stores.PrivateChannel as PrivateChannelStore;
  const dateNow = new Date()

  beforeAll(async () => {
    await Client.createObjectStores([PrivateChannelStore.schema]);
  });

  test('can create a private channel', async () => {
    const privateChannel: DatabasePrivateChannel = {
      id: '1',
      name: 'test private channel',
      created: dateNow,
      shortId: '123456',
    };

    const createdId = await privateChannelStore.create(privateChannel);
    expect(createdId).toEqual(["1"]);
  }, 3000);

  test('can find a private channel by id', async () => {
    const privateChannel = await privateChannelStore.findById('1');
    expect(privateChannel).toEqual({
      id: '1',
      name: 'test private channel',
      created: dateNow,
      shortId: '123456',
    });
  });

  afterAll(async () => {
    await Client.destroyDb()
  })

  test('can find private channels by query', async () => {
    const privateChannel: DatabasePrivateChannel = {
      id: '2',
      name: 'test private channel 2',
      created: dateNow,
      shortId: '123456'
    };

    await privateChannelStore.create(privateChannel);
    const privateChannels = await privateChannelStore.find({ name: 'test private channel 2' });
    expect(privateChannels).toEqual([{
      id: '2',
      name: 'test private channel 2',
      created: dateNow,
      shortId: '123456'
    }]);
  });

  test('can find all private channels', async () => {
    const privateChannels = await privateChannelStore.find({});
    expect(privateChannels).toEqual([{
      id: '1',
      name: 'test private channel',
      created: dateNow,
      shortId: '123456',
    }, {
      id: '2',
      name: 'test private channel 2',
      created: dateNow,
      shortId: '123456',
    }]);
  });

  test('can update a single private channel with findOneAndUpdate', async () => {
    const privateChannel: DatabasePrivateChannel = {
      id: '1',
      name: 'test private channel',
      created: dateNow,
      shortId: '123456',
    };

    const updated = await privateChannelStore.findOneAndUpdate({ id: '1' }, { name: 'updated private channel' });
    expect(updated).toEqual({
      id: '1',
      name: 'updated private channel',
      created: dateNow,
      shortId: '123456',
    });
  })

  test('can update multiple private channels with findAndUpdate', async () => {
    const privateChannel1: DatabasePrivateChannel = {
      id: '3',
      name: 'test channel to update 1',
      created: dateNow,
      shortId: '123123',
    };
    const privateChannel2: DatabasePrivateChannel = {
      id: '4',
      name: 'test channel to update 2',
      created: dateNow,
      shortId: '123123',
    };

    await privateChannelStore.create(privateChannel1);
    await privateChannelStore.create(privateChannel2);

    const updated = await privateChannelStore.findAndUpdate({ shortId: '123123' }, { shortId: '321321' });
    expect(updated).toEqual([{
      id: '3',
      name: 'test channel to update 1',
      created: dateNow,
      shortId: '321321',
    }, {
      id: '4',
      name: 'test channel to update 2',
      created: dateNow,
      shortId: '321321',
    }]);

    // Make sure outside mutations did not occur
    const unchangedPrivateChannel = await privateChannelStore.findById('1');
    expect(unchangedPrivateChannel).toEqual({
      id: '1',
      name: 'updated private channel',
      created: dateNow,
      shortId: '123456',
    });
  })

  test('can delete a private channel', async () => {
    const deleted = await privateChannelStore.delete({ id: '1' });
    expect(deleted).toBe(1);
  })

});
