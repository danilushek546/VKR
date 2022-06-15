require('dotenv').config();
const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    process.env.dbName,
    process.env.dbUser,
    process.env.dbPassword,
    {
        dialect: 'postgres',
        host: process.env.dbHost,
        port: process.env.dbPort
    }
)