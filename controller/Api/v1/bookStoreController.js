const userDB = require("../../../models/bookModel");

const createBook = async (req, res) => {
    try{
        const {title,author,publicationYear,isbn,description} = req.body;
        console.log(title,author,publicationYear,isbn);
        return res.json({
            message:"Book is created successfully",
            success: true
        })
    }catch(err){
        return res.json({
            message:"Book is not created",
            success:false
        })
    }
}

module.exports = {
    createBook
};
