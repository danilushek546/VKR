const {brand} = require('../models/models');
const apiError = require('../Errors/apiError');

class brandController {
    async create(req, res){
        const {name} = req.body;
        const Brand = await brand.create({name});
        return res.json(Brand);
    }
    
    async getAll(req, res){
        const brands = await brand.findAll();
        return res.json(brands);
    }
    async delete(req, res) {
        try {
            const {id} = req.params;

            await brand.findOne({where:{id}})
                .then( async data => {
                    if(data) {
                        await brand.destroy({where:{id}}).then(() => {
                            return res.json("Brand deleted");
                        })
                    } else {
                        return res.json("This Brand doesn't exist in DB");
                    }
                })
        } catch (e) {
            return res.json(e);
        }
    }
}


module.exports = new brandController();