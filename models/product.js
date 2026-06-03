module.exports = (sequelize, DataTypes) => sequelize.define('Product', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },
  article: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  unit: { 
    type: DataTypes.STRING, 
    defaultValue: 'шт.' 
  },
  price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false 
  },
  supplier: DataTypes.STRING,
  manufacturer: DataTypes.STRING,
  category: DataTypes.STRING,
  discount: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  stock: 
  { type: DataTypes.INTEGER, 
    defaultValue: 0 
  },
  description: 
  { type: DataTypes.TEXT },
  photo: DataTypes.STRING
}, 
{ tableName: 'products', timestamps: false });