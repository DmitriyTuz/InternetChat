const { User, Room, UserRoom, BasketDevice, Device, Basket} = require("../models/models");
const ApiError = require("../error/ApiError");

const users = [];

const addUser = async ({ socketId, email, name, room }) => {

/*    try {*/

        name = name.trim().toLowerCase();
        room = room.trim().toLowerCase();
        email = email.trim().toLowerCase();


        let user1 = await User.update({ socketId }, { where: { email } } )

        let user2 = await User.findOne( { where: { email } } );

//*        if ( !user2 ) throw { message: 'User with this email not found' };

        if ( !user2 ) return { error: 'User with this email not found' };


        let room1 = await Room.findOne( { where: { name: room } } );
        if ( !room1 ) {
            room1 = await Room.create( { name: room } )
        }


        let existingUser1 = await UserRoom.findOne( { where: { userId: user2.id, roomId: room1.id } } );

        if(!email || !name || !room) return { error: 'Username, email and room are required.' };

        if(existingUser1) return { error: 'Username is taken.' };

        existingUser1 = await UserRoom.create( {userId: user2.id, roomId: room1.id} );

//        const existingUser = users.find((user) => user.room === room && user.name === name);

//    const user_room = await UserRoom.create({userId, roomId})


//        if(!name || !room) return { error: 'Username and room are required.' };
//        if(existingUser) return { error: 'Username is taken.' };

//        const user = { id, user1.name, email, room };

        let id = user2.id;
            name = user2.name;

        const user = { id, socketId, name, email, room };

       users.push(user);

        return { user };

/*    } catch (e) {
        console.log(1);
//        throw (e);
        console.log('Ошибка catch 1 : ', e.message);

//        console.log('Ошибка : ', e.name);
//        return { error: e };

//        if(!email || !name || !room) return { error: 'Username, email and room are required.' };

    }*/
}


const removeUser = async (id) => {
    await UserRoom.destroy({
        where: {
            userId: id
        }
    });
}

/*const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) return users.splice(index, 1)[0];
}*/

const getUser = async (room, socketId) => {

    let user1 = await User.findOne( { where: { socketId: socketId } } );

    let id = user1.id;
//    console.log(id);

    let name = user1.name;
    let email = user1.email;

    const user = { id, socketId, name, email, room };

    return user;
}

//const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = async (room) => {

    let users = await User.findAll(

        {attributes: ["id","name","email"],
            include: [{
                model: Room, attributes:["name"],
                required: true,
                where: { name: room }
            }]
        }
);
//    console.log(users);

    return users;
}

/*Document.findAll({
    where: {'$employee.manager.id$': id},
    include: [{
        model: models.Employee,
        required: true,
        as: 'employee',
        include: [{
            model: models.Manager,
            required: true,
            as: 'manager',
            where: { id: managerId },
        }],
    }]*/

//const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };