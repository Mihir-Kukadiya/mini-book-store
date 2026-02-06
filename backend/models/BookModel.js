import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Devotional",
        "Self Help",
        "Spiritual",
        "Religious",
        "Education",
        "Technology",
        "Biography",
      ],
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Book", bookSchema);
