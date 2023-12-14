const express = require('express');
import { readBox, updateBox, deleteBox } from '../controllers/box';
import { createThread } from '../controllers/thread';
import { isAdmin } from '../controllers/user';
const router = express.Router();

router.get('/:box_id', readBox);
router.post('/:box_id/thread', /*isBanned*/ createThread);
router.put('/:box_id', isAdmin, updateBox);
router.delete('/:box_id', isAdmin, deleteBox);

module.exports = router;