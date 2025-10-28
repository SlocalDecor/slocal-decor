import mongoose from "mongoose";
import dotenv from "dotenv";
import userModel from "./user.js";
dotenv.config();

mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGO_URI, {})
  .catch((error) => console.log(error));

function addUser(user) {
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function deleteUser(userId) {
  const deleteArts = artModel.deleteMany({ owner: userId });
  const deleteUser = User.findByIdAndDelete(userId);
  const promise = Promise.all([deleteArts, deleteUser]);
  return promise;
}

export default {
  addUser,
  deleteUser,
};
