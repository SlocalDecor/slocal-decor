// models/user-services.js
import userModel from "./user.js";
import artModel from "./art.js";

function addUser(user) {
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

function deleteUser(userId) {
  const deleteArts = artModel.deleteMany({ owner: userId });
  const deleteUser = userModel.findByIdAndDelete(userId);
  return Promise.all([deleteArts, deleteUser]);
}

function findUserById(userId) {
  return userModel.findById(userId);
}

function findUserForLogin(email) {
  return userModel.findOne({ email }).select("+passwordHash");
}

function getUsers() {
  return userModel.find({});
}

export default {
  addUser,
  deleteUser,
  findUserById,
  findUserForLogin,
  getUsers,
};
