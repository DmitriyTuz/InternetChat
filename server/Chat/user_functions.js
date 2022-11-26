const { User, Room, UserRoom} = require("../models/models");
const ApiError = require("../error/ApiError");

const addUser = async ({ socketId, email, name, room }) => {

    /*    try {*/

    name = name.trim().toLowerCase()
    room = room.trim().toLowerCase()
    email = email.trim().toLowerCase()

    await User.update({socketId}, {where: {email}})

    let user1 = await User.findOne({where: {email}})

    if (!user1) return {error: 'User with this email not found'}

    let room1 = await Room.findOne({where: {name: room}})
    if (!room1) {
        room1 = await Room.create({name: room})
    }

    let existingUser1 = await UserRoom.findOne({where: {userId: user1.id, roomId: room1.id}})

    if (!email || !name || !room) return {error: 'Username, email and room are required.'}

    if (existingUser1) return {error: 'Username is taken111.'}

    await UserRoom.create({userId: user1.id, roomId: room1.id})


    let id = user1.id
    name = user1.name

    const user = {id, socketId, name, email, room}

    return {user}
}
/*    } catch (e) {
        console.log(1);
//        throw (e);
        console.log('Ошибка catch 1 : ', e.message);

}*/

const removeUser = async (socketId) => {

    let user = await User.findOne({
        where:
            {
                socketId: socketId
            }
    })

    await UserRoom.destroy({
        where: {
            userId: user.id
        }
    })

    return user
}

const getUser = async (socketId) => {

    let user1 = await User.findOne({
        attributes: ["id", "name", "email", "socketId"],
        where: { socketId: socketId },
        include: [{
            model: Room, attributes: ["id", "name"],
            required: false
        }]
    })

    let id = user1.id
    let room = user1.rooms[0].name
    let name = user1.name
    let email = user1.email

    let user = {}
    user = { id, name, email, socketId, room }

    return user
}

const getUsersInRoom = async (room) => {

    let users
    users = await User.findAll(

        {attributes: ["id","name","email"],
            include: [{
                model: Room, attributes:["name"],
                required: true,
                where: { name: room }
            }]
        }
)
    return users;
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }