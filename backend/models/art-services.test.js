// only unit test functions that actually do validation
import * as artModel from "./art.js";
import { jest } from "@jest/globals";

jest.unstable_mockModule("./art.js", () => {
  const mSave = jest.fn().mockResolvedValue("mocked save");
  const mArt = jest.fn().mockImplementation(() => ({
    save: mSave,
  }));

  mArt.findById = jest
    .fn()
    .mockResolvedValue({ _id: "123", name: "Mocked User" });
  mArt.find = jest.fn().mockResolvedValue({
    _id: "123",
    name: "Mocked User",
    owner: "yo",
    type: "painting",
  });
  mArt.findByIdAndDelete = jest.fn().mockResolvedValue({ success: true });

  return {
    __esModule: true,
    default: mArt,
  };
});
let addArt;
let getArt;
let deleteArt;
let findArtById;

beforeAll(async () => {
  const artServices = await import("./art-services.js");
  addArt = artServices.default.addArt;
  getArt = artServices.default.getArt;
  deleteArt = artServices.default.deleteArt;
  findArtById = artServices.default.findArtById;
});

describe("artService tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addArt tests", () => {
    test("Inserting empty art object should throw error", () => {
      const art = {};
      expect(() => addArt(art)).toThrow("Missing title");
    });

    test("Inserting empty art object without owner should throw error", () => {
      const art = {
        title: "test",
        measurements: { height: 30, width: 40 },
        picture: "url",
      };
      expect(() => addArt(art)).toThrow("Missing owner field");
    });

    test("Inserting empty art object without picture url should throw error", () => {
      const art = {
        title: "test",
        owner: "tester",
        measurements: { height: 30, width: 40 },
      };
      expect(() => addArt(art)).toThrow("Missing picture");
    });

    test("Inserting empty art object without dimensions should throw error", () => {
      const art = { title: "test", owner: "tester", picture: "url" };
      expect(() => addArt(art)).toThrow("Missing measurements");
    });

    test("Valid art object insertion should succeed", async () => {
      const art = {
        title: "test",
        owner: "tester",
        picture: "url",
        measurements: { height: 30, width: 40 },
      };
      await expect(addArt(art)).resolves.toBeDefined();
    });
  });

  describe("getArt tests", () => {
    test("undefined owner and type results in succesful response", async () => {
      let owner;
      let type;
      await expect(getArt(owner, type)).resolves.toBeDefined();
    });

    test("Inserting invalid owner results in error", () => {
      const owner = 34;
      let type;
      expect(() => getArt(owner, type)).toThrow("owner id not valid");
    });

    test("Inserting invalid type results in error", () => {
      let owner;
      const type = 34;
      expect(() => getArt(owner, type)).toThrow("invalid type");
    });

    test("Inserting invalid type results in error", () => {
      let owner;
      const type = "yyooohoo";
      expect(() => getArt(owner, type)).toThrow("invalid type");
    });

    test("Valid owner and type should succeed", async () => {
      const owner = "sally";
      const type = "poster";
      await expect(getArt(owner, type)).resolves.toBeDefined();
    });

    test("Valid owner should succeed", async () => {
      const owner = "sally";
      let type;
      await expect(getArt(owner, type)).resolves.toBeDefined();
    });

    test("Valid type should succeed", async () => {
      let owner;
      const type = "poster";
      await expect(getArt(owner, type)).resolves.toBeDefined();
    });
  });

  describe("deleteArt tests", () => {
    test("deletingArt call goes through with empty id", async () => {
      let id;
      await expect(deleteArt(id)).resolves.toBeDefined();
    });

    test("deletingArt call goes through with  id", async () => {
      let id = "tester";
      await expect(deleteArt(id)).resolves.toBeDefined();
    });
  });

  describe("findArtById tests", () => {
    test("findArt call goes through with empty id", async () => {
      let id;
      await expect(findArtById(id)).resolves.toBeDefined();
    });

    test("findArt call goes through with id", async () => {
      let id = "tester";
      await expect(findArtById(id)).resolves.toBeDefined();
    });
  });
});
