const {DeviceInfo} = require('../models/models')

class DeviceInfoController {

    async getAll(req, res) {
        const device_info = await DeviceInfo.findAll()
        return res.json(device_info)
    }

    async createInfoInDevice (req, res) {
        let {id, info} = req.body
        if (info) {
//            info = JSON.parse(info)
            await info.forEach(i =>
                DeviceInfo.create({
                    title: i.title,
                    description: i.description,
                    deviceId: id
                })
            )
        }
        return res.send('Create completed !')
    }

    async updateInfoInDevice(req, res) {
        let {id, info} = req.body

                await DeviceInfo.update({
                    title: info[0].title,
                    description: info[0].description
                },
                    {
                            where: {id}
                            }
                )
    return res.send('Update completed !')

    }

/*    async updateInfoInDevice(req, res) {
        let {info} = req.body
        if (info) {
//            info = JSON.parse(info)
            for (let i = 0; i < info.length; i++ ) {
                DeviceInfo.update({
                        title: i.title,
                        description: i.description
                    },

                    {
                        where: {
                            deviceId: req.body.deviceId,
                            id: i + 1
                        }
                    }
                )
            }
            return res.send('Update completed !')
        }
    }*/

}

module.exports = new DeviceInfoController()