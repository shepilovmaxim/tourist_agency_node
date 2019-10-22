const Sequelize = require("sequelize");
const db = require("../db/database");

const Role = db.define("role", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
module.exports = Role;

const User = require("./User");

Role.hasMany(User);
