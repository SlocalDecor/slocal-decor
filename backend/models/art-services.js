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

export default {
  addArt,
  deleteArt,
};
