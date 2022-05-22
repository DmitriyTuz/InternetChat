const { User, Room, Message, Basket, BasketDevice, Device} = require('../models/models')
const { addUser, getUsersInRoom, getUser, removeUser } = require('../Chat/user_functions');
const ApiError = require("../error/ApiError");
const {where} = require("sequelize");

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

let userId;

class ChatController {

    async getChat(req, res, next) {
        const { message } = req.query;
        if (!message) {
            return next(ApiError.badRequest('Введите сообщение : '))
        }

//        const user = await User.findAll({ where: { email: { [Op.like]: `%${req.query.email}%` } } })

        let chat = await User.findAll({attributes: ["id", "socketId", "name"],

                include: [{

                    model: Message, attributes:["id","text"],
                    required: true,
                    where : { text : { [Op.like]: `%${req.query.message}%` } }

//                    where : { text : message }

                }]
        })
        return res.json(chat)
    };


    connectSocket(io)  {
        io.on('connect', (socket) => {

            console.log('Подключились !');

            socket.on('join', async ({ email, name, room }, callback) => {

/*                try {*/
                    const { error, user } = await addUser({ socketId: socket.id, email, name, room });
                    console.log('***user= ', user);

                    if(error) return callback(error);

                    userId = user.id;


                    socket.join(user.room);

                    socket.emit('message', { userId: user.id, roomName: user.room, user: 'admin', text: `${user.name}, welcome to ${user.room}.`});
                    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

                    let users = await getUsersInRoom(user.room);
                    console.log('***users= ' , users);

                    io.to(user.room).emit('roomData', { room: user.room, users: users });

                    callback();
                /*} catch (e) {
                    console.log(2);
                    console.log('Ошибка catch 2 : ', e.message);
                    return callback(e.message);
                };*/


//                console.log('Принимаем на сервере имя и комнату из события join созданного на клиенте  !', name, room);

/*                const { error, user } = await addUser({ socketId: socket.id, email, name, room });
                console.log('***user= ', user);


                if(error) return callback(error.message);

                userId = user.id;


                socket.join(user.room);

                socket.emit('message', { userId: user.id, roomName: user.room, user: 'admin', text: `${user.name}, welcome to ${user.room}.`});
                socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

                let users = await getUsersInRoom(user.room);
                console.log('***users= ' , users);

                io.to(user.room).emit('roomData', { room: user.room, users: users });

                callback();*/
            });

            socket.on('sendMessage', async (message, callback) => {

                console.log('отправка сообщения');
                console.log('***message = ', message);

//                const user = getUser(socket.id);

                const user = await getUser(message.room, socket.id);

//                const user = await getUser(message.id, message.room, socket.id);

//                const user = await getUser(socket.id);

                console.log('***user = ', user);

                io.to(user.room).emit('message', { userId: message.id, roomName: user.room, user: user.name, text: message.message });

                console.log('=====>*** ', message.message, message.id, message.room);

                const room1 = await Room.findOne ( { where : { name : user.room } } );

                const message1 = await Message.create({text: message.message, userId: message.id, roomId: room1.id});
                console.log('***message1 = ', message1);

                callback();
            });

            socket.on('disconnect', async () => {

                console.log('Отключились !');

                const user = await removeUser(userId);
//                const user = removeUser(socket.id);

                if(user) {
                    io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
                    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
                }
            })
        });
    }

}

module.exports = new ChatController()