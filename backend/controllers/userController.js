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
        const existingUser = await User.findOne({$or:[{email}, {phone}]})
        if(existingUser){
            return res.status(400).json({error:"User already exists"})
        }
        const newUser = new User({
            name,
            email,
            phone,
            role
        })
        const user = await newUser.save();
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
//delete a user
const deleteUser = async (req, res) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).json({error:"User not found"})
        }
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports = {getUsers, addUser, getUsersByRole, deleteUser}