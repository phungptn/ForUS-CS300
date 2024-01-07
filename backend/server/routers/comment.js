const express = require('express');
const { updateComment, readComment, deleteComment, upvoteComment, downvoteComment } = require('../controllers/comment');
const router = express.Router();

router.get('/:comment_id', readComment);
router.put('/:comment_id', updateComment);
router.delete('/:comment_id', deleteComment);
router.put('/:comment_id/upvote', upvoteComment);
router.put('/:comment_id/downvote', downvoteComment);

module.exports = router;