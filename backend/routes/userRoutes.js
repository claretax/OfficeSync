const express = require('express')
const router = express.Router()
const { getClients } = require('../controllers/userController')

router.get('/clients', getClients)

module.exports = router
