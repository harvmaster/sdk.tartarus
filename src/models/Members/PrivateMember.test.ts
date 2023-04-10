import PrivateMember from "./PrivateMember";

describe("PrivateMember", () => {
  let privateMember: PrivateMember;

  beforeEach(() => {
    privateMember = new PrivateMember(
      {
        id: "123",
        user: '123',
        nickname: "test",
        privateChannelId: "123"
      }
    );
  });

  test("should create an instance of PrivateMember", () => {
    expect(privateMember).toBeInstanceOf(PrivateMember);
  });

  test("should have a privateChannelId property", () => {
    expect(privateMember.privateChannelId).toBeTruthy();
  });

  test('should throw an error if the privateChannelId is not a string', () => {
    // @ts-ignore
    privateMember.privateChannelId = 123
    expect(() => new PrivateMember(privateMember)).toThrowError()
  })
})