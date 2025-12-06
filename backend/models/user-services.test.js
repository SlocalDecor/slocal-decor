// only unit test functions that actually do validation
import * as artModel from "./user.js";
import { jest } from "@jest/globals";

jest.unstable_mockModule("./user.js", () => {
  const mSave = jest.fn().mockResolvedValue("mocked save");
  const mUser = jest.fn().mockImplementation(() => ({
    save: mSave,
  }));

  mUser.findById = jest
    .fn()
    .mockResolvedValue({ _id: "123", name: "Mocked User" });
  mUser.find = jest.fn().mockResolvedValue({
    _id: "123",
    name: "Mocked User",
    email: "email@gmail.com",
  });
  mUser.findByIdAndDelete = jest.fn().mockResolvedValue({ success: true });
  mUser.findByIdAndUpdate = jest.fn().mockResolvedValue({ success: true });
  mUser.findOne = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue({
      _id: "123",
      name: "Mocked User",
      email: "email@gmail.com",
    }),
  });
  mUser.findOne.select = jest.fn().mockResolvedValue({ success: true });

  return {
    __esModule: true,
    default: mUser,
  };
});

jest.unstable_mockModule("./art.js", () => {
  const mArt = jest.fn().mockImplementation(() => ({
    save: mSave,
  }));
  mArt.deleteMany = jest.fn().mockResolvedValue({ success: true });
  return {
    __esModule: true,
    default: mArt,
  };
});
let addUser;
let getUsers;
let deleteUser;
let findUserById;
let findUserForLogin;
let findUserByEmail;
let findUserByName;
let updateUserById;
let updateUserArt;
let unsaveArt;
let removeArtFromUser;

beforeAll(async () => {
  const userServices = await import("./user-services.js");
  addUser = userServices.default.addUser;
  getUsers = userServices.default.getUsers;
  deleteUser = userServices.default.deleteUser;
  findUserById = userServices.default.findUserById;
  findUserForLogin = userServices.default.findUserForLogin;
  findUserByEmail = userServices.default.findUserByEmail;
  updateUserArt = userServices.default.updateUserArt;
  findUserByName = userServices.default.findUserByName;
  updateUserById = userServices.default.updateUserById;
  unsaveArt = userServices.default.unsaveArt;
  removeArtFromUser = userServices.default.removeArtFromUser;
});

