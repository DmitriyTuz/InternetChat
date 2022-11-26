const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type:  DataTypes.STRING},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    socketId: {type: DataTypes.STRING}
})

const UserRoom = sequelize.define('user_room', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Room = sequelize.define('room', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
})

const Message = sequelize.define('message', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING, allowNull: false}
})


User.hasMany(Message, { onDelete: "cascade" })
Message.belongsTo(User)

Room.hasMany(Message, { onDelete: "cascade" })
Message.belongsTo(Room)

User.belongsToMany(Room, { through: UserRoom })
Room.belongsToMany(User, { through: UserRoom })

module.exports = {
    User,
    Room,
    Message,
    UserRoom
}