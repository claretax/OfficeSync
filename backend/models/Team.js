const mongoose = require('mongoose')

const teamSchema = mongoose.Schema({
    name:{
        type:String,
        default: 'New Team'
    },
    teamLeader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    teamMembers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
})

const Team = mongoose.model('Team', teamSchema)

module.exports = Team;
