const User = require('../models/User')

const getClients = async (req, res) =>{
    try {
        const user = await User.find({role: "client"})
        if(!user){
            return res.status(404).json({error:"Clients not found"})
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {getClients}