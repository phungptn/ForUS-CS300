const express = require('express');
import { readThread, updateThread, deleteThread, upvoteThread, downvoteThread } from '../controllers/thread';
import { isAdmin } from '../controllers/user';
const router = express.Router();

router.get('/:thread_id', readThread);
router.update('/:thread_id', /*isBanned*/ updateThread);
router.put('/:thread_id/upvote', upvoteThread);
router.put('/:thread_id/downvote', downvoteThread);
router.delete('/:thread_id', deleteThread);

export default router;