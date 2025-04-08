const express = require('express');
const router = express.Router();
const { createMessage, getMessages, getPendingMessages, 
    updateMessageStatus, getAggregatedStats, 
    getMobileStats } = require('../controllers/messageController');

router.post('/', createMessage);
router.get('/', getMessages);
router.get('/pending', getPendingMessages);
router.put('/update/:id', updateMessageStatus);
router.get('/stats', getAggregatedStats);
router.get('/mobile-stats', getMobileStats);

module.exports = router;