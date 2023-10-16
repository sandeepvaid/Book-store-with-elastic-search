const BookModel = require("../../../models/bookModel");
const esClient = require("../../../config/elastic-search");

const getAllBooks = async (req, res) => {
    try {
        const books = await BookModel.find(); // Retrieve all books from MongoDB

        return res.status(200).json({ books, success: true });
    } catch (err) {
        console.error('MongoDB Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

const getBookById = async (req, res) => {
    const bookId = req.params.id;
    try {
        const book = await BookModel.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found.', success: false });
        }
        return res.status(200).json({ book, success: true });
    } catch (err) {
        console.error('MongoDB Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

const deleteBookById = async (req, res) => {
    const bookId = req.params.id;

    try {
        const deletedBook = await BookModel.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found.', success: false });
        }
        try {
            const response = await esClient.esClient.delete({
              index: 'books',
              id: bookId.toString()
            });
            return res.json({ message: 'Document deleted successfully from elastic search' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error deleting document' });
          }


        return res.status(200).json({ message: 'Book deleted successfully.', success: true });
    } catch (err) {
        console.error('MongoDB Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, publicationYear, isbn, description } = req.body;
        const newBook = new BookModel(req.body);
        await newBook.save();
        try {
            await esClient.esClient.index({
                index: 'books',
                id: newBook._id.toString(),
                body: {
                    title,
                    author,
                    publicationYear,
                    isbn,
                    description,
                }
            });
        } catch (esError) {
            console.error('Elasticsearch Error:', esError.message);
        }

        return res.status(201).json({ message: 'Book data stored successfully.', success: true });
    } catch (err) {
        if (err.code === 11000) {
            console.error('MongoDB Duplication Error:', err.message);
            return res.status(400).json({ error: 'Book already exists.', success: false });
        }
        console.error('MongoDB Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

const updateBookById = async (req, res) => {
    const bookId = req.params.id;
    const { author, title, description } = req.body;

    try {
        const updatedBook = await BookModel.findByIdAndUpdate(
            bookId,
            { author, title, description },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found.', success: false });
        }

        try {
            await esClient.esClient.update({
                index: 'books',
                id:bookId,
                body: {
                    doc:{
                        title,
                        author,
                        description
                    }
                },
              });
        } catch (esError) {
            console.error('Elasticsearch Error:', esError);
        }
        return res.status(200).json({ message: 'Book updated successfully.',Book:updatedBook, success: true });
    } catch (err) {
        console.error('MongoDB Error:', err.message);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};

const searchBooks = async (req, res) => {
    const { query } = req.query;
    console.log(query)
    try {
        const { body } = await esClient.esClient.search({
            index: 'books',
            body: {
                query: {
                    multi_match: {
                        query,
                        fields: ['title', 'author', 'description']
                    }
                }
            }
        });

        const searchResults = body.hits.hits.map(hit => hit._source);

        return res.status(200).json({ results: searchResults, success: true });
    } catch (esError) {
        console.error('Elasticsearch Error:', esError);
        return res.status(500).json({ error: 'Internal Server Error', success: false });
    }
};


module.exports = {
    createBook,getAllBooks,getBookById,deleteBookById,updateBookById,searchBooks
};
