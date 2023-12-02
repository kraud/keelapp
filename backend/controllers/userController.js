const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const mongoose = require('mongoose')
const Word = require("../models/wordModel");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, username, password } = req.body

    if(!name || !email || !username || !password){
       res.status(400)
       throw new Error('Please add all fields')
    }

    const emailExists = await User.findOne({email: email})
    const usernameExists = await User.findOne({username: username})

    if(emailExists){
        res.status(400)
        throw new Error('Email already in use')
    }

    if(usernameExists){
        res.status(400)
        throw new Error('Username already in use')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        name,
        email,
        username,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    {/* TODO: should this also allow login in with username? */}
    const user = await User.findOne({email: email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc    Change an existing user's data
// @route   PUT /api/users/updateUser
// @access  Public
const updateUser = asyncHandler(async(req, res) => {
    const {email, name, username} = req.body

    const userData = await User.findOne({email: email})
    if(userData.id === req.user.id){
        const updatedUser = await User.findByIdAndUpdate(userData.id,{
            name: name,
            username: username,
        },{new: true}).select({ password: 0, createdAt: 0 , updatedAt: 0, __v: 0 })
        res.status(200).json(updatedUser)
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc    Get currently logged-in user data
// @route   POST /api/users/me
// @access  Private
const getMe = asyncHandler(async(req, res) => {
    res.status(200).json(req.user)
})

// @desc    Get user data
// @route   POST /api/users/me
// @access  Private
const getUsersBy = asyncHandler(async(req, res) => {
    if (!(req.query)) {
        res.status(400)
        throw new Error("Missing search query text")
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    await User.find({
        $or: [
            {
                "name": {$regex: `${req.query.query}`, $options: "i"},
            },
            {
                "username": {$regex: `${req.query.query}`, $options: "i"},
            },
        ]
    }).then((data) => {
        if (data) {
            let simpleResults = []
            data.forEach((user) => {
                simpleResults.push({
                    id: user._id,
                    type: "user",
                    label: user.name,
                    username: user.username,
                    email: user.email,
                })
            })
            simpleResults.sort((a, b) => a.label.localeCompare(b.label))
            res.status(200).json(simpleResults)
        } else {
            res.status(404).json({
                text: "No user matches for this search",
                error: err
            })
        }
    })
})

// @desc    Get User
// @route   GET /api/users
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user){
        res.status(400)
        throw new Error("User not found")
    }

    // Check for user
    if(!req.user){
        res.status(401)
        throw new Error('Logged in user not found')
    }

    res.status(200).json(user)
})

// @desc    Get user data
// @route   POST /api/users/me
// @access  Private
const getUsernamesBy = asyncHandler(async(req, res) => {
    if (!(req.query)) {
        res.status(400)
        throw new Error("Missing search query array")
    }

    // Check for user
    if (!req.user) {
        res.status(401)
        throw new Error('User not found')
    }

    let ids = req.query.query
    let objectIds = []

    // if we convert them into ObjectId instead of using simply string, we take advantage of indexation (should be faster)
    ids.forEach(function(item){
        objectIds.push(mongoose.Types.ObjectId(item));
    })

    await User.find({ _id: {$in : objectIds}}).then((data) => {
        if (data) {
            let results = []
            data.forEach((user) => {
                results.push({
                    id: user._id,
                    type: "user",
                    label: user.name,
                    username: user.username,
                    email: user.email,
                })
            })
            // TODO: return in the same order as it came in the request?
            // results.sort((a, b) => a.label.localeCompare(b.label))
            res.status(200).json(results)
        } else {
            res.status(404).json({
                text: "No user matches for this search",
                error: err
            })
        }
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getUsersBy,
    updateUser,
    getUsernamesBy,
    getUserById
}