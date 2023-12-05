const express = require('express');
const groupController = require('../controllers/group');
const boxController = require('../controllers/box');
const router = express.Router();

router.get('/', groupController.read);
router.post('/:group_id/box', /*isAdmin*/ boxController.create);
router.put('/:group_id', /*isAdmin*/ groupController.update);
router.delete('/:group_id', /*isAdmin*/ groupController.delete);

export default router;