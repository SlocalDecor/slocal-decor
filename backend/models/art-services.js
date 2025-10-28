import mongoose from "mongoose";
import dotenv from "dotenv";
import artModel from "./art.js";
dotenv.config();

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_URI, {})
  .catch((error) => console.log(error));

function addArt(art) {
  const artToAdd = new artModel(art);
  const promise = artToAdd.save();
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
  return artModel.find({ owner: ownerId });
}

function findArtByType(type) {
  return artModel.find({ artType: type });
}

export default {
  addArt,
  deleteArt,
  getArt,
};
