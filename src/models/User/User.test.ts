import User from './index'

// function that tests the user class with the validate function with jest
test('User class', () => {
  const user = new User({
    id: '123',
    username: 'test user',
    accountCode: 'abc',
    bio: 'test bio',
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)

  expect(user.id).toBe('123')
  expect(user.username).toBe('test user')
  expect(user.accountCode).toBe('abc')
  expect(user.bio).toBe('test bio')
  expect(user.avatar).toBe('test avatar')
  // expect(user.publicKeys).toEqual([])
  // expect(user.memberships).toEqual([])
  expect(user.relationship).toBe('test relationship')
  expect(user.created).toEqual(new Date())
})

// function to test invalid data input into user with jest
test('User class invalid data', () => {
  expect(() => new User({
    id: 123,
    username: 'test user',
    accountCode: 'abc',
    bio: 'test bio',
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)).toThrow('id must be a string')

  expect(() => new User({
    id: '123',
    username: 123,
    accountCode: 'abc',
    bio: 'test bio',
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)).toThrow('username must be a non-empty string')

  expect(() => new User({
    id: '123',
    username: 'test user',
    accountCode: 123,
    bio: 'test bio',
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)).toThrow('accountCode must be a non-empty string')

  expect(() => new User({
    id: '123',
    username: 'test user',
    accountCode: 'abc',
    bio: 123,
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)).toThrow('bio must be a non-empty string')

  expect(() => new User({
    id: '123',
    username: 'test user',
    accountCode: 'abc',
    bio: 'test bio',
    avatar: 123,
    // publicKeys: [],
    // memberships: [],
    relationship: 'test relationship',
    created: new Date()
  } as unknown as User)).toThrow('avatar must be a non-empty string')

  expect(() => new User({
    id: '123',
    username: 'test user',
    accountCode: 'abc',
    bio: 'test bio',
    avatar: 'test avatar',
    // publicKeys: [],
    // memberships: [],
    relationship: 123,
    created: new Date()
  } as unknown as User)).toThrow('relationship must be a non-empty string')
})
