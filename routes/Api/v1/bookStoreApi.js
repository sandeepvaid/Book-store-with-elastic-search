const express = require('express');
const router = express.Router();
const v1BookController = require("../../../controller/Api/v1");

router.get('/search', v1BookController.searchBooks);
router.post('/', v1BookController.createBook);
router.get('/', v1BookController.getAllBooks);
router.get('/:id', v1BookController.getBookById);
router.delete('/:id', v1BookController.deleteBookById);
router.put("/:id",v1BookController.updateBookById);

module.exports = router;