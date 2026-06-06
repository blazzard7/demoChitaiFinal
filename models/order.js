module.exports = (sequelize, DataTypes) => sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  orderNumber: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'order_number'
  },

  orderDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'order_date'
  },

  deliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'delivery_date'
  },

  pickupPointId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'pickup_point_id'
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id'
  },

  clientFullName: {
    type: DataTypes.STRING(150),
    allowNull: true,
    field: 'client_full_name'
  },

  receiveCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'receive_code'
  },

  status: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'new'
  }
}, {
  tableName: 'orders',
  timestamps: false
});