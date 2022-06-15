const {basket, basketDevice, device, deviceInfo} = require('./../models/models');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

class basketController {
    async addDevice(req, res) {
        try {
            const {id} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.secretKey);
            const Basket = await basket.findOne({where: {userId: user.id}});
            await basketDevice.create({basketId : Basket.id, deviceId: id});
            return res.json("Product added in card");
        } catch (e) {
            console.error(e);
        }
    }

    async getDevices(req, res) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.secretKey);
            const {id} = await basket.findOne({where: {userId: user.id}});
            const Basket = await basketDevice.findAll({where: {basketId: id}});

            const basketArr = [];
            for(let i = 0; i < Basket.length; i++) {
                const basketDevice = await device.findOne({
                        where: {
                            id: Basket[i].deviceId,

                        },
                        include: {
                            model: deviceInfo, as: "info",
                            where: {
                                deviceId: Basket[i].deviceId,
                                [Op.or]: [
                                    {
                                        deviceId: {
                                            [Op.not]: null
                                        }
                                    }
                                ],
                            },
                            required: false}
                        });
                basketArr.push(basketDevice);
            }

            return res.json(basketArr);
        } catch (e) {
            console.error(e);
        }
    }

    async deleteDevice(req, res) {
        try {
            const {id} = req.params;
            const user = req.user;

            const userBasket = await basket.findOne({where: {userId: user.id}})
            if(userBasket.userId === user.id) {
                await basketDevice.destroy({where: {basketId: userBasket.id, deviceId: id}})
                return res.json("Product deleted form your card");
            }

            return res.json(`You haven't access for delete the device(${id}) from basket that didn't belong to you`);
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = new basketController();