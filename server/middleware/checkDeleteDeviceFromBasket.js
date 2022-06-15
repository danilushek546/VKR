const {basket, basketDevice} = require('./../models/models');
const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
    try {
        const {id} = req.params;
        const user = req.user;
        const userBasket = await basket.findOne({where: {userId: user.id}});
        const deviceItem = await basketDevice.findOne({where: {basketId: userBasket.id, deviceId: id}});

        if(deviceItem) {
            return next();
        }
        return res.json("девайса нет в корзине пользователя");
    } catch (e) {
        res.json(e);
    }
};