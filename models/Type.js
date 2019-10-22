const Sequelize = require("sequelize");
const db = require("../db/database");

const Type = db.define("type", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Type;

const Tour = require("./Tour");

Type.hasMany(Tour, { onDelete: "cascade" });

