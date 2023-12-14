const express = require('express');
const { createGroup, readGroup, updateGroup, deleteGroup } = require('../controllers/group');
const { createBox } = require('../controllers/box');
const { isAdmin } = require('../controllers/user');
const router = express.Router();

router.get('/', readGroup);
router.post('/', isAdmin, createGroup);
router.post('/:group_id/box', isAdmin, createBox);
router.put('/:group_id', isAdmin, updateGroup);
router.delete('/:group_id', isAdmin, deleteGroup);

module.exports = router;