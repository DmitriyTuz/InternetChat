const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')


router.get('/', ratingController.getAll)
router.get('/getOne/:id', ratingController.getOne)
router.get('/getOneByUserIdAndDeviceId', ratingController.getOneByUserIdAndDeviceId)
router.get('/getAllByRate', ratingController.getAllByRate)
router.get('/getAllByRateNotNull', ratingController.getAllByRateNotNull)


router.post('/create', ratingController.create)

router.delete("/delete/:id", ratingController.delete)

router.put("/editRate/ById", ratingController.editRateById)
router.put("/editRate/ByUserIdAndDeviceId", ratingController.editRateByUserIdAndDeviceId)

module.exports = router