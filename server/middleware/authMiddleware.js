const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] //разделяем тип токена и сам токен, затем получаем сам токен
        if (!token) {
            return res.status(401).json({message: "Нет авторизовации"})
        }
        const decoded = jwt.verify(token, process.env.secretKey)
        req.user = decoded;
        next()
    } catch (e) {
        res.status(401).json({message: "Нет авторизовации"})
    }
};