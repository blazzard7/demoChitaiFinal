module.exports = (sequelize, DataTypes) => sequelize.define('PickupPoint', {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true },
  address: { 
    type: DataTypes.STRING, 
    allowNull: false }
}, 
{ tableName: 'pickup_points', timestamps: false });