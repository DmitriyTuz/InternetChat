const ApiError = require('../error/ApiError')
const {User} = require('../models/models')

class UserController {

    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }

    async createUser(req, res, next) {
        const {name, email, password} = req.body
        if (!email || !password || !name) {
            return next(ApiError.badRequest('Некорректный ввод'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }

        const user = await User.create({name, email, password})

        return res.json(user)
    }

}

module.exports = new UserController()