require('dotenv').config()
const express = require('express')
const sequelize = require('./db')

const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const http = require("http");
const socketio = require('socket.io');

const { connectSocket } = require('./controllers/chatController');

const PORT = process.env.PORT || 5000

const app = express()

const server = http.createServer(app);
const io = socketio(server);

connectSocket(io);

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}


start()


