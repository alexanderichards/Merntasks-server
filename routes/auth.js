const express = require('express');
const router = express.Router()
const authController = require("../controllers/authController")
const { check } = require('express-validator');
const { route } = require('./users');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('email', 'Please provide a valid email').isEmail().not().isEmpty(),
        check('password', "The password is required").not().isEmpty()
    ],
    authController.authUser)

router.get('/', auth, authController.getAuthenticatedUser)

module.exports = router