const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db'); 
const User = require('./User')(sequelize, DataTypes);
const Product = require('./Product')(sequelize, DataTypes);
const PickupPoint = require('./PickupPoint')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

Order.belongsTo(User, { as: 'client', foreignKey: 'clientId' });
Order.belongsTo(PickupPoint, { as: 'pickupPoint', foreignKey: 'pickupPointId' });
Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

module.exports = { sequelize, User, Product, PickupPoint, Order, OrderItem };