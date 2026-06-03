module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true },
  role: { 
    type: DataTypes.ENUM('admin', 'manager', 'client', 'guest'), 
    allowNull: false },
  fullName: { 
    type: DataTypes.STRING, 
    allowNull: false },
  login: { 
    type: DataTypes.STRING, 
    unique: true, 
    allowNull: false },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false }
}, { tableName: 'users', timestamps: false });