const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')



router.get('/', userController.getAll)
router.get('/findUserNameByEmail', userController.findUserNameByEmail)
router.get('/findByPartOfEmail', userController.findByPartOfEmail)

router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)

router.post('/forgot_password', userController.sendResetLink)
//router.get('/getFormResetPassword/:token', userController.getFormForNewPassword)
router.put('/reset_password/:token', userController.updatePassword)

//router.put('/PasswordReset', userController.passwordReset)
//router.put('/updatePassword', userController.updatePassword)


module.exports = router