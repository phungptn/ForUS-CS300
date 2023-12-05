const express = require('express');
const boxController = require('../controller/box');
const threadController = require('../controller/thread');
const router = express.Router();

router.get('/:box_id', boxController.read);
router.post('/:box_id/thread', threadController.create);
router.put('/:box_id', /*isAdmin*/ boxController.update);
router.delete('/:box_id', /*isAdmin*/ boxController.delete);

export default router;