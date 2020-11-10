const express = require('express');
const router = express.Router()
const usuarioController = require("../controllers/userController")
const { check } = require('express-validator')

router.post('/',
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'Add a valid email').isEmail(),
        check('password', "The password must be at least 6 characters").isLength({min: 6})
    ],
    usuarioController.createUser)

module.exports = router