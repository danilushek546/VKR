const { Op } = require("sequelize");
const uuid = require('uuid');
const path = require('path');  
const {device, deviceInfo, Type, brand, orderDevice, basketDevice} = require('../models/models'); 
const apiError = require('../Errors/apiError');

class deviceController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, TypeId, info} = req.body
            const {image} = req.files
            let fileName = uuid.v4() + ".jpg"
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
            const Device = await device.create({name, price, brandId, TypeId, image: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    deviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: Device.id
                    })
                )
            }

            return res.json(Device)
        } catch (e) {
            next(apiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, TypeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        
        if (!brandId && !TypeId) {
            devices = await device.findAndCountAll({limit, offset, order:[['rating', 'DESC'],]})
        }
        if (brandId && !TypeId) {
            devices = await device.findAndCountAll({where:{brandId}, limit, offset, order:[['rating', 'DESC'],]})
        }
        if (!brandId && TypeId) {
            devices = await device.findAndCountAll({where:{TypeId},order:[['rating', 'DESC'],], limit, offset})
        }
        if (brandId && TypeId) {
            devices = await device.findAndCountAll({where:{TypeId, brandId},order:[['rating', 'DESC'],], limit, offset})
        }
        return res.json(devices)
    }

   
    async getSearchAllDeviceByName(req, res, next) {
        try {
            let {limit, page, name, filter} = req.query;
            page = page || 1;
            limit = limit || 7;
            let offset = page * limit - limit
            if(filter === "All") {
                const devices =  await device.findAndCountAll({
                    attributes: ["name", "price", "image", "id"],
                    where:
                        {
                            name: {
                                [Op.like]: `%${name}%`
                            }
                        },
                    include: [
                        {
                            attributes: ["name"],
                            model: brand
                        },
                        {
                            attributes: ["name"],
                            model: Type
                        },
                    ],
                    limit,
                    offset,
                })

                return res.json(devices);
            } else {
                const devices =  await device.findAndCountAll({
                    attributes: ["name", "price", "image", "id", "brandId", "typeId"],
                    where:
                        {
                            name: {
                                [Op.like]: `%${name}%`
                            },
                            [Op.or]: [
                                {
                                    brandId: null,
                                },
                                {
                                    typeId: null,
                                },
                            ],
                        },
                    include: [
                        {
                            attributes: ["name"],
                            model: brand
                        },
                        {
                            attributes: ["name"],
                            model: Type
                        },
                    ],
                    limit,
                    offset,
                })


                return res.json(devices);
            }
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            let devices = await device.findOne({
                where: {id},
                include: [
                    {model: deviceInfo, as: 'info'},
                    {model: Type},
                    {model: brand},
                ]
            });
            return res.json(devices);
        } catch (e) {
            next(apiError.badRequest(e.message));
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await device.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                        await device.destroy({where:{id}}).then(() => {
                            return res.json("Device deleted");
                        })
                    } else {
                        return res.json("This Device doesn't exist in DB");
                    }

                    await orderDevice.destroy({where:{deviceId: id}})
                    await basketDevice.destroy({where:{deviceId: id}})
                })
        } catch (e) {
            return res.json(e);
        }
    }

    async update(req, res) {
        try {
            const {id} = req.params;
            const {brandId, typeId, name, price, info} = req.body;

            await device.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                        let newVal = {};
                        brandId ? newVal.brandId = brandId : false;
                        typeId ? newVal.typeId = typeId : false;
                        name ? newVal.name = name : false;
                        price ? newVal.price = price : false;

                        if(req.files) {
                            const {img} = req.files;
                            const type = img.mimetype.split('/')[1];
                            let fileName = uuid.v4() + `.${type}`;
                            img.mv(path.resolve(__dirname, '..', 'static', fileName));
                            newVal.img = fileName;
                        }

                        if(info) {
                            const parseInfo = JSON.parse(info);
                            for (const item of parseInfo) {
                                await deviceInfo.findOne({where:{id: item.id}}).then( async data => {
                                    if(data) {
                                        await deviceInfo.update({
                                            title: item.title,
                                            description: item.description
                                        }, {where:{id: item.id}})
                                    } else {
                                        await deviceInfo.create({
                                            title: item.title,
                                            description: item.description,
                                            deviceId: id
                                        })
                                    }
                                })
                            }
                        }

                        await device.update({
                            ...newVal
                        }, {where:{id}} ).then(() => {
                            return res.json("Device updated");
                        })
                    } else {
                        return res.json("This Device doesn't exist in DB");
                    }
                })
            } catch (e) {
            return res.json(e);
        }
    }
}

module.exports = new deviceController();