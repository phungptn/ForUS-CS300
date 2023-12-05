const express = require('express');
const threadController = require('../controllers/thread');
const router = express.Router();

router.get('/:thread_id', threadController.read);
router.put('/:thread_id/upvote', /*isAdmin*/ threadController.upvote);
router.put('/:thread_id/downvote', /*isAdmin*/ threadController.upvote);