const express = require('express')
const router = express.Router()
const {getTeams, createTeam, deleteTeam} = require('../controllers/teamController')

router.get('/', getTeams)
router.post('/', createTeam)
router.delete('/:id', deleteTeam)

module.exports = router;
