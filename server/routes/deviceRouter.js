const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')

router.get('/', deviceController.getAll)
router.get('/find/:id', deviceController.getOne)

router.post('/create', deviceController.create)




module.exports = router