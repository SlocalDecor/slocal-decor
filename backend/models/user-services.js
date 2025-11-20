import mongoose from "mongoose";
import userModel from "./user.js";
import artModel from "./art.js";

function addUser(user) {
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

function getUsers() {
  const users = userModel.find({});
  const promise = Promise.all([users]);
  return promise;
}

export default {
  addUser,
  deleteUser,
  findUserById,
  findUserForLogin,
  getUsers,
};
