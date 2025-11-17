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
  mArt.find = jest
    .fn()
    .mockResolvedValue({
      _id: "123",
      name: "Mocked User",
      owner: "yo",
      type: "painting",
    });
  mArt.findByIdAndDelete = jest.fn();

  return {
    __esModule: true,
    default: mArt,
  };
});
const artServices = await import("./art-services.js"); // this is causing a lint error but we need it for the tests to actually run
const addArt = artServices.default.addArt;
const getArt = artServices.default.getArt;

describe("artServe tests", () => {
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
  });
});
