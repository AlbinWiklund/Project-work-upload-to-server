const express = require('express')
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = '$2b$10$PatAqIs5e3PF47J3FubaduRNEgj1H/yruxc.cmS.xqbPgSYH5ZnRe'
const router = express.Router()
const bcrypt = require('bcrypt')
const validators = require('../validators')

router.get('/', function (req, res) {
    const model = {
        name: "Login"
    }
    res.render('login.hbs', model)
})

router.post('/', async function (req, res) {
    const username = req.body.username
    const password = req.body.password

    const checkPassword = await bcrypt.compare(password, ADMIN_PASSWORD)

    if (username == ADMIN_USERNAME && checkPassword) {
        req.session.isLoggedIn = true
        res.redirect('/')
    } else {
        const validationErrors = validators.getValidationErrorForLogin(username, checkPassword)
        const model = {
            validationErrors,
            name: "Login"
        }
        res.render('login.hbs', model)
    }
})

module.exports = router