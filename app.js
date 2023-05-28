const express = require('express')
const router = require('./routes/index')
const user = require('./routes/users')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
require('dotenv').config()

const app = express()

const PORT = process.env.PORT || 3000
const hostname = process.env.HOST || 'http://localhost'

// Passport config
require('./config/passport')(passport)

// DB config
const db = require('./config/key').MongoULI

// Connect db
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs');

// Middleware bodyparser - send data from form to server
app.use(bodyParser.urlencoded({ extended: false }))

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg') // success_msg is a key
    res.locals.error_msg = req.flash('error_msg') // error_msg is a key
    res.locals.error = req.flash('error')
    next();
})

// Routes
app.use('/users', user)
app.use('/', router)

app.listen(PORT, console.log(`Server is running on port ${hostname}:${PORT}`))