module.exports = (sequelize, DataTypes) => sequelize.define('OrderItem', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  orderId: { 
    type: DataTypes.INTEGER,
     allowNull: false 
    },
  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  quantity: { 
    type: DataTypes.INTEGER,
     allowNull: false 
    }
}, { tableName: 'order_items', timestamps: false });