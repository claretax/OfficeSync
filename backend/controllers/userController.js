const User = require('../models/User')

const getUsers = async (req, res) =>{
    try {
        const user = await User.find({})
        if(!user){
            return res.status(404).json({error:"Clients not found"})
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
    }
}

const addUser = async (req, res) =>{
    try {
        const {name, email, phone, role} = req.body;
        if(!name || !email || !phone, !role){
            return res.status(400).json({error:"All fields are required"})
        }
        const user = await User.create({name, email, phone, role})
        res.status(201).json(user);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
    }
}

//Get a user by role
const getUsersByRole = async (req, res) =>{
    try {
        const user = await User.find({role:req.params.role})
        if(!user){
            return res.status(404).json({error:"Clients not found"})
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {getUsers, addUser, getUsersByRole}