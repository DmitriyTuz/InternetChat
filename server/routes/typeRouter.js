const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware')


router.get('/', typeController.getAll)
router.get('/find/:id', typeController.getOne)

router.post('/create', checkRole('ADMIN'), typeController.create)


router.put("/edit", checkRole('ADMIN'), typeController.edit)

router.delete("/delete/:id", checkRole('ADMIN'), typeController.delete)

module.exports = router