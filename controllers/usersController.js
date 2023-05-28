const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const getLogin = (req, res) => {
    res.render('login')
}

const getRegister = (req, res) => {
    res.render('register')
}

const postRegisterHandler = (req, res) => {
    let { name, email, password, password2 } = req.body
    let errors = []

    // Check required fields
    if (!name, !email, !password, !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }

    // Check passwords length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' })
    }

    // Check if there are any errors
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed

        // Check email exists?
        User.findOne({ email: email })
            .then(async user => {

                // If email exists
                if (user) {
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    // Create a new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash;
                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/users/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })


                }



            })
    }
}

const postLoginHandler = (req, res) => {
    passport.authenticate('local', {
        failureRedirect: '/users/login',
        successRedirect: '/dashboard',
        failureFlash: true,
    })(req, res)
}

const getLogout = (req, res) => {
    req.logout(err => {
        if (err) throw err;
    })
    req.flash('success_msg', 'You are logged out!')
    res.redirect('/users/login')
}

module.exports = {
    getLogin,
    getRegister,
    postRegisterHandler,
    postLoginHandler,
    getLogout
}