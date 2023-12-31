const express = require('express');
const { searchQuery } = require('../controllers/search');
const router = express.Router();

router.get('/:page', searchQuery);

module.exports = router;