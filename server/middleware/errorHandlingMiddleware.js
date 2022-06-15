const apiError = require('../errors/apiError');

module.exports = function (err, req, res, next) {
    if (err instanceof apiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(err.status).json({message: err.message})
}