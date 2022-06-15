const sequelize = require('../database');
const {DataTypes} = require('sequelize');

const user = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const basketDevice = sequelize.define('basket-device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER},
})

const device = sequelize.define('device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    image: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('Type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const rating = sequelize.define('raiting', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const deviceInfo = sequelize.define('device-info', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const typeBrand = sequelize.define('type-brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const orders = sequelize.define('orders', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    complete: {type: DataTypes.BOOLEAN, defaultValue: false},
    mobile: {type: DataTypes.STRING(25), allowNull: false},
    userId: {type: DataTypes.INTEGER, allowNull: true},
})

const orderDevice = sequelize.define('order_device', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    deviceId: {type: DataTypes.INTEGER, allowNull: false},
    orderId: {type: DataTypes.INTEGER, allowNull: false},
    count: {type: DataTypes.INTEGER, allowNull: false},
})

user.hasOne(basket);
basket.belongsTo(user);

user.hasMany(rating);
rating.belongsTo(user);

user.hasMany(orders);
orders.belongsTo(user,
    {
        foreignKey: { name: 'userId' },
        onDelete: 'CASCADE',
    }
);

orders.hasMany(orderDevice);
orderDevice.belongsTo(orders,
    {
        foreignKey: { name: 'orderId' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }
);

basket.hasMany(basketDevice);
basketDevice.belongsTo(basket);

Type.hasMany(device);
device.belongsTo(Type);

brand.hasMany(device);
device.belongsTo(brand);

device.hasMany(rating);
rating.belongsTo(device);

device.hasMany(basketDevice);
basketDevice.belongsTo(device);

device.hasMany(deviceInfo, {as: 'info'});
deviceInfo.belongsTo(device);

Type.belongsToMany(brand, {through: typeBrand});
brand.belongsToMany(Type, {through: typeBrand});

module.exports = {
    user,
    basket,
    basketDevice,
    device,
    Type,
    brand,
    rating,
    typeBrand,
    deviceInfo,
    orders,
    orderDevice
}