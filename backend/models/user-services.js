import mongoose from "mongoose";
import userModel from "./user.js";
import artModel from "./art.js";

function addUser(user) {
  if (!user["name"] || user["name"] === "") {
    throw new Error("Missing name");
  }
  if (!user["email"] || user["email"] === "") {
    throw new Error("Missing email");
  }
  if (!user["phone"] || user["phone"] === "") {
    throw new Error("Missing phone");
  }
  if (!/.+@.+\..+/.test(user["email"])) {
    throw new Error("Bad email format");
  }
  const userToAdd = new userModel(user);
  const promise = userToAdd.save();
  return promise;
}

function deleteUser(userId) {
  const deleteArts = artModel.deleteMany({ owner: userId });
  const deleteUser = userModel.findByIdAndDelete(userId);
  const promise = Promise.all([deleteArts, deleteUser]);
  return promise;
}

function findUserById(userId) {
  const user = userModel.find({ _id: userId });
  const promise = Promise.all([user]);
  return promise;
}

function findUserForLogin(email) {
  const user = userModel.findOne({ email: email }).select("+passwordHash");
  const promise = Promise.all([user]);
  return promise;
}

function findUserByEmail(email) {
  const user = userModel.findOne({ email: email });
  const promise = Promise.all([user]);
  return promise;
}

function findUserByName(name) {
  const user = userModel.findOne({ name: name });
  const promise = Promise.all([user]);
  return promise;
}

function updateUserById(userId, updateObj) {
  const updatedUser = userModel.findByIdAndUpdate(userId, updateObj, {
    new: true,
  });
  const promise = Promise.all([updatedUser]);
  return promise;
}

function updateUserArt(newArtId, owner) {
  const updatedUser = userModel.findByIdAndUpdate(
    owner,
    { $push: { postedArt: newArtId } },
    { new: true }
  );
  const promise = Promise.all([updatedUser]);
  return promise;
}

function getUsers() {
  const users = userModel.find({});
  const promise = Promise.all([users]);
  return promise;
}

function removeArtFromUser(userId, artId) {
  if (!userId || !artId) {
    throw new Error("userId and artId are required");
  }
  const updatedUser = userModel.findByIdAndUpdate(
    userId,
    { $pull: { postedArt: artId } },
    { new: true }
  );
  const promise = Promise.all([updatedUser]);
  return promise;
}

function unsaveArt(userId, artId) {
  if (!userId || !artId) {
    throw new Error("userId and artId are required");
  }
  const updatedUser = userModel.findByIdAndUpdate(
    userId,
    { $pull: { savedArt: artId } },
    { new: true }
  );
  const promise = Promise.all([updatedUser]);
  return promise;
}

export default {
  addUser,
  deleteUser,
  findUserById,
  findUserForLogin,
  getUsers,
  removeArtFromUser,
  unsaveArt,
  updateUserArt,
  findUserByEmail,
  findUserByName,
  updateUserById,
};
