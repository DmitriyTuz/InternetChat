const sequelize = require('../db')
const {Rating} = require('../models/models')
const ApiError = require('../error/ApiError');

class RatingController {

/*// sequelize
    async create(req, res) {
        const {userId, deviceId, rate} = req.body
        const rating = await Rating.create({userId, deviceId, rate})
        return res.json(rating)
    }*/

/*// SQL !!! создаёт но не выдаёт (возможно нужно ещё добавлять в запрос SELECT)
    async create(req, res) {
    //       const {userId, deviceId, rate} = req.body
        let query = `INSERT INTO "ratings"("userId", "deviceId", "rate", "createdAt", "updatedAt") VALUES (${req.body.userId}, ${req.body.deviceId}, ${req.body.rate}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
        const rating = await sequelize.query(query)
        return res.json(rating[0])
    }*/


/*// sequelize - один юзер может ставить только одну оценку
    async create(req, res, next) {
        let {userId, deviceId, rate} = req.body
        let rating = await Rating.findAll(
            {
                where: {
                    userId, deviceId
                }

            }
        )

        if (rating.length > 0) {
//        if (!rating.isEmpty()) {
            return next(ApiError.badRequest('Пользователь уже поставил оценку этому девайсу !'))
        }
        let rating1 = await Rating.create({userId, deviceId, rate})
        return res.json(rating1)

    }*/

// sequelize - тоже самое через findOne
    async create(req, res, next) {
        let {userId, deviceId, rate} = req.body
        let rating = await Rating.findOne(
            {
                where: {
                    userId, deviceId
                }

            }
        )

        if (rating) {
//        if (!rating.isEmpty()) {
            return next(ApiError.badRequest('Пользователь уже поставил оценку этому девайсу !'))
        }
        let rating1 = await Rating.create({userId, deviceId, rate})
        return res.json(rating1)

    }


/*// SQL !!! пока не пашет
    async create(req, res, next) {
        const {userId, deviceId} = req.body
        const old = await sequelize.query(`SELECT * FROM "ratings" WHERE "userId" = ${req.body.userId} AND "deviceId" = ${req.body.deviceId} AND "rate" IS NOT NULL`)
        if (old[0] !== []) {
            return next(ApiError.badRequest('Пользователь уже ставил оценку !'))
        }

        const rating = await Rating.create({userId, deviceId, rate: req.body.rate})
        return res.json(rating)
    }*/


 // sequelize
    async getAll(req, res) {
        const rating = await Rating.findAll()
        return res.json(rating)
    }

/* // SQL
    async getAll(req, res) {
        let query = 'SELECT * FROM "ratings"';
        const rating = await sequelize.query(query);
        return res.json(rating[0])
    }*/

/*// sequelize
    async getOne(req, res) {
        const {id} = req.params
        const rating = await Rating.findOne(
            {
                where: {id}
            }
        )
        return res.json(rating)
        }*/

// SQL
    async getOne(req, res) {
        let query = `SELECT * FROM "ratings" WHERE id = ${req.params.id}`
        const rating = await sequelize.query(query)
        return res.json(rating[0])
}

// sequelize
    async getOneByUserIdAndDeviceId(req, res) {
        const rating = await Rating.findAll(
            {
                where: {
                        userId: req.query.userId,
                        deviceId: req.query.deviceId
                }
            }
        )
        return res.json(rating)
    }

/*// SQL
    async getOneByUserIdAndDeviceId(req, res) {
//        const {userId, deviceId} = req.query;
//        let deviceId = req.body.deviceId;
        let query = `SELECT * FROM "ratings" WHERE "userId" = ${req.query.userId} AND "deviceId" = ${req.query.deviceId}`
        const rating = await sequelize.query(query)
        return res.json(rating[0])
    }*/

/*// sequelize
    async getAllByRate(req, res) {
        const rating = await Rating.findAll(
            {
                where: {
                    rate: req.query.rate
                }
            }
        )
        return res.json(rating)
    }*/

// SQL
    async getAllByRate(req, res) {
        let query = `SELECT * FROM "ratings" WHERE "rate" = ${req.query.rate}`
        const rating = await sequelize.query(query)
        return res.json(rating[0])
    }

// sequelize - доработать !!!
    async getAllByRateNotNull(req, res, next) {
        const rating = await Rating.findAll(
            {
                where: {
                        userId: req.query.userId,
                        deviceId: req.query.deviceId,
                }
            }
        )

        return res.json(rating)
    }

/*// SQL
    async getAllByRateNotNull(req, res) {
        let query = `SELECT * FROM "ratings" WHERE "rate" IS NOT NULL`
        const rating = await sequelize.query(query)
        return res.json(rating[0])
    }*/


/*// sequelize
    async delete(req, res) {
        await Rating.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.send("успешное удаление")
    }*/

// SQL
    async delete(req, res) {
        let query = `DELETE FROM "ratings" WHERE id = ${req.params.id}`
        await sequelize.query(query)
        return res.send("успешное удаление")
    }

/*// sequelize
    async editRateById(req, res) {
        await Rating.update(
            {
                rate: req.body.rate
            },
            {
                where: {
                    id: req.body.id
                }
            }
        );
        return res.send("успешное обновление")
    }*/

// SQL
    async editRateById(req, res) {
        let query = `UPDATE "ratings" SET rate = ${req.body.rate} WHERE id = ${req.body.id}`
        await sequelize.query(query)
        return res.send("успешное обновление")
    }

    /* // sequelize
    async editRateByUserIdAndDeviceId(req, res) {
        await Rating.update(
            {
                rate: req.body.rate
            },
            {
                where: {
                        userId: req.body.userId,
                        deviceId: req.body.deviceId
                       }
            }
        );
        return res.send("успешное обновление")
    }*/

// SQL
    async editRateByUserIdAndDeviceId(req, res) {
        let query = `UPDATE "ratings" SET rate = ${req.body.rate} WHERE "userId" = ${req.body.userId} AND  "deviceId" = ${req.body.deviceId}`
        await sequelize.query(query)
        return res.send("успешное обновление")
    }


}

module.exports = new RatingController()