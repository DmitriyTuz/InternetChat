const Router = require('express')
const router = new Router()
const chatController = require('../controllers/chatController')
const getChat = require("../controllers/chatController");

router.get('/', chatController.getChat)

module.exports = router