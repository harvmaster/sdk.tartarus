import Member from "./Member";

describe("Member", () => {
  let member: Member;

  beforeEach(() => {
    member = new Member({
      id: "123",
      user: 'testUser',
      nickname: 'testNickname'
    })
  })

  test("should create an instance of Member", () => {
    expect(member).toBeInstanceOf(Member);
  })

  test("should have an id property", () => {
    expect(member.id).toBeTruthy();
  })

  test("should have a user property", () => {
    expect(member.user).toBeTruthy();
  })

  test("should have a nickname property", () => {
    expect(member.nickname).toBeTruthy();
  })

  test('should throw an error if the user is not a string', () => {
    // @ts-ignore
    member.user = 123
    expect(() => new Member(member)).toThrowError()
  })

  test('should throw an error if the user is an empty string', () => {
    member.user = ''
    expect(() => new Member(member)).toThrowError()
  })


  test('should throw an error if the nickname is not a string', () => {
    // @ts-ignore
    member.nickname = 123
    expect(() => new Member(member)).toThrowError()
  })

  test('should throw an error if id is defined but not a string', () => {
    // @ts-ignore
    member.id = 123
    expect(() => new Member(member)).toThrowError()
  })

})