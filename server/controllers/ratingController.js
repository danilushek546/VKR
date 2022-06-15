const {rating, device} = require('../models/models')
const jwt = require('jsonwebtoken');

class RatingController {
    async addRating(req, res) {
        try {
            const {rate, deviceId} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.secretKey);
            await rating.create({rate, deviceId, userId: user.id});

            let Rating = await rating.findAndCountAll({
                where: {
                    deviceId
                },
            });

            let allRating = 0;
            let middleRating;
            Rating.rows.forEach(item => allRating += item.rate);
            middleRating = Number(allRating) / Number(Rating.count);

            await device.update(
                {rating: middleRating},
                {where: {id: deviceId}}
            );

            return res.json("Rating success added");
        } catch (e) {
            console.error(e);
        }
    }

    async checkRating(req, res) {
        try {
            const {deviceId} = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const user = jwt.verify(token, process.env.secretKey);
            const checkRating = await rating.findOne({where: {deviceId, userId: user.id}});
            const checkDevices =  await device.findOne({where: {id: deviceId}});
            if (!checkDevices) {
                return res.json({allow: false});
            } else if(checkRating && checkDevices) {
                return res.json({allow: false});
            }
            return res.json({allow: true});
        } catch (e) {
            return res.status(401).json("Something going wrong in checkAddRatingMiddleware.js");
        }
    }
}

module.exports = new RatingController();