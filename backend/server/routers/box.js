const express = require('express');
const { readBox, updateBox, deleteBox } = require('../controllers/box');
const { createThread } = require('../controllers/thread');
const { isAdmin } = require('../controllers/user');
const router = express.Router();

router.get('/:box_id', readBox);
router.post('/:box_id/thread', /*isBanned*/ createThread);
router.put('/:box_id', isAdmin, updateBox);
router.delete('/:box_id', isAdmin, deleteBox);

module.exports = router;