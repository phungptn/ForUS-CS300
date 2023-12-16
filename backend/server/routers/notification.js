const { 
    sendNotificationToUsers, 
    deleteAllInboxNotifications, 
    deleteInboxNotification,
    updateInboxNotificationStatus,
    updateAllInboxNotificationStatus
} = require('../controllers/notification');
const { isAdmin } = require('../controllers/user');
const express = require('express');

const router = express.Router();

router.post('/', isAdmin, sendNotificationToUsers);
router.delete('/', deleteAllInboxNotifications);
router.delete('/:notification_id', deleteInboxNotification);
router.put('/', updateAllInboxNotificationStatus);
router.put('/:notification_id', updateInboxNotificationStatus);

module.exports = router;