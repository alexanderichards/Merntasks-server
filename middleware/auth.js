const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

    // leer el token del header
    const token = req.header('x-auth-token')

    if (!token) return res.status(401).json({ msg: "There is no token, permission denied " })

    // revisar si no hay token


    // validar el token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(req.body)
        // if (!Object.keys(req.body).length === 0) {
            req.body.user = cifrado.user
        // } else {
        //     console.log('hello')
        //     req.params.user = cifrando.user
        // }

        next()
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token' })
    }
}