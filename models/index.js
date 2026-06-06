const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Role = require('./role')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const PickupPoint = require('./pickuppoint')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderitem')(sequelize, DataTypes);

// Связь: одна роль может быть у многих пользователей
Role.hasMany(User, {
  foreignKey: 'roleId'
});

User.belongsTo(Role, {
  foreignKey: 'roleId'
});

// Связь: одна категория может быть у многих товаров
Category.hasMany(Product, {
  foreignKey: 'categoryId'
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId'
});

// Связь: один пользователь может иметь много заказов
User.hasMany(Order, {
  foreignKey: 'userId'
});

Order.belongsTo(User, {
  foreignKey: 'userId'
});

// Связь: один пункт выдачи может быть у многих заказов
PickupPoint.hasMany(Order, {
  foreignKey: 'pickupPointId'
});

Order.belongsTo(PickupPoint, {
  foreignKey: 'pickupPointId'
});

// Связь: один заказ состоит из нескольких товаров
Order.hasMany(OrderItem, {
  foreignKey: 'orderId'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'orderId'
});

// Связь: один товар может быть в разных заказах
Product.hasMany(OrderItem, {
  foreignKey: 'productId'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'productId'
});

async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД выполнено');

    await sequelize.sync({ alter: true });
    console.log('Таблицы созданы или обновлены');

    await Role.findOrCreate({ where: { name: 'client' } });
    await Role.findOrCreate({ where: { name: 'manager' } });
    await Role.findOrCreate({ where: { name: 'admin' } });

    console.log('Роли добавлены');
  } catch (error) {
    console.error('Ошибка при создании БД:', error);
  }
}

// Запускаем создание БД только если файл запущен напрямую
if (require.main === module) {
  initDatabase();
}

module.exports = {
  sequelize,
  Role,
  User,
  Category,
  Product,
  PickupPoint,
  Order,
  OrderItem,
  initDatabase
};