const express = require('express');
const router = express.Router();
const {getNotificationRules, deleteNotificationRule} = require('../controllers/notificationController');
const {getNotifications,getNotificationByProjectId, addNotificationRule} = require('../controllers/notificationController');

router.get('/', getNotifications)
router.get('/:projectId/project', getNotificationByProjectId)
router.get('/', getNotifications)   
router.get('/rules', getNotificationRules);
router.post('/rules', addNotificationRule);
router.delete('/rules/:id', deleteNotificationRule);

module.exports = router;