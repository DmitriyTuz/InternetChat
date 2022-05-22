const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')

router.post('/create', brandController.create)
router.get('/', brandController.getAll)
router.delete("/delete/:id", brandController.delete);
router.put("/edit", brandController.edit);
router.get('/:id', brandController.getOne)

module.exports = router