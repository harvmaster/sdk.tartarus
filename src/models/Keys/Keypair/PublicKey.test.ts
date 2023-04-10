import { PublicKey, publicKeyInterface } from "./PublicKey";

describe("PublicKey", () => {
  let publicKeyData: publicKeyInterface;
  let publicKey: PublicKey;

  beforeEach(() => {
    publicKeyData = {
      id: "test",
      key: "test",
      created: "2021-01-01T00:00:00.000Z",
    }

    publicKey = new PublicKey(publicKeyData);
  });

  test("should create an instance of PublicKey", () => {
    expect(publicKey).toBeInstanceOf(PublicKey);
  });

  test("should have an id property", () => {
    expect(publicKey.id).toBeTruthy();
    expect(typeof publicKey.id).toBe("string");
  });

  test("should have a key property", () => {
    expect(publicKey.key).toBeTruthy();
    expect(typeof publicKey.key).toBe("string");
  });

  test("should have a created property", () => {
    expect(publicKey.created).toBeTruthy();
    expect(publicKey.created).toBeInstanceOf(Date);
  });

  test('should throw an error if "id" is not a string', () => {
    publicKeyData.id = 1 as any;
    expect(() => new PublicKey(publicKeyData)).toThrowError();

  })

  test('should throw an error if "key" is not a string', () => {
    publicKeyData.key = 1 as any;
    expect(() => new PublicKey(publicKeyData)).toThrowError();
  })

  test('should throw an error if "created" is not a string, number, or Date', () => {
    publicKeyData.created = {} as any;
    expect(() => new PublicKey(publicKeyData)).toThrowError();
  })
})