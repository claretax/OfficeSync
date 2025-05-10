const express = require('express');
const router = express.Router();
const {getNotificationRules} = require('../controllers/notificationController');
const {addNotificationRule} = require('../controllers/notificationController');

router.get('/rules', getNotificationRules);
router.post('/rules', addNotificationRule);

module.exports = router;