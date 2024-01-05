const express = require('express');
const { readThread, updateThread, deleteThread, upvoteThread, downvoteThread, isUpdater, isDeleter, isBanned } = require('../controllers/thread');
const { createComment } = require('../controllers/comment');
const router = express.Router();

router.get('/:thread_id', readThread);
router.post('/:thread_id/comment', createComment);
router.get('/:thread_id/:page', readThread);
router.put('/:thread_id', isUpdater, updateThread);
router.put('/:thread_id/upvote', upvoteThread);
router.put('/:thread_id/downvote', downvoteThread);
router.delete('/:thread_id', isDeleter, deleteThread);

module.exports = router;