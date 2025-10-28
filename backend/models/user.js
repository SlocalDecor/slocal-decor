import mongoose from "mongoose";
import Art from "./art.js";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 250,
    },
    profilePic: {
      type: String,
    },
    postedArt: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: Art,
        },
      ],
      default: [],
    },
  },
  { collection: "users" }
);

const User = mongoose.model("User", UserSchema);

export default User;
