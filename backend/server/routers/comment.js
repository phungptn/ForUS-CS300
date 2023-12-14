const express = require('express');
const { createComment, updateComment, deleteComment, upvoteComment, downvoteComment } = require('../controllers/comment');

const router = express.Router();

router.post('/:thread_id', createComment);
router.put('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);
router.put('/:comment_id/upvote', upvoteComment);
router.put('/:comment_id/downvote', downvoteComment);

module.exports = router;