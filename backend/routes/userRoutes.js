// userRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, addUser, getUsersByRole, deleteUser } = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', addUser);
router.get('/:role', getUsersByRole);
router.delete('/:id', deleteUser);

module.exports = router;
