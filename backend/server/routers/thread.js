const express = require('express');
import { readThread, updateThread, deleteThread, upvoteThread, downvoteThread } from '../controllers/thread';
const router = express.Router();

router.get('/:thread_id', readThread);
router.update('/:thread_id', /*isBanned*/ updateThread);
router.put('/:thread_id/upvote', /*isBanned*/ upvoteThread);
router.put('/:thread_id/downvote', /*isBanned*/ downvoteThread);
router.delete('/:thread_id', /*isAdmin, isUser*/ deleteThread);