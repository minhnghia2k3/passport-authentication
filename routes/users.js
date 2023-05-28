const express = require('express')
const router = express.Router()
const bycrypt = require('bcryptjs')
const passport = require('passport')
const { getLogin, getRegister, postRegisterHandler, postLoginHandler, getLogout } = require('../controllers/usersController')


// User model
const User = require('../models/User')

// Login

router.get('/login', getLogin)

// Register

router.get('/register', getRegister)

// Register POST Handle

router.post('/register', postRegisterHandler);

// Login handle
router.post('/login', postLoginHandler)

// Logout handle
router.get('/logout', getLogout)

module.exports = router;