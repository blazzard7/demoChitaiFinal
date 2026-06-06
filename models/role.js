module.exports = (sequelize, DataTypes) => sequelize.define('Role', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }

}, { tableName: 'roles', timestamps: false });