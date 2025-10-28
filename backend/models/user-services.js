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

export default {
  addUser,
};
