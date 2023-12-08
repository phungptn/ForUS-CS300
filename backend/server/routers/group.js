const express = require('express');
import { readGroup, updateGroup, deleteGroup } from '../controllers/group';
import { createBox } from '../controllers/box';
import { isAdmin } from '../controllers/user';
const router = express.Router();

router.get('/', readGroup);
router.post('/:group_id/box', isAdmin, createBox);
router.put('/:group_id', isAdmin, updateGroup);
router.delete('/:group_id', isAdmin, deleteGroup);

export default router;