describe("userService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addUser tests", () => {
    test("Inserting empty user object should throw error", () => {
      const user = {};
      expect(() => addUser(user)).toThrow("Missing name");
    });

    test("Inserting user object without email should throw error", () => {
      const user = {
        name: "test",
        phone: "1234567890",
        bio: "desc",
      };
      expect(() => addUser(user)).toThrow("Missing email");
    });

    test("Inserting user object without phone number should throw error", () => {
      const user = {
        name: "test",
        email: "smth@gmail.com",
        bio: "desc",
      };
      expect(() => addUser(user)).toThrow("Missing phone");
    });

    test("Inserting user object with bad email format should throw error", () => {
      const user = {
        name: "test",
        email: "smtgmail.com",
        phone: "1234567890",
        bio: "desc",
      };
      expect(() => addUser(user)).toThrow("Bad email format");
    });

    test("Valid art object insertion should succeed", async () => {
      const user = {
        name: "test",
        email: "smth@gmail.com",
        phone: "1234567890",
        bio: "desc",
      };
      await expect(addUser(user)).resolves.toBeDefined();
    });
  });

  describe("getUsers tests", () => {
    test("getUsers: Valid with no parameters should succeed", async () => {
      await expect(getUsers()).resolves.toBeDefined();
    });
    test("Valid with no parameters should succeed", async () => {
      await expect(getUsers()).resolves.toBeDefined();
    });
  });

  describe("findUserById tests", () => {
    test("findUserById goes through with empty id", async () => {
      let id;
      await expect(findUserById(id)).resolves.toBeDefined();
    });
    test("findUserById goes through with valid id", async () => {
      let id = "test";
      await expect(findUserById(id)).resolves.toBeDefined();
    });
  });

  describe("findUserByEmail tests", () => {
    test("findUserByEmail goes through with empty email", async () => {
      let email;
      await expect(findUserByEmail(email)).resolves.toBeDefined();
    });
    test("findUserByEmail goes through with valid email", async () => {
      let email = "test@gmail.com";
      await expect(findUserByEmail(email)).resolves.toBeDefined();
    });
  });

  describe("updateUserArt tests", () => {
    test("updateUserArt goes through with empty id", async () => {
      let id;
      let owner = "owner";
      await expect(updateUserArt(id, owner)).resolves.toBeDefined();
    });
    test("updateUserArt goes through with valid id and owner", async () => {
      let id = "tester";
      let owner = "owner";
      await expect(updateUserArt(id, owner)).resolves.toBeDefined();
    });
    test("updateUserArt goes through with empty owner", async () => {
      let id = "tester";
      let owner;
      await expect(updateUserArt(id, owner)).resolves.toBeDefined();
    });
  });

  describe("deleteUser tests", () => {
    test("deletingUser call goes through with empty id", async () => {
      let id;
      await expect(deleteUser(id)).resolves.toBeDefined();
    });

    test("deleteUser call goes through with id", async () => {
      let id = "tester";
      await expect(deleteUser(id)).resolves.toBeDefined();
    });
  });

  describe("findUserByLogin tests", () => {
    test("findUserByLogin call goes through with empty email", async () => {
      let email;
      await expect(findUserForLogin(email)).resolves.toBeDefined();
    });

    test("findUserByLogin call goes through with email", async () => {
      let email = "tester@gmail.com";
      await expect(findUserForLogin(email)).resolves.toBeDefined();
    });
  });

  describe("findUserByName tests", () => {
    test("findUserByLogin call goes through with empty name", async () => {
      let name;
      await expect(findUserByName(name)).resolves.toBeDefined();
    });

    test("findUserByLogin call goes through with name", async () => {
      let name = "tester";
      await expect(findUserByName(name)).resolves.toBeDefined();
    });
  });
  describe("updateUserById tests", () => {
    test("updateUserById call goes through with empty email", async () => {
      let id;
      const user = {
        name: "test",
        email: "smth@gmail.com",
        phone: "1234567890",
        bio: "desc",
      };
      await expect(updateUserById(id, user)).resolves.toBeDefined();
    });

    test("updateUserById call goes through with id and object", async () => {
      let id;
      const user = {
        name: "test",
        email: "smth@gmail.com",
        phone: "1234567890",
        bio: "desc",
      };
      await expect(updateUserById(id, user)).resolves.toBeDefined();
    });

    test("updateUserById call goes through with null id and object", async () => {
      let id;
      let user;
      await expect(updateUserById(id, user)).resolves.toBeDefined();
    });
  });
  describe("unsaveArt tests", () => {
    test("unsaveArt call fails with empty user and art id", async () => {
      let uid;
      let artId;
      expect(() => unsaveArt(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });

    test("unsaveArt call goes through with uid and art id", async () => {
      let uid = "test";
      let artId = "test";
      await expect(unsaveArt(uid, artId)).resolves.toBeDefined();
    });

    test("unsaveArt call fails with null uid", async () => {
      let uid;
      let artId = "test";
      expect(() => unsaveArt(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });
    test("unsaveArt call fails with null art id", async () => {
      let uid = "test";
      let artId;
      expect(() => unsaveArt(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });
  });
  describe("removeArtFromUser tests", () => {
    test("removeArtFromUser call fails with empty user and art id", async () => {
      let uid;
      let artId;
      expect(() => removeArtFromUser(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });

    test("removeArtFromUser call goes through with uid and art id", async () => {
      let uid = "test";
      let artId = "test";
      await expect(removeArtFromUser(uid, artId)).resolves.toBeDefined();
    });

    test("removeArtFromUser call fails with null uid", async () => {
      let uid;
      let artId = "test";
      expect(() => removeArtFromUser(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });
    test("removeArtFromUser call fails with null art id", async () => {
      let uid = "test";
      let artId;
      expect(() => removeArtFromUser(uid, artId)).toThrow(
        "userId and artId are required"
      );
    });
  });
});
