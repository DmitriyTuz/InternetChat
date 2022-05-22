const {Brand} = require('../models/models')
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res) {
        const {name} = req.body
        const brand = await Brand.create({name})
        return res.json(brand)
    }

    async getAll(req, res) {
        const brands = await Brand.findAll()
        return res.json(brands)
    }

    async delete(req, res) {
        await Brand.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.send("успешное удаление")
    }

    async edit(req, res) {
        await Brand.update(
            {
                    id: req.body.id,
                    name: req.body.name
                   },
            {
                     where: { id: req.body.id }
                    }
        );
        return res.send("успешное обновление")
    }

    async getOne(req, res) {
        const {id} = req.params
        const brand = await Brand.findOne(
            {
                where: {id}
            }
        )
        return res.json(brand)
    }
}


module.exports = new BrandController()