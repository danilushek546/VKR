const {orders, orderDevice, device, brand, Type} = require('./../models/models');
const ApiError = require('../Errors/apiError');
const jwt = require('jsonwebtoken');

class OrdersController {
    async create(req, res) {
        const auth = req.headers.authorization || "";
        const {mobile, basket} = req.body;

        try {
            let parseDevices = [];
            for (let key of basket) {
                parseDevices.push(key.id)
            }

            const isDeviceInDB = await device.findAndCountAll({
                where: {id: parseDevices},
                attributes: ["id"]
            });

            if(isDeviceInDB.count === parseDevices.length) { //if all devices was found in DB
                const row = {mobile};
                if(auth) {
                    const token = auth.split(' ')[1];
                    const {id} = jwt.verify(token, process.env.secretKey);
                    row.userId = id;
                }

                await orders.create(row).then(order => {
                    const {id} = order.get();
                    parseDevices.forEach( async (deviceId, i) =>  {

                        await orderDevice.create({
                            orderId: id,
                            deviceId,
                            count: basket[i].count
                        });
                    });
                });
            } else { //send msg about devices that didnt found in DB
                const notFoundIdDevices = [];
                const arrDevices = []; //found id
                isDeviceInDB.rows.forEach(item => arrDevices.push(item.id));
                parseDevices.forEach(deviceId => {
                    if(!arrDevices.includes(deviceId)) {
                        notFoundIdDevices.push(deviceId);
                    }
                });
                return ApiError.badRequest(res.json(`Some Devices of id(${notFoundIdDevices.join(', ')}) not exist in DB`));
            }

            return res.json("Thank you for you order! We will contact you shortly");
        } catch (e) {
            return res.json(e);
        }
    }

    async updateOrder(req, res) {
        try {
            const { complete, id } = req.body;

            await orders.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                        await orders.update({complete}, {where:{id}} ).then(() => {
                            return res.json("Order updated");
                        })
                    } else {
                        return res.json("This order doesn't exist in DB");
                    }
                })
        } catch (e) {
            return res.json("Updated didn't complete because was error: " + e);
        }

    }

    async deleteOrder(req, res) {
        try {
            const { id } = req.body;

            await orders.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                        await orders.destroy({where:{id}}).then(() => {
                            return res.json("Order deleted");
                        })
                    } else {
                        return res.json("This order doesn't exist in DB");
                    }
                })
        } catch (e) {
            return res.json("Delete didn't complete because was error: " + e);
        }
    }

    async getAll(req, res) {
        let {limit, page, complete} = req.query;
        page = page || 1;
        limit = limit || 7;
        let offset = page * limit - limit;
        let devices;
        if(complete === "Не завершенные") {
            devices = await orders.findAndCountAll({where:{complete: false}, limit, offset});
        } else if(complete === "Завершенные") {
            devices = await orders.findAndCountAll({where:{complete: true}, limit, offset});
        } else {
            devices = await orders.findAndCountAll({limit, offset});
        }

        return res.json(devices);
    }

    async getOne(req, res) {
        const {id} = req.params;
        const order = {};
        try {
            let devices;
            let infoDevices = [];
            await orders.findOne({where:{id}}).then(async data => {
                order.descr = data;
                devices = await orderDevice.findAll({
                    attributes: ["deviceId", "count"],
                    where:{orderId: data.id},
                });

                for (let Device of devices) {
                    await device.findOne({
                        attributes: ["name", "image", "price"],
                        where: {id: Device.deviceId},
                        include: [
                            {
                                attributes: ["name"],
                                model: Type
                            },
                            {
                                attributes: ["name"],
                                model: brand
                            },
                        ]
                    }).then(async item => {
                        let newObj = {
                            descr: item,
                            count: Device.count
                        }
                        infoDevices.push(newObj);
                    });
                }
                order.devices = infoDevices;

                return res.json(order);
            }).catch(() => {
                return res.json("Order doesn't exist in data base");
            });

        } catch (e) {
            return res.json("Delete didn't complete because was error: " + e);
        }
    }
}

module.exports = new OrdersController();