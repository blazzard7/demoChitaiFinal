module.exports = (sequelize, DataTypes) => sequelize.define('Order', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  orderNumber: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  orderDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  deliveryDate: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },
  pickupPointId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  clientId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },
  pickupCode: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('new', 'completed'), 
    defaultValue: 'new' 
  }
}, 
{ tableName: 'orders', timestamps: false });
