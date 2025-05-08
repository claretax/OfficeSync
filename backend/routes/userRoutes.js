// userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, addUser, getUsersByRole } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:role', getUsersByRole);

module.exports = router;
