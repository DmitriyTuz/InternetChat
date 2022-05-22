const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const nodemailer = require("nodemailer");
const validator = require('validator');

const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User,Basket, Rating} = require('../models/models')

//const {createToken, verifyToken} = require("../utils/jwtToken");
//const {hashPassword, comparePassword} = require("../utils/workPassword");
const jwtToken = require("../utils/jwtToken");
const workPassword = require("../utils/workPassword");



class UserController {

    async getAll(req, res) {
        const users = await User.findAll()
        return res.json(users)
    }

    async registration(req, res, next) {
        const {name, email, password, role} = req.body
        if (!email || !password || !name) {
            return next(ApiError.badRequest('Некорректный ввод'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
//        const hashPassword = await bcrypt.hash(password, 5)
        const HashPassword = await workPassword.hashPassword(password)
        const user = await User.create({name, email, role, password: HashPassword})
        const basket = await Basket.create({userId: user.id})
//        const rating = await Rating.create({userId: user.id, deviceId: device.id})
        const token = jwtToken.createToken((user.id, user.name, user.email, user.role));
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let ComparePassword = workPassword.comparePassword(password, user.password)

        if (!ComparePassword) {
            return next(ApiError.internal('Указан неверный пароль'))
        }

        const token = jwtToken.createToken((user.id, user.email, user.role))
        return res.json({token})
    }

    async check(req, res, next) {
        const token = jwtToken.createToken((req.user.id, req.user.email, req.role));
        return res.json({token})
    }


    async findUserNameByEmail (req, res, next) {
        const { email } = req.query;
        const user = await User.findOne({ where: { email } })

        if (!user) {
            return next(ApiError.internal('Пользователь с таким email не найден'))
        }
        return res.send(user.name)
    }

    async findByPartOfEmail (req, res) {
//        let {} = req.query
//        const user = await User.findAll({ where: { email: "user1@mail.ru" } })
        const user = await User.findAll({ where: { email: { [Op.like]: `%${req.query.email}%` } } })
//        const user = await User.findAll({ where: { email: { [Op.like]: '%12%' } } })
        return res.json(user)
    }

    async sendResetLink(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({where: { email } });
            if (!email) {
                return next(ApiError.badRequest('Email is required'))
            }
            if (!validator.isEmail(email)) {
                return next(ApiError.badRequest('Invalid email'))
            }
            if (!user) {
                return next(ApiError.badRequest('User not found'))
            }

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'dmitriytuz123@gmail.com',
                    pass: 'dimonchidimadim1',
                },
            })

            const token = jwtToken.createToken(user);
            const link = `${req.protocol}://localhost:5000/api/user/reset_password/${token}`
            let info = await transporter.sendMail({
                from: '"Node js" <nodejs@example.com>', // sender address
                to: "dmitriytuz123@gmail.com", // list of receivers
                subject: "Your IntShop password reset !", // Subject line
//                text: "Your IntShop password reset", // plain text body
                html: `<div>Click the link below to reset your password</div></br>
                       <div>${link}</div>
                      `

            });
            console.log("Message sent: %s", info.messageId);
            return res.status(200).send({message: 'Password reset link has been successfully sent to your inbox' })

        } catch (e) {
            return next (new Error(e));
        }
    }

    async getFormForNewPassword(req, res, next) {
// redirect('updatePassword.html');
        return res.status(200).send('Переходим к форме для введения нового пароля !');
    }

    async updatePassword(req, res, next) {
        try {
            const { password } = req.body;
            const { token } = req.params;
            const decoded = jwtToken.verifyToken(token);
            const hash = workPassword.hashPassword(password);
            const decodedPassword = req.body.password;
            const updatedUser = await User.update(
                { password: hash },
                {
                    where: { id: decoded.userId },
                    returning: true,
                    plain: true
                }
            )
            return res.status(200).send({ token, user: updatedUser[1], decodedPassword });

        } catch (e) {
            return next(new Error(e));
        }
    }

}

module.exports = new UserController()