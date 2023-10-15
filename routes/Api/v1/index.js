const express = require('express');
const router = express.Router();

router.use('/book',require('./bookStoreApi'));

module.exports = router;