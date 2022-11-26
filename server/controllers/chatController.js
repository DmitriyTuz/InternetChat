const { User, Room, Message} = require('../models/models')
const { addUser, getUsersInRoom, getUser, removeUser } = require('../Chat/user_functions');
const ApiError = require("../error/ApiError");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class ChatController {

    async getChat(req, res, next) {
        const { message } = req.query;
        if (!message) {
            return next(ApiError.badRequest('Введите сообщение : '))
        }

        let chat = await User.findAll({attributes: ["id", "socketId", "name"],

                include: [{

                    model: Message, attributes:["id","text"],
                    required: true,
                    where : { text : { [Op.like]: `%${req.query.message}%` } }

                }]
        })
        return res.json(chat)
    };


    connectSocket(io)  {
        io.on('connect', (socket) => {

            console.log('Подключились !');

            socket.on('join', async ({ email, name, room }, callback) => {

                // try {
                    const { error, user } = await addUser({ socketId: socket.id, email, name, room });
                    console.log('***user = ', user);
                console.log('***user.id = ', user.id);

                    if(error) return callback(error);

                    socket.join(user.room);

                    socket.emit('message', { userId: user.id, roomName: user.room, user: 'admin', text: `${user.name}, welcome to ${user.room}.`});
                    socket.broadcast.to(user.room).emit('message', {userId: user.id, roomName: user.room, user: 'admin', text: `${user.name} has joined!` });

                    let users = await getUsersInRoom(user.room);

                    io.to(user.room).emit('roomData', { room: user.room, users: users });

                    callback();
                 // catch (e) {
                 //    console.log(2);
                 //    console.log('Ошибка catch 2 : ', e.message);
                 //    return callback(e.message);
                // };
            });

            socket.on('sendMessage', async (message, callback) => {

                console.log('отправка сообщения');
                console.log('***message = ', message);

                const user = await getUser(socket.id);

                console.log('***user = ', user);

                io.to(user.room).emit('message', { userId: user.id, roomName: user.room, user: user.name, text: message.message });

                console.log('=====>*** ', message.message, message.id, message.room);

                const room1 = await Room.findOne( { where : { name : user.room } } );

                const message1 = await Message.create({text: message.message, userId: message.id, roomId: room1.id});
                console.log('***message1 = ', message1);

                callback();
            });

            socket.on('disconnect', async () => {

                console.log('Отключились !');

                console.log('!!!!! socet.id = ', socket.id);

                const user = await getUser(socket.id);
                await removeUser(socket.id);
                let users = await getUsersInRoom(user.room)

                if (user) {
                    console.log('***user.room = ', user.room);
                    console.log('***user.name = ', user.name);

                    socket.join(user.room)

                    socket.emit('message', { user: 'Admin', text: `${user.name} has left.` });
                    socket.broadcast.to(user.room).emit('message', {userId: user.id, roomName: user.room, user: 'admin', text: `${user.name} has left!` });

                    io.to(user.room).emit('roomData', { room: user.room, users: users });

                    // io.to(user1.room).emit('message', { user: 'Admin', text: `${user1.name} has left.` });
                    // io.to(user1.room).emit('roomData', { room: user1.room, users: getUsersInRoom(user1.room)});
                }
            })
        })
    }
}

module.exports = new ChatController()