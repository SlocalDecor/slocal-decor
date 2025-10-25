import mongoose from "mongoose";

const ArtSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    postedTime: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: 250,
    },
    measurements: {
      height: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
        required: true,
      },
    },
    picture: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sold", "not sold"],
      required: true,
      default: "not sold",
    },
    artType: {
      type: String,
      enum: [
        "poster",
        "painting",
        "sculpture",
        "furniture",
        "wall art",
        "other",
      ],
    },
  },
  { collection: "arts" }
);

const Art = mongoose.model("Art", ArtSchema);

export default Art;
