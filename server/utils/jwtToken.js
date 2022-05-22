const jwt = require('jsonwebtoken')

class jwtToken {

    createToken({id, email, role}) {
        return jwt.sign(
            {id, email, role},
            process.env.SECRET_KEY,
            {expiresIn: '24h'}
        )
    }

    verifyToken(token) {
        return jwt.verify(
            token,
            process.env.SECRET_KEY,
            {expiresIn: '24h'})
    }
}

module.exports = new jwtToken()



