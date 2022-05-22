const Router = require('express')
const router = new Router()
const deviceRouter = require('./deviceRouter')
const userRouter = require('./userRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const basketRouter = require('./basketRouter')
const basket_deviceRouter = require('./basket_deviceRouter')
const ratingRouter = require('./ratingRouter')
const device_infoRouter = require('./device_infoRouter')

const chatRouter = require('./chatRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)
router.use('/basket', basketRouter)
router.use('/basket_device', basket_deviceRouter)
router.use('/rating', ratingRouter)
router.use('/device_info', device_infoRouter)

router.use('/chat', chatRouter)

module.exports = router