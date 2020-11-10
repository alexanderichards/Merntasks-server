const User = require("../models/User")
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {

    // chech if there are any errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const { email } = req.body

    try {

        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ msg: "The user already exists" })

        user = User(req.body)

        await user.save()

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
        console.log(error)
        res.status(400).send("There was an error creating the user")
    }
}