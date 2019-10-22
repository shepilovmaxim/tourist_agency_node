const Sequelize = require("sequelize");
const db = require("../db/database");

const Status = db.define("status", {
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

module.exports = Status;