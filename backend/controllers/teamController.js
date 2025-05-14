const Team = require('../models/Team')

const getTeams = async (req, res)=>{
    try{
        const teams = await Team.find({})
        res.status(200).json(teams)
    }
    catch(err){
        console.log('error occurred')
        res.status(500).json({error:'internal server error'})
    }
}
const createTeam = async(req, res)=>{
    const {name='New Team', teamLeader, teamMembers } = req.body
    try{
        const team = new Team({name, teamLeader, teamMembers})
        await team.save()
        res.status(200).json(team)
    }catch(error){
        res.status(5000).json({error:"Internal server error"})
    }
}
const deleteTeam = async (req, res) => {
    const { id } = req.params
    try {
        const deletedTeam = await Team.findByIdAndDelete(id)
        if (!deletedTeam) {
            return res.status(404).json({ error: "Team not found" })
        }
        res.status(200).json(deletedTeam)
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
}



module.exports = {getTeams, createTeam, deleteTeam}
