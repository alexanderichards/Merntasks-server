const User = require("../models/User")
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.authUser = async (req, res) => {

    // chech if there are any errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email, password } = req.body

    try {

        let user = await User.findOne({ email })
        if (!user) return res.status(400).json({ msg: "The user does not exist" })

        // check the password 

        await user.comparePassword(password, (error, match) => {
            if(!match) return res.status(400).json({ msg: "Wrong credentials"})
        })

        // create and sing the jwt
        const payload = {
            user: {
                id: user.id
            }
        }

        // sign the jwt
        jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 3600
        }, (error, token) => {
            if(error) throw error
            res.json({token})
        })

    } catch (error) {
        // console.log(error)
        console.log("Something went wrong")
    }
}

// Obtiene que usuario esta autenticado
exports.getAuthenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.body.user.id).select('-password')
        res.json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "Something went wrong"})
    }
}
