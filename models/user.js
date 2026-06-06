module.exports = (sequelize, DataTypes) => sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true },
  roleId:{ 
    type: DataTypes.INTEGER, 
    allowNull: false,
    field: 'role_id',
    references: { 
      model: 'roles', 
      key: 'id' 
    } 
  },
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