const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true, 
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//now we create a model for it
const Book = mongoose.model("BookStore", bookSchema);
module.exports = Book;
