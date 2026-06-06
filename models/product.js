module.exports = (sequelize, DataTypes) => sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  article: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },

  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },

  author: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'category_id'
  },

  unit: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'шт'
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  discount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },

  supplier: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  manufacturer: {
    type: DataTypes.STRING(150),
    allowNull: true
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  imagePath: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: 'picture.png',
    field: 'image_path'
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'products',
  timestamps: false
});