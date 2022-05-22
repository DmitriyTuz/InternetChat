const Router = require('express')
const router = new Router()
const device_infoController = require('../controllers/device_infoController')

router.get('/', device_infoController.getAll)
//router.get('/find/:id', deviceController.getOne)

router.post('/createInfoInDevice', device_infoController.createInfoInDevice)

router.put('/updateInfoInDevice', device_infoController.updateInfoInDevice)

module.exports = router