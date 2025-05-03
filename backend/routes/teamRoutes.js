const express = require('express')
const router = express.Router()
const {getTeams, createTeam} = require('../controllers/teamController')

router.get('/', getTeams)
router.post('/', createTeam)

module.exports = router;
