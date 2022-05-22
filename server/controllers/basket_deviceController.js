const {BasketDevice} = require('../models/models')
const ApiError = require('../error/ApiError');

class BasketDeviceController {
    async create(req, res) {
        const {deviceId, basketId} = req.body
        const basketDevice = await BasketDevice.create({deviceId, basketId})
        return res.json(basketDevice)
    }

    async getAll(req, res) {
        const basketDevices = await BasketDevice.findAll()
        return res.json(basketDevices)
    }

    async delete(req, res) {
        await BasketDevice.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.send("успешное удаление")
    }

    async edit(req, res) {
        await BasketDevice.update(
            {
                deviceId: req.body.deviceId,
                basketId: req.body.basketId
            },
            {
                where: { id: req.body.id }
            }
        );
        return res.send("успешное обновление")
    }

    async getOne(req, res) {
        const {id} = req.params
        const basketDevice = await BasketDevice.findOne(
            {
                where: {id}
            }
        )
        return res.json(basketDevice)
    }

// sequelize пока не работает !!!
    async addToBasketDevices(req, res) {
        const {basketId} = req.query
        const basket1 = await BasketDevice.findAll({where: {basketId}})
        return res.json(basket1)
    }
}

module.exports = new BasketDeviceController()