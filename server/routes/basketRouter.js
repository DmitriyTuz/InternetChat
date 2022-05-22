const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')


router.get('/', basketController.getAll)
router.get('/find/:id', basketController.getOne)
router.get('/getBasketWithDevises', basketController.getBasketWithDevises)

router.post('/create', basketController.create)
router.post('/addDeviceToBasket', basketController.addDeviceToBasket)

router.put("/edit", basketController.edit)

router.delete("/delete/:id", basketController.delete)
router.delete("/deleteDeviceFromBasket", basketController.deleteOneDeviceFromBasket)
router.delete("/deleteAllDeviceFromBasket", basketController.deleteAllDeviceFromBasket)

module.exports = router