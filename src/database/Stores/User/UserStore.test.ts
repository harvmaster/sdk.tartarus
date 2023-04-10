// import 'fake-indexeddb/auto';
import { Client, Stores } from '../../index';
import { UserStore, DatabaseUser } from './UserStore';

describe('UserStore', () => {
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
    expect(createdId).toBe("1");
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

  test('can find one user by query', async () => {
    const user: DatabaseUser = {
      id: '3',
      username: 'janice_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    await userStore.create(user);

    const userFound = await userStore.findOne({ username: 'janice_doe' });
    // console.log(users)
    expect(userFound).toEqual({
      id: '3',
      username: 'janice_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    });
  });

  test('can find and update users', async () => {
    const user: DatabaseUser = {
      id: '4',
      username: 'julie_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };
    const user2: DatabaseUser = {
      id: '5',
      username: 'julie_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    await userStore.create(user);
    await userStore.create(user2);

    const userFound = await userStore.findAndUpdate({ username: 'julie_doe' }, { username: 'joe_doe' });
    expect(userFound).toEqual([{
      id: '4',
      username: 'joe_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    }, {
      id: '5',
      username: 'joe_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    }]);
  });

  test('can find and update one user', async () => {
    const user: DatabaseUser = {
      id: '6',
      username: 'anne_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    const user2: DatabaseUser = {
      id: '7',
      username: 'anne_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    }

    await userStore.create(user);
    await userStore.create(user2);

    const userUpdated = await userStore.findOneAndUpdate({ username: 'anne_doe' }, { username: 'anna_doe' })
    expect(userUpdated).toEqual({
      id: '6',
      username: 'anna_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    });

    const anne = await userStore.findById('7');
    expect(anne).toEqual({
      id: '7',
      username: 'anne_doe',
      accountCode: '123',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    });
  });

  test('can find and delete multiple users', async () => {
    const user: DatabaseUser = {
      id: '8',
      username: 'bob',
      accountCode: '124',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    const user2: DatabaseUser = {
      id: '9',
      username: 'alice',
      accountCode: '124',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    await userStore.create(user);
    await userStore.create(user2);

    const userDeleted = await userStore.delete({ accountCode: '124' });
    expect(userDeleted).toEqual(2);
  });

  test('can delete single user' , async () => {
    const user: DatabaseUser = {
      id: '10',
      username: 'bob',
      accountCode: '125',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    const user2: DatabaseUser = {
      id: '11',
      username: 'alice',  
      accountCode: '125',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    };

    await userStore.create(user);
    await userStore.create(user2);

    const userDeleted = await userStore.deleteOne({ accountCode: '125' });
    expect(userDeleted).toEqual(true);

    const bob = await userStore.findById('10');
    expect(bob).toBeUndefined();

    const alice = await userStore.findById('11')
    expect(alice).toEqual({
      id: '11',
      username: 'alice',
      accountCode: '125',
      bio: 'test bio',
      avatar: 'test avatar',
      relationship: 'user',
      created: dateNow
    });
  });

  // Add more tests for other functionalities as needed
});
