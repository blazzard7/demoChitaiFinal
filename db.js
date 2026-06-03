const Sequelize = require("sequelize");
const sequelize = new Sequelize("chitai", "root", "andreaee228258", {
  dialect: "mysql",
  host: "localhost"
});
module.exports = sequelize;