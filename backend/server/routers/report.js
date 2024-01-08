const { readReports, sendReportToAdmins, resolveReport, viewReport, getAllReports } = require('../controllers/notification');
const { isAdmin } = require('../controllers/user');
const express = require('express');

const router = express.Router();

router.get('/:limit', isAdmin, readReports);
router.post('/', sendReportToAdmins);
router.put('/:report_id', isAdmin, resolveReport);
router.get('/:report_id', isAdmin, viewReport);

module.exports = router;