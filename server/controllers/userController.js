const apiError = require('../Errors/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {user, basket} = require('../models/models')

const generateJwt = (id, email, role) =>{
  return jwt.sign({id, email, role}, 
    process.env.secretKey,
    {expiresIn: '24h'}
    )
}

class userController {
    async registration(req, res, next){
      const {email, password, role} = req.body;
      if (!email || !password){
        return next(apiError.badRequest('Введите логин и пароль'));
      }
      const newUser = await user.findOne({where: {email}})
      if(newUser){
        return next(apiError.badRequest('Пользователь с таким email уже существует'));
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const User = await user.create({email, role, password: hashPassword});
      const Basket = await basket.create({userId: User.id});
      const token = generateJwt(User.id, User.email, User.role);
      return res.json({token})
    }

    async login(req, res, next){
      const {email, password} = req.body;
      const User = await user.findOne({where: {email}})
      if (!User){
        return next(apiError.internal('Пользователя с таким email не существует'));
      }
      let comparePassword = bcrypt.compareSync(password, User.password)
      if(!comparePassword){
        return next(apiError.internal('Неверный пароль'))
      }
      
      const token = generateJwt(User.id, User.email, User.role);
      return res.json({token});
    }

    async isAuthenticate(req, res, next){
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({token});
    }

}

module.exports = new userController();


