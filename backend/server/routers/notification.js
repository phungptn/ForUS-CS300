const { 
    sendNotificationToUsers, 
    deleteAllInboxNotifications, 
    deleteInboxNotification,
    updateInboxNotificationStatus,
    updateAllInboxNotificationStatus,
    commentNotification
} = require('../controllers/notification');
const { isAdmin } = require('../controllers/user');
const express = require('express');

const router = express.Router();

router.post('/admin', isAdmin, sendNotificationToUsers);
router.delete('/', deleteAllInboxNotifications);
router.delete('/:notification_id', deleteInboxNotification);
router.put('/', updateAllInboxNotificationStatus);
router.put('/:notification_id', updateInboxNotificationStatus);
router.post('/comment', commentNotification);

module.exports = router;