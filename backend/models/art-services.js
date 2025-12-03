import mongoose from "mongoose";
import dotenv from "dotenv";
import artModel from "./art.js";

function addArt(art) {
  if (!art["title"] || art["title"] === "") {
    throw new Error("Missing title");
  }
  if (!art["owner"] || art["owner"] === "") {
    console.log("Missing owner field");
    throw new Error("Missing owner field");
  }
  const owner = art["owner"];
  if (!art["picture"] || art["picture"] === "") {
    throw new Error("Missing picture");
  }
  if (
    !art["measurements"] ||
    !art["measurements"]["height"] ||
    !art["measurements"]["width"]
  ) {
    throw new Error("Missing measurements");
  }
  const newArt = new artModel(art);
  const promise = newArt.save();
  return promise;
}
function deleteArt(id) {
  const promise = artModel.findByIdAndDelete(id);
  return promise;
}

function getArt(owner, type) {
  let promise;
  if (owner === undefined && type === undefined) {
    promise = artModel.find();
  } else if (type === undefined) {
    promise = findArtByOwner(owner);
  } else {
    promise = findArtByType(type);
  }
  return promise;
}

function findArtByOwner(ownerId) {
  if (typeof ownerId !== "string") {
    throw new Error("owner id not valid");
  }
  return artModel.find({ owner: ownerId });
}

function findArtById(id) {
  return artModel.findById(id);
}

function updateOwner(id, newOwner) {
  return artModel.findByIdAndUpdate(
    id,
    { owner: newOwner, status: "claimed" },
    { new: true }
  );
}

function findArtByType(type) {
  const validTypes = [
    "poster",
    "painting",
    "sculpture",
    "furniture",
    "wall art",
    "other",
  ];
  if (typeof type !== "string" || !validTypes.includes(type)) {
    throw new Error("invalid type");
  }
  return artModel.find({ artType: type });
}

export default {
  addArt,
  deleteArt,
  getArt,
  findArtById,
  updateOwner,
};
