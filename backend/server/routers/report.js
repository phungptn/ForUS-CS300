const { readReports, sendReportToAdmins, resolveReport } = require('../controllers/notification');
const { isAdmin } = require('../controllers/user');
const express = require('express');

const router = express.Router();

router.get('/:limit', isAdmin, readReports);
router.post('/', sendReportToAdmins);
router.put('/:report_id', isAdmin, resolveReport);

module.exports = router;