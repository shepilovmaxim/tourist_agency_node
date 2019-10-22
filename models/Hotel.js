const Sequelize = require("sequelize");
const db = require("../db/database");

const Hotel = db.define("hotel", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  stars: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING
  }
});

module.exports = Hotel;
const Tour = require("./Tour");

Hotel.hasOne(Tour, { onDelete: "cascade" });