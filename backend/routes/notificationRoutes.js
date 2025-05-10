const express = require('express');
const router = express.Router();
const {getNotificationRules, deleteNotificationRule} = require('../controllers/notificationController');
const {addNotificationRule} = require('../controllers/notificationController');

router.get('/rules', getNotificationRules);
router.post('/rules', addNotificationRule);
router.delete('/rules/:id', deleteNotificationRule);

module.exports = router;