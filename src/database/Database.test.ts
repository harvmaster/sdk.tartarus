// import 'fake-indexeddb/auto';
import { Client, Stores } from './index';
import { UserStore, DatabaseUser } from './Stores/User/UserStore';

describe('Database', () => {
  let userStore: UserStore;
  const dateNow = new Date()

  beforeAll(async () => {
    userStore = Stores.User as UserStore;
    await Client.createObjectStores([UserStore.schema]);
  });

  test('can create a user', async () => {
    const user: DatabaseUser = {
      id: '1',
      username: 'john_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    const createdId = await userStore.create(user);
    expect(createdId).toEqual(["1"]);
  }, 3000);

  test('can find a user by id', async () => {
    const user = await userStore.findById('1');
    expect(user).toEqual({
      id: '1',
      username: 'john_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    });
  });

  afterAll(async () => {
    await Client.destroyDb()
  })

  test('can find users by query', async () => {
    const user: DatabaseUser = {
      id: '2',
      username: 'jane_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    await userStore.create(user);

    const users = await userStore.find({ username: 'jane_doe' });
    // console.log(users)
    expect(users).toEqual([
      {
        id: '2',
        username: 'jane_doe',
        accountCode: '123',
        bio: 'test bio',
        avatar: 'test avatar',
        relationship: 'user',
        created: dateNow
      },
    ]);
  });

  // Add more tests for other functionalities as needed
});
