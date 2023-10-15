const express = require('express');
const router = express.Router();
const v1BookController = require("../../../controller/Api/v1");

router.post('/', v1BookController.createBook);
module.exports = router;