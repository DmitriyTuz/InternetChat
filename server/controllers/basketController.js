const {Basket, BasketDevice, Device} = require('../models/models')
const ApiError = require('../error/ApiError');

class BasketController {

    async create(req, res) {
        let {userId} = req.body
        const basket = await Basket.create({userId})
        return res.json(basket)
    }

    async getAll(req, res) {
        const baskets = await Basket.findAll()
        return res.json(baskets)
    }

// delete full basket
    async delete(req, res) {
        await Basket.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.send("успешное удаление")
    }

    async edit(req, res) {
        await Basket.update(
            {
                userId: req.body.userId
            },
            {
                where: { id: req.body.id }
            }
        );
        return res.send("успешное обновление")
    }

    async getOne(req, res) {
        const {id} = req.params
        const basket = await Basket.findOne(
            {
                where: {id}
            }
        )
        return res.json(basket)
    }

// get basket with devices
    async getBasketWithDevises(req, res) {
        let basket = await Basket.findOne({attributes: [],
            include: [{
                model: BasketDevice, attributes:["id"],
                required: false,
                include: [{
                    model: Device, attributes:["id","name", "price", "rating"],
                    required: false
                }]
            }]
        })

        return res.json(basket)
    };

// add device to basket
    async addDeviceToBasket(req, res) {
        let {basketId, deviceId} = req.body
        const basket = await BasketDevice.create({basketId, deviceId})
        return res.json(basket)
    }

// delete device from basket
    async deleteOneDeviceFromBasket(req, res) {
        let {basketId, deviceId} = req.body
        const basket = await BasketDevice.destroy({where: {basketId, deviceId}})
        return res.json(basket)
    }

// Full delete devises from basket
    async deleteAllDeviceFromBasket(req, res) {
        let {basketId} = req.body
        const basket = await BasketDevice.destroy({where: {basketId}})
        return res.json(basket)
    }

}


module.exports = new BasketController